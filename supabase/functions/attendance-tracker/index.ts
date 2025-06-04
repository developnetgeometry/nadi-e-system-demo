

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AttendanceReport {
  date: string;
  summary: {
    total_active_staff: number;
    present_count: number;
    absent_count: number;
    attendance_rate: string;
  };
  present_staff: any[];
  absent_staff: any[];
  generated_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🚀 Starting attendance tracking process...');

    // Get current date in Asia/Kuala_Lumpur timezone
    const now = new Date();
    const malaysiaTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);

    console.log(`📅 Processing attendance for date: ${malaysiaTime} (Malaysia time)`);

    // Get all active staff users (staff_manager and staff_assistant_manager)
    const { data: staffProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, user_type')
      .in('user_type', ['staff_manager', 'staff_assistant_manager']);

    if (profilesError) {
      console.error('❌ Error fetching staff profiles:', profilesError);
      throw profilesError;
    }

    if (!staffProfiles || staffProfiles.length === 0) {
      console.log('ℹ️ No staff manager/assistant manager profiles found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No staff profiles found',
          report: {
            date: malaysiaTime,
            summary: {
              total_active_staff: 0,
              present_count: 0,
              absent_count: 0,
              attendance_rate: '0.00'
            }
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const userIds = staffProfiles.map(profile => profile.id);
    console.log(`👥 Found ${staffProfiles.length} staff profiles to check`);

    // Get corresponding staff profiles that are active and not deleted
    const { data: staffDetails, error: staffError } = await supabase
      .from('nd_staff_profile')
      .select(`
        id,
        user_id,
        fullname,
        ic_no,
        mobile_no,
        work_email,
        is_active
      `)
      .in('user_id', userIds)
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (staffError) {
      console.error('❌ Error fetching staff details:', staffError);
      throw staffError;
    }

    if (!staffDetails || staffDetails.length === 0) {
      console.log('ℹ️ No active staff profiles found in nd_staff_profile');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No active staff profiles found',
          report: {
            date: malaysiaTime,
            summary: {
              total_active_staff: 0,
              present_count: 0,
              absent_count: 0,
              attendance_rate: '0.00'
            }
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Get staff job assignments to determine their sites
    const staffIds = staffDetails.map(staff => staff.id);
    
    const { data: staffJobs, error: jobsError } = await supabase
      .from('nd_staff_job')
      .select(`
        staff_id,
        site_id,
        is_active,
        nd_site_profile(id, sitename)
      `)
      .in('staff_id', staffIds)
      .eq('is_active', true);

    if (jobsError) {
      console.error('❌ Error fetching staff jobs:', jobsError);
      throw jobsError;
    }

    // Only include staff who have corresponding nd_staff_profile records
    const activeStaff = staffProfiles
      .map(profile => {
        const staffDetail = staffDetails.find(s => s.user_id === profile.id);
        if (!staffDetail) {
          console.log(`⚠️ Skipping user ${profile.full_name} (${profile.id}) - no nd_staff_profile record found`);
          return null;
        }

        const job = staffJobs?.find(j => j.staff_id === staffDetail.id);
        
        return {
          ...profile,
          staff_profile: staffDetail,
          job_assignment: job,
          site_info: job?.nd_site_profile
        };
      })
      .filter(staff => staff !== null); // Remove null entries

    console.log(`✅ Found ${activeStaff.length} active staff users with valid nd_staff_profile records`);

    // Check existing attendance records in nd_staff_attendance table
    // Use user_id instead of staff_id for the check
    const validUserIds = activeStaff.map(staff => staff.staff_profile.user_id);
    
    const { data: existingRecords, error: checkError } = await supabase
      .from('nd_staff_attendance')
      .select('staff_id')
      .in('staff_id', validUserIds)
      .eq('attend_date', malaysiaTime);

    if (checkError) {
      console.error('❌ Error checking existing attendance records:', checkError);
      throw checkError;
    }

    const existingStaffIds = existingRecords?.map(record => record.staff_id) || [];
    
    // Filter staff who don't have attendance records yet
    const staffNeedingRecords = activeStaff.filter(staff => 
      !existingStaffIds.includes(staff.staff_profile.user_id)
    );

    console.log(`📊 Found ${existingRecords?.length || 0} existing attendance records`);
    console.log(`📝 Creating ${staffNeedingRecords.length} new attendance records`);

    // Create attendance records for staff without records in nd_staff_attendance
    if (staffNeedingRecords.length > 0) {
      const attendanceRecords = staffNeedingRecords.map(staff => ({
        staff_id: staff.staff_profile.user_id, // Use user_id instead of id
        site_id: staff.job_assignment?.site_id || null,
        attend_date: malaysiaTime,
        check_in: null, // Will be filled when staff actually checks in
        check_out: null,
        status: false, // Mark as absent initially
        attendance_type: 1, // Default attendance type
        created_by: null, // System generated
        updated_by: null
      }));

      console.log(`🔍 Attempting to insert records for user IDs: ${attendanceRecords.map(r => r.staff_id).join(', ')}`);

      const { error: insertError } = await supabase
        .from('nd_staff_attendance')
        .insert(attendanceRecords);

      if (insertError) {
        console.error('❌ Error creating attendance records:', insertError);
        throw insertError;
      }

      console.log(`✅ Created ${attendanceRecords.length} attendance records in nd_staff_attendance`);
    }

    // Get all attendance records for the report - fetch them separately to avoid relationship issues
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('nd_staff_attendance')
      .select('*')
      .in('staff_id', validUserIds)
      .eq('attend_date', malaysiaTime);

    if (attendanceError) {
      console.error('❌ Error fetching attendance records:', attendanceError);
      throw attendanceError;
    }

    // Get staff profile details for the report
    const { data: staffProfileDetails, error: staffProfileError } = await supabase
      .from('nd_staff_profile')
      .select('user_id, fullname, ic_no')
      .in('user_id', validUserIds);

    if (staffProfileError) {
      console.error('❌ Error fetching staff profile details:', staffProfileError);
      throw staffProfileError;
    }

    // Get site details for the report
    const siteIds = attendanceRecords?.map(record => record.site_id).filter(Boolean) || [];
    let siteDetails = [];
    if (siteIds.length > 0) {
      const { data: sites, error: siteError } = await supabase
        .from('nd_site_profile')
        .select('id, sitename')
        .in('id', siteIds);

      if (siteError) {
        console.error('❌ Error fetching site details:', siteError);
      } else {
        siteDetails = sites || [];
      }
    }

    // Combine attendance records with staff and site details
    const detailedAttendanceRecords = attendanceRecords?.map(record => {
      const staffDetail = staffProfileDetails?.find(staff => staff.user_id === record.staff_id);
      const siteDetail = siteDetails.find(site => site.id === record.site_id);
      
      return {
        ...record,
        nd_staff_profile: staffDetail ? {
          fullname: staffDetail.fullname,
          ic_no: staffDetail.ic_no
        } : null,
        nd_site_profile: siteDetail ? {
          sitename: siteDetail.sitename
        } : null
      };
    }) || [];

    const presentStaff = detailedAttendanceRecords.filter(record => record.check_in !== null);
    const absentStaff = detailedAttendanceRecords.filter(record => record.check_in === null);

    const report: AttendanceReport = {
      date: malaysiaTime,
      summary: {
        total_active_staff: activeStaff.length,
        present_count: presentStaff.length,
        absent_count: absentStaff.length,
        attendance_rate: activeStaff.length > 0 
          ? ((presentStaff.length / activeStaff.length) * 100).toFixed(2) 
          : '0.00'
      },
      present_staff: presentStaff,
      absent_staff: absentStaff,
      generated_at: new Date().toISOString()
    };

    console.log(`📈 Generated attendance report for ${malaysiaTime}:`, report.summary);

    // Try to store tracking log
    try {
      const { error: logError } = await supabase
        .from('attendance_tracking_logs')
        .insert({
          tracking_date: malaysiaTime,
          total_staff: report.summary.total_active_staff,
          present_count: report.summary.present_count,
          absent_count: report.summary.absent_count,
          attendance_rate: parseFloat(report.summary.attendance_rate),
          trigger_type: 'cron',
          created_at: new Date().toISOString()
        });

      if (logError) {
        console.warn('⚠️ Could not store tracking log:', logError.message);
      } else {
        console.log('✅ Tracking log stored successfully');
      }
    } catch (logError) {
      console.warn('⚠️ Tracking log table not available:', logError);
    }

    console.log('🎉 Attendance tracking completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Attendance tracking completed successfully',
        report: report,
        records_created: staffNeedingRecords.length,
        skipped_users: staffProfiles.length - activeStaff.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('💥 Error in attendance tracking:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

