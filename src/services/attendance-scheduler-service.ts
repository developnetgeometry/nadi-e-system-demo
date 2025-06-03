
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface AttendanceSchedulerService {
  trackStaffAttendance: () => Promise<void>;
  getActiveStaffUsers: () => Promise<any[]>;
  checkMissedAttendance: (date: string) => Promise<any[]>;
  generateAttendanceReport: (date: string) => Promise<any>;
  triggerAttendanceTracking: () => Promise<any>;
}

export const AttendanceSchedulerService: AttendanceSchedulerService = {
  // Get all active staff users (staff_manager and staff_assistant_manager)
  async getActiveStaffUsers(): Promise<any[]> {
    try {
      // First, get profiles with staff_manager and staff_assistant_manager user types
      const { data: staffProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type')
        .in('user_type', ['staff_manager', 'staff_assistant_manager']);

      if (profilesError) throw profilesError;

      if (!staffProfiles || staffProfiles.length === 0) {
        console.log('No staff manager/assistant manager profiles found');
        return [];
      }

      const userIds = staffProfiles.map(profile => profile.id);

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

      if (staffError) throw staffError;

      if (!staffDetails || staffDetails.length === 0) {
        console.log('No active staff profiles found');
        return [];
      }

      // Get staff job assignments to determine their sites
      const staffIds = staffDetails.map(staff => staff.id);
      
      const { data: staffJobs, error: jobsError } = await supabase
        .from('nd_staff_job')
        .select(`
          staff_id,
          site_id,
          is_active,
          nd_site_profile(id, sitename, organization_id)
        `)
        .in('staff_id', staffIds)
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      // Combine the data
      const activeStaff = staffProfiles.map(profile => {
        const staffDetail = staffDetails.find(s => s.user_id === profile.id);
        if (!staffDetail) return null;

        const job = staffJobs?.find(j => j.staff_id === staffDetail.id);
        
        return {
          ...profile,
          staff_profile: staffDetail,
          job_assignment: job,
          site_info: job?.nd_site_profile
        };
      }).filter(staff => staff && staff.staff_profile);

      console.log(`Found ${activeStaff.length} active staff users to track`);
      return activeStaff;
    } catch (error) {
      console.error('Error fetching active staff users:', error);
      throw error;
    }
  },

  // Check for missed attendance for a specific date
  async checkMissedAttendance(date: string): Promise<any[]> {
    try {
      const activeStaff = await this.getActiveStaffUsers();
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');
      
      if (activeStaff.length === 0) {
        return [];
      }

      const staffIds = activeStaff.map(staff => staff.staff_profile.id);

      // Check attendance records in nd_staff_attendance table
      const { data: attendanceRecords, error: attendanceError } = await supabase
        .from('nd_staff_attendance')
        .select('staff_id, check_in, check_out')
        .in('staff_id', staffIds)
        .eq('attend_date', formattedDate);

      if (attendanceError) throw attendanceError;

      // Find staff with missed attendance
      const missedAttendance = activeStaff.filter(staff => {
        const hasAttendance = attendanceRecords?.some(
          record => record.staff_id === staff.staff_profile.id
        );
        return !hasAttendance;
      });

      console.log(`Found ${missedAttendance.length} staff with missed attendance for ${formattedDate}`);
      return missedAttendance;
    } catch (error) {
      console.error('Error checking missed attendance:', error);
      throw error;
    }
  },

  // Generate attendance report for tracking
  async generateAttendanceReport(date: string): Promise<any> {
    try {
      const activeStaff = await this.getActiveStaffUsers();
      const missedAttendance = await this.checkMissedAttendance(date);
      const formattedDate = format(new Date(date), 'yyyy-MM-dd');

      const staffIds = activeStaff.map(staff => staff.staff_profile.id);

      // Get all attendance records from nd_staff_attendance table
      const { data: attendanceRecords, error: attendanceError } = await supabase
        .from('nd_staff_attendance')
        .select(`
          *,
          nd_staff_profile(fullname, ic_no),
          nd_site_profile(sitename)
        `)
        .in('staff_id', staffIds)
        .eq('attend_date', formattedDate);

      if (attendanceError) throw attendanceError;

      const presentStaff = attendanceRecords || [];
      const absentStaff = missedAttendance;

      const report = {
        date: formattedDate,
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

      console.log(`Generated attendance report for ${formattedDate}:`, report.summary);
      return report;
    } catch (error) {
      console.error('Error generating attendance report:', error);
      throw error;
    }
  },

  // Trigger attendance tracking via edge function
  async triggerAttendanceTracking(): Promise<any> {
    try {
      console.log('Triggering attendance tracking via edge function...');
      
      const { data, error } = await supabase.functions.invoke('attendance-tracker', {
        body: { 
          trigger: 'manual', 
          timezone: 'Asia/Kuala_Lumpur',
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error calling attendance tracker function:', error);
        throw error;
      }

      console.log('Attendance tracking function response:', data);
      return data;
    } catch (error) {
      console.error('Error triggering attendance tracking:', error);
      throw error;
    }
  },

  // Main tracking function that creates attendance records in nd_staff_attendance
  async trackStaffAttendance(): Promise<void> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      console.log(`Running attendance tracking for ${today}`);

      const activeStaff = await this.getActiveStaffUsers();
      
      if (activeStaff.length === 0) {
        console.log('No active staff found to track attendance');
        return;
      }

      // Create attendance records for staff who haven't checked in
      const staffIds = activeStaff.map(staff => staff.staff_profile.id);
      
      // Check existing attendance records
      const { data: existingRecords, error: checkError } = await supabase
        .from('nd_staff_attendance')
        .select('staff_id')
        .in('staff_id', staffIds)
        .eq('attend_date', today);

      if (checkError) {
        console.error('Error checking existing attendance records:', checkError);
        throw checkError;
      }

      const existingStaffIds = existingRecords?.map(record => record.staff_id) || [];
      
      // Filter staff who don't have attendance records yet
      const staffNeedingRecords = activeStaff.filter(staff => 
        !existingStaffIds.includes(staff.staff_profile.id)
      );

      if (staffNeedingRecords.length > 0) {
        // Create attendance records for staff without records
        const attendanceRecords = staffNeedingRecords.map(staff => ({
          staff_id: staff.staff_profile.id,
          site_id: staff.job_assignment?.site_id || null,
          attend_date: today,
          check_in: null, // Will be filled when staff actually checks in
          check_out: null,
          status: false, // Mark as absent initially
          attendance_type: 1, // Default attendance type
          created_by: null, // System generated
          updated_by: null
        }));

        const { error: insertError } = await supabase
          .from('nd_staff_attendance')
          .insert(attendanceRecords);

        if (insertError) {
          console.error('Error creating attendance records:', insertError);
          throw insertError;
        }

        console.log(`Created ${attendanceRecords.length} attendance records in nd_staff_attendance`);
      }

      // Generate daily report
      const report = await this.generateAttendanceReport(today);

      // Try to store tracking log (table might not exist)
      try {
        const { error: logError } = await supabase
          .from('attendance_tracking_logs')
          .insert({
            tracking_date: today,
            total_staff: report.summary.total_active_staff,
            present_count: report.summary.present_count,
            absent_count: report.summary.absent_count,
            attendance_rate: parseFloat(report.summary.attendance_rate),
            trigger_type: 'cron',
            created_at: new Date().toISOString()
          });

        if (logError) {
          console.warn('Could not store tracking log (table might not exist):', logError.message);
        }
      } catch (logError) {
        console.warn('Tracking log table not available:', logError);
      }

      // Log the report for monitoring
      console.log('Daily Attendance Summary:', {
        date: today,
        totalStaff: report.summary.total_active_staff,
        present: report.summary.present_count,
        absent: report.summary.absent_count,
        attendanceRate: report.summary.attendance_rate + '%'
      });

      console.log(`Attendance tracking completed for ${today}`);
    } catch (error) {
      console.error('Error in attendance tracking:', error);
      throw error;
    }
  }
};
