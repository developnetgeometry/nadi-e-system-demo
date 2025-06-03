import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: number;
  staff_id: string;
  site_id: number;
  attend_date: string;
  check_in: string | null;
  check_out: string | null;
  status: boolean;
  remark: string | null;
  total_working_hour: number;
  longtitude_check_in: number | null; // Fixed column name with extra 't'
  latitude_check_in: number | null;
  longtitude_check_out: number | null; // Fixed column name with extra 't'
  latitude_check_out: number | null;
  address: string | null;
  photo_path: string | null;
  attendance_type: number;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  nd_staff_profile?: {
    fullname: string;
    ic_no: string;
    mobile_no: string;
  };
  nd_site_profile?: {
    sitename: string;
    dusp_tp?: {
      id: string;
      name: string;
      parent?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface AttendanceAnalytics {
  totalPresent: number;
  totalCheckIn: number;
  totalCheckOut: number;
  averageWorkingHours: number;
}

export interface AttendanceFilters {
  siteId?: number;
  tpId?: string;
  duspId?: string;
  status?: string;
}

export const getStaffAttendanceByDate = async (
  date: string,
  filters?: AttendanceFilters,
  organizationId?: string
): Promise<{ records: AttendanceRecord[]; analytics: AttendanceAnalytics }> => {
  try {
    console.log(
      `Fetching attendance for date: ${date}, filters:`,
      filters,
      `orgId: ${organizationId}`
    );

    // Get attendance records for the specific date - only select columns that exist
    let attendanceQuery = supabase
      .from("nd_staff_attendance")
      .select("*")
      .eq("attend_date", date);

    if (filters?.siteId) {
      attendanceQuery = attendanceQuery.eq("site_id", filters.siteId);
    }

    const { data: attendanceRecords, error: attendanceError } =
      await attendanceQuery;

    if (attendanceError) {
      console.error("Error fetching attendance records:", attendanceError);
      throw attendanceError;
    }

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return {
        records: [],
        analytics: {
          totalPresent: 0,
          totalCheckIn: 0,
          totalCheckOut: 0,
          averageWorkingHours: 0,
        },
      };
    }

    // Get staff IDs from attendance records
    const staffIds = attendanceRecords.map((record) => record.staff_id);

    // Get staff profile details including phone numbers
    const { data: staffProfiles, error: staffError } = await supabase
      .from("nd_staff_profile")
      .select("user_id, fullname, ic_no, mobile_no")
      .in("user_id", staffIds);

    if (staffError) {
      console.error("Error fetching staff profiles:", staffError);
    }

    // Get site details
    const siteIds = [
      ...new Set(
        attendanceRecords.map((record) => record.site_id).filter(Boolean)
      ),
    ];
    let siteDetails = [];

    if (siteIds.length > 0) {
      const { data: sites, error: siteError } = await supabase
        .from("nd_site_profile")
        .select(
          `
          id, 
          sitename,
          dusp_tp_id
        `
        )
        .in("id", siteIds);

      if (siteError) {
        console.error("Error fetching site details:", siteError);
      } else {
        siteDetails = sites || [];
      }
    }

    // Get DUSP/TP organization details
    const duspTpIds = siteDetails
      .map((site) => site.dusp_tp_id)
      .filter(Boolean);

    let orgDetails = [];
    if (duspTpIds.length > 0) {
      const { data: organizations, error: orgError } = await supabase
        .from("organizations")
        .select(
          `
          id,
          name,
          parent_id
        `
        )
        .in("id", duspTpIds);

      if (orgError) {
        console.error("Error fetching organization details:", orgError);
      } else {
        orgDetails = organizations || [];
      }
    }

    // Get parent organization details (TP for DUSP)
    const parentIds = orgDetails.map((org) => org.parent_id).filter(Boolean);

    let parentOrgDetails = [];
    if (parentIds.length > 0) {
      const { data: parentOrgs, error: parentError } = await supabase
        .from("organizations")
        .select("id, name")
        .in("id", parentIds);

      if (parentError) {
        console.error(
          "Error fetching parent organization details:",
          parentError
        );
      } else {
        parentOrgDetails = parentOrgs || [];
      }
    }

    // Combine attendance records with staff, site, and organization details
    let detailedRecords: AttendanceRecord[] = attendanceRecords.map(
      (record) => {
        const staffDetail = staffProfiles?.find(
          (staff) => staff.user_id === record.staff_id
        );
        const siteDetail = siteDetails.find(
          (site) => site.id === record.site_id
        );
        const orgDetail = orgDetails.find(
          (org) => org.id === siteDetail?.dusp_tp_id
        );
        const parentOrgDetail = parentOrgDetails.find(
          (parent) => parent.id === orgDetail?.parent_id
        );

        return {
          ...record,
          nd_staff_profile: staffDetail
            ? {
                fullname: staffDetail.fullname,
                ic_no: staffDetail.ic_no,
                mobile_no: staffDetail.mobile_no,
              }
            : undefined,
          nd_site_profile: siteDetail
            ? {
                sitename: siteDetail.sitename,
                dusp_tp: orgDetail
                  ? {
                      id: orgDetail.id,
                      name: orgDetail.name,
                      parent: parentOrgDetail
                        ? {
                            id: parentOrgDetail.id,
                            name: parentOrgDetail.name,
                          }
                        : undefined,
                    }
                  : undefined,
              }
            : undefined,
        };
      }
    );

    // Apply additional filters
    if (filters?.tpId) {
      detailedRecords = detailedRecords.filter(
        (record) => record.nd_site_profile?.dusp_tp?.parent?.id === filters.tpId
      );
    }

    if (filters?.duspId) {
      detailedRecords = detailedRecords.filter(
        (record) => record.nd_site_profile?.dusp_tp?.id === filters.duspId
      );
    }

    if (filters?.status && filters.status !== "all") {
      switch (filters.status) {
        case "present":
          detailedRecords = detailedRecords.filter(
            (record) => record.check_in && record.check_out
          );
          break;
        case "absent":
          detailedRecords = detailedRecords.filter(
            (record) => !record.check_in
          );
          break;
        case "checked_in":
          detailedRecords = detailedRecords.filter(
            (record) => record.check_in && !record.check_out
          );
          break;
      }
    }

    // Calculate analytics
    const totalPresent = detailedRecords.filter(
      (record) => record.status === true
    ).length;
    const totalCheckIn = detailedRecords.filter(
      (record) => record.check_in !== null
    ).length;
    const totalCheckOut = detailedRecords.filter(
      (record) => record.check_out !== null
    ).length;

    const workingHours = detailedRecords
      .filter((record) => record.total_working_hour > 0)
      .map((record) => record.total_working_hour);

    const averageWorkingHours =
      workingHours.length > 0
        ? workingHours.reduce((sum, hours) => sum + hours, 0) /
          workingHours.length
        : 0;

    const analytics: AttendanceAnalytics = {
      totalPresent,
      totalCheckIn,
      totalCheckOut,
      averageWorkingHours,
    };

    console.log("Attendance analytics:", analytics);

    return {
      records: detailedRecords,
      analytics,
    };
  } catch (error) {
    console.error("Error in getStaffAttendanceByDate:", error);
    throw error;
  }
};

// Function to get filter options
export const getAttendanceFilterOptions = async () => {
  try {
    // Get sites
    const { data: sites, error: sitesError } = await supabase
      .from("nd_site_profile")
      .select("id, sitename")
      .order("sitename");

    if (sitesError) throw sitesError;

    // Get TP organizations (parent organizations)
    const { data: tpOrgs, error: tpError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("type", "tp")
      .order("name");

    if (tpError) throw tpError;

    // Get DUSP organizations
    const { data: duspOrgs, error: duspError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("type", "dusp")
      .order("name");

    if (duspError) throw duspError;

    return {
      sites: (sites || []).map((site) => ({
        id: site.id,
        name: site.sitename,
      })),
      tpOptions: (tpOrgs || []).map((tp) => ({ id: tp.id, name: tp.name })),
      duspOptions: (duspOrgs || []).map((dusp) => ({
        id: dusp.id,
        name: dusp.name,
      })),
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      sites: [],
      tpOptions: [],
      duspOptions: [],
    };
  }
};

export const getAllStaffAttendanceByDate = async (
  date: string,
  siteId?: number,
  organizationId?: string
) => {
  try {
    let query = supabase
      .from("nd_staff_attendance")
      .select(
        `
        *,
        nd_staff_profile(fullname, ic_no),
        nd_site_profile(sitename)
      `
      )
      .eq("attend_date", date);

    if (siteId) {
      query = query.eq("site_id", siteId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getAllStaffAttendanceByDate:", error);
    throw error;
  }
};

export const recordAttendance = async (attendanceData: any) => {
  try {
    const { data, error } = await supabase
      .from("nd_staff_attendance")
      .upsert(attendanceData)
      .select();

    if (error) {
      console.error("Error recording attendance:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in recordAttendance:", error);
    throw error;
  }
};

export const getSiteStaff = async (
  siteId?: number,
  organizationId?: string
) => {
  try {
    let query = supabase
      .from("nd_staff_job")
      .select(
        `
        staff_id,
        site_id,
        nd_staff_profile(fullname, ic_no, user_id)
      `
      )
      .eq("is_active", true);

    if (siteId) {
      query = query.eq("site_id", siteId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching site staff:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getSiteStaff:", error);
    throw error;
  }
};
