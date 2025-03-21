
import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export type StaffAttendance = {
  id?: number;
  staff_id: number;
  site_id: number;
  attend_date: string;
  check_in?: string;
  check_out?: string;
  total_working_hour?: number;
  status?: boolean;
  attendance_type?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  photo_path?: string;
  remark?: string;
};

export async function recordAttendance(attendanceData: StaffAttendance) {
  try {
    // Get current user to use as created_by
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      throw new Error("Authentication required");
    }

    // Check if attendance already exists for today for this staff
    const today = format(new Date(attendanceData.attend_date), 'yyyy-MM-dd');
    
    const { data: existingAttendance, error: checkError } = await supabase
      .from("nd_staff_attendance")
      .select("*")
      .eq("staff_id", attendanceData.staff_id)
      .eq("attend_date", today)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing attendance:", checkError);
      throw new Error(`Error checking attendance: ${checkError.message}`);
    }

    if (existingAttendance) {
      // Update existing attendance (e.g., check out or update)
      const { data, error } = await supabase
        .from("nd_staff_attendance")
        .update({
          check_out: attendanceData.check_out || existingAttendance.check_out,
          total_working_hour: calculateWorkingHours(
            existingAttendance.check_in,
            attendanceData.check_out || existingAttendance.check_out
          ),
          updated_by: currentUser.id,
          latitude: attendanceData.latitude || existingAttendance.latitude,
          longitude: attendanceData.longitude || existingAttendance.longitude,
          address: attendanceData.address || existingAttendance.address,
          remark: attendanceData.remark || existingAttendance.remark,
          status: attendanceData.status !== undefined ? attendanceData.status : existingAttendance.status,
        })
        .eq("id", existingAttendance.id)
        .select();

      if (error) {
        console.error("Error updating attendance:", error);
        throw new Error(`Error updating attendance: ${error.message}`);
      }

      return { success: true, data, isCheckout: true };
    } else {
      // Create new attendance record
      const { data, error } = await supabase
        .from("nd_staff_attendance")
        .insert({
          staff_id: attendanceData.staff_id,
          site_id: attendanceData.site_id,
          attend_date: today,
          check_in: attendanceData.check_in,
          attendance_type: attendanceData.attendance_type || 1, // Default attendance type
          latitude: attendanceData.latitude,
          longitude: attendanceData.longitude,
          address: attendanceData.address,
          photo_path: attendanceData.photo_path,
          remark: attendanceData.remark,
          status: attendanceData.status !== undefined ? attendanceData.status : true,
          created_by: currentUser.id,
          updated_by: currentUser.id,
        })
        .select();

      if (error) {
        console.error("Error creating attendance:", error);
        throw new Error(`Error creating attendance: ${error.message}`);
      }

      return { success: true, data, isCheckout: false };
    }
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
}

export async function getStaffAttendance(staffId: number, month?: number, year?: number) {
  try {
    const currentDate = new Date();
    const selectedMonth = month !== undefined ? month : currentDate.getMonth() + 1;
    const selectedYear = year !== undefined ? year : currentDate.getFullYear();

    // Create date range for the selected month
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    let endMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    let endYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const { data, error } = await supabase
      .from("nd_staff_attendance")
      .select(`
        *,
        nd_staff_profile(fullname),
        nd_site_profile(sitename)
      `)
      .eq("staff_id", staffId)
      .gte("attend_date", startDate)
      .lt("attend_date", endDate)
      .order("attend_date", { ascending: false });

    if (error) {
      console.error("Error fetching staff attendance:", error);
      throw new Error(`Error fetching attendance: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getStaffAttendance:", error);
    throw error;
  }
}

export async function getAllStaffAttendanceByDate(date: string, siteId?: number) {
  try {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    
    let query = supabase
      .from("nd_staff_attendance")
      .select(`
        *,
        nd_staff_profile(id, fullname, mobile_no),
        nd_site_profile(id, sitename)
      `)
      .eq("attend_date", formattedDate);
    
    if (siteId) {
      query = query.eq("site_id", siteId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching attendance by date:", error);
      throw new Error(`Error fetching attendance: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getAllStaffAttendanceByDate:", error);
    throw error;
  }
}

function calculateWorkingHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  
  // Calculate the difference in milliseconds
  const timeDiff = checkOutTime - checkInTime;
  
  // Convert to hours
  return parseFloat((timeDiff / (1000 * 60 * 60)).toFixed(2));
}
