
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AttendanceStats {
  presentToday: number;
  onTime: number;
  late: number;
  absent: number;
  totalStaff: number;
}

export const useAttendanceStats = (siteId?: number, organizationId?: string) => {
  const [stats, setStats] = useState<AttendanceStats>({
    presentToday: 0,
    onTime: 0,
    late: 0,
    absent: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAttendanceStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Build the query for today's attendance
      let attendanceQuery = supabase
        .from('nd_staff_attendance')
        .select('*')
        .eq('attend_date', today);

      // Apply site filter if provided
      if (siteId) {
        attendanceQuery = attendanceQuery.eq('site_id', siteId);
      }

      const { data: attendanceData, error: attendanceError } = await attendanceQuery;

      if (attendanceError) {
        console.error('Error fetching attendance data:', attendanceError);
        throw attendanceError;
      }

      // Get total staff count for the site/organization
      let staffQuery = supabase
        .from('nd_staff_job')
        .select('staff_id, nd_staff_profile(user_id)')
        .eq('is_active', true);

      if (siteId) {
        staffQuery = staffQuery.eq('site_id', siteId);
      }

      const { data: staffData, error: staffError } = await staffQuery;

      if (staffError) {
        console.error('Error fetching staff data:', staffError);
      }

      const totalStaff = staffData?.length || 0;
      const attendanceRecords = attendanceData || [];

      // Calculate statistics
      const presentToday = attendanceRecords.filter(record => 
        record.check_in && record.check_out
      ).length;

      const checkedInOnly = attendanceRecords.filter(record => 
        record.check_in && !record.check_out
      ).length;

      // For "On Time" - consider those who checked in and have check_in time
      // You might want to adjust this logic based on your business rules
      const onTime = attendanceRecords.filter(record => {
        if (!record.check_in) return false;
        // Assuming 9:00 AM is the standard check-in time
        const checkInTime = new Date(`2000-01-01T${record.check_in}`);
        const standardTime = new Date(`2000-01-01T09:00:00`);
        return checkInTime <= standardTime;
      }).length;

      // Late - those who checked in after the standard time
      const late = attendanceRecords.filter(record => {
        if (!record.check_in) return false;
        const checkInTime = new Date(`2000-01-01T${record.check_in}`);
        const standardTime = new Date(`2000-01-01T09:00:00`);
        return checkInTime > standardTime;
      }).length;

      // Absent - total staff minus those who checked in
      const totalCheckedIn = attendanceRecords.filter(record => record.check_in).length;
      const absent = Math.max(0, totalStaff - totalCheckedIn);

      setStats({
        presentToday: presentToday + checkedInOnly, // Include both completed and ongoing attendance
        onTime,
        late,
        absent,
        totalStaff,
      });

    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStats();
  }, [siteId, organizationId]);

  return {
    stats,
    loading,
    refetch: fetchAttendanceStats,
  };
};
