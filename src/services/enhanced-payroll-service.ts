import { supabase } from "@/integrations/supabase/client";
import {
  PayrollRecord,
  PayrollFormData,
  StaffEmployee,
  PayrollFilter,
} from "@/types/payroll";
import { notificationService } from "@/services/notification-service";

export class PayrollService {
  // Fetch staff employees under a TP organization
  static async fetchStaffEmployees(
    organizationId: string
  ): Promise<StaffEmployee[]> {
    try {
      const { data, error } = await supabase
        .from("nd_staff_profile")
        .select(
          `
          id,
          fullname,
          ic_no,
          is_active,
          user_id,
          job_id,
          nd_staff_job!nd_staff_profile_job_id_fkey (
            id,
            position_id,
            site_id,
            is_active,
            nd_position (
              id,
              name
            ),
            nd_site_profile (
              id,
              sitename,
              dusp_tp_id,
              organizations (
                id,
                name
              )
            )
          ),
          nd_staff_pay_info!nd_staff_profile_staff_pay_id_fkey (
            basic_pay
          )
        `
        )
        .eq("is_active", true);

      if (error) throw error;

      // Filter data in JavaScript since some staff may not have job_id assigned yet
      const filteredData =
        data?.filter((staff) => {
          // Skip staff without job assignment
          if (!staff.job_id || !staff.nd_staff_job) {
            return false;
          }

          // Check if staff job is in the specified organization
          const siteProfile = staff.nd_staff_job.nd_site_profile;
          if (!siteProfile || siteProfile.dusp_tp_id !== organizationId) {
            return false;
          }

          // Check if job is active
          if (!staff.nd_staff_job.is_active) {
            return false;
          }

          // Check if position is staff_manager or staff_assistant_manager
          const positionName = staff.nd_staff_job.nd_position?.name;
          return (
            positionName === "staff_manager" ||
            positionName === "staff_assistant_manager"
          );
        }) || [];

      return filteredData.map((staff) => ({
        id: staff.id,
        fullname: staff.fullname || "",
        icNo: staff.ic_no || "",
        position: staff.nd_staff_job?.nd_position?.name || "Unknown",
        positionName: staff.nd_staff_job?.nd_position?.name,
        organizationId:
          staff.nd_staff_job?.nd_site_profile?.organizations?.id ||
          organizationId,
        organizationName:
          staff.nd_staff_job?.nd_site_profile?.organizations?.name || "",
        siteName: staff.nd_staff_job?.nd_site_profile?.sitename || "",
        siteId: staff.nd_staff_job?.site_id, // Add siteId from nd_staff_job
        isActive: staff.is_active || false,
        basicPay: staff.nd_staff_pay_info?.basic_pay || 0, // Handle null staff_pay_id
      }));
    } catch (error) {
      console.error("Error fetching staff employees:", error);
      return [];
    }
  }

  // Alias for fetchStaffEmployees for compatibility
  static async fetchEmployees(
    organizationId: string
  ): Promise<StaffEmployee[]> {
    return this.fetchStaffEmployees(organizationId);
  }

  // Fetch payroll records with filters
  static async fetchPayrollRecords(
    filters: PayrollFilter,
    userOrganizationId?: string
  ): Promise<PayrollRecord[]> {
    try {
      let query = supabase.from("nd_staff_payroll").select(`
          *,
          nd_staff_profile!inner (
            id,
            fullname,
            ic_no,
            nd_staff_job!nd_staff_profile_job_id_fkey (
              id,
              nd_position (name),
              nd_site_profile (
                id,
                sitename,
                organizations (
                  id,
                  name
                )
              )
            )
          )
        `);

      // Apply filters
      if (userOrganizationId) {
        query = query.eq("organization_id", userOrganizationId);
      }

      if (filters.staffId) {
        query = query.eq("staff_id", filters.staffId);
      }

      if (filters.month) {
        query = query.eq("month", filters.month);
      }

      if (filters.year) {
        query = query.eq("year", filters.year);
      }

      if (filters.siteId) {
        query = query.eq("site_id", filters.siteId);
      }

      if (filters.search) {
        query = query.or(
          `nd_staff_profile.fullname.ilike.%${filters.search}%,nd_staff_profile.ic_no.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return (
        data?.map((record) => ({
          id: record.id,
          staffId: record.staff_id || "",
          staffJobId: record.staff_job_id,
          organizationId: record.organization_id,
          employeeName: record.nd_staff_profile?.fullname || "Unknown",
          employeeIcNo: record.nd_staff_profile?.ic_no || "",
          position:
            record.nd_staff_profile?.nd_staff_job?.[0]?.nd_position?.name ||
            "Unknown",
          organizationName:
            record.nd_staff_profile?.nd_staff_job?.[0]?.nd_site_profile
              ?.organizations?.name || "Unknown",
          siteName:
            record.nd_staff_profile?.nd_staff_job?.[0]?.nd_site_profile
              ?.sitename || "Unknown",
          month: record.month || 1,
          year: record.year || new Date().getFullYear(),
          payToDate:
            record.payroll_date || new Date().toISOString().split("T")[0],
          earnings: record.earnings_json || {
            basicPay: record.basic_pay || 0,
            allowance: record.allowance || 0,
            overtime: record.overtime || 0,
            bonus: record.bonus || 0,
            grossPay: record.gross_pay || 0,
          },
          employerDeductions: record.employer_deductions || [],
          employeeDeductions: record.employee_deductions || [],
          netPay: record.net_pay || 0,
          basicRate: record.basic_rate || 0,
          createdBy: record.created_by || "",
          createdAt: record.created_at || "",
          updatedAt: record.updated_at || "",
          status: "approved", // Default status since column was removed
          approvedBy: record.approved_by,
          approvedAt: record.approved_at,
          paymentReference: record.payment_reference,
          bankReference: record.bank_reference,
          paymentReference: record.payment_reference,
          bankReference: record.bank_reference,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      return [];
    }
  }

  // Create or update payroll record
  static async savePayrollRecord(
    data: PayrollFormData,
    organizationId: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Get staff job information
      const { data: staffJob } = await supabase
        .from("nd_staff_job")
        .select("id, site_id")
        .eq("staff_profile_id", data.staffId)
        .eq("is_active", true)
        .single();

      // Calculate totals
      const totalEmployerDeductions = data.employerDeductions.reduce(
        (sum, deduction) => sum + deduction.amount,
        0
      );
      const totalEmployeeDeductions = data.employeeDeductions.reduce(
        (sum, deduction) => sum + deduction.amount,
        0
      );
      const netPay = data.earnings.grossPay - totalEmployeeDeductions;

      const payrollRecord = {
        staff_id: data.staffId,
        staff_job_id: staffJob?.id,
        site_id: staffJob?.site_id,
        organization_id: organizationId,
        month: data.month,
        year: data.year,
        payroll_date: data.payToDate,
        // Use both old and new column structures for compatibility
        basic_pay: data.earnings.basicPay,
        allowance: data.earnings.allowance || 0,
        overtime: data.earnings.overtime || 0,
        bonus: 0, // Legacy field
        gross_pay: data.earnings.grossPay,
        earnings_json: data.earnings,
        employer_deductions: data.employerDeductions,
        employee_deductions: data.employeeDeductions,
        total_employer_deductions: totalEmployerDeductions,
        total_employee_deductions: totalEmployeeDeductions,
        net_pay: netPay,
        basic_rate: data.earnings.grossPay,
        created_by: userId,
        approved_by: userId,
        approved_at: new Date().toISOString(),
      };

      // Check if record exists for this staff, month, and year
      const { data: existingRecord } = await supabase
        .from("nd_staff_payroll")
        .select("id")
        .eq("staff_id", data.staffId)
        .eq("month", data.month)
        .eq("year", data.year)
        .single();

      let result;
      let isNewRecord = false;

      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from("nd_staff_payroll")
          .update({ ...payrollRecord, updated_at: new Date().toISOString() })
          .eq("id", existingRecord.id);
      } else {
        // Create new record
        result = await supabase.from("nd_staff_payroll").insert(payrollRecord);
        isNewRecord = true;
      }

      if (result.error) throw result.error;

      // Send notification to staff member when payroll is created/updated
      if (isNewRecord || !existingRecord) {
        try {
          await notificationService.sendPayrollNotification(
            data.staffId,
            data.month,
            data.year,
            netPay
          );
        } catch (notificationError) {
          console.warn(
            "Failed to send payroll notification:",
            notificationError
          );
          // Don't fail the payroll creation if notification fails
        }
      }

      return true;
    } catch (error) {
      console.error("Error saving payroll record:", error);
      return false;
    }
  }

  // Delete payroll record
  static async deletePayrollRecord(recordId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("nd_staff_payroll")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting payroll record:", error);
      return false;
    }
  }

  // Get payroll statistics
  static async getPayrollStats(
    organizationId: string,
    month?: number,
    year?: number
  ) {
    try {
      let query = supabase
        .from("nd_staff_payroll")
        .select("gross_pay, net_pay, total_employee_deductions")
        .eq("organization_id", organizationId);

      if (month) query = query.eq("month", month);
      if (year) query = query.eq("year", year);

      const { data, error } = await query;

      if (error) throw error;

      const stats = data?.reduce(
        (acc, record) => ({
          totalEmployees: acc.totalEmployees + 1,
          totalGrossPay: acc.totalGrossPay + (record.gross_pay || 0),
          totalNetPay: acc.totalNetPay + (record.net_pay || 0),
          totalDeductions:
            acc.totalDeductions + (record.total_employee_deductions || 0),
          averageSalary: 0, // Will be calculated after
        }),
        {
          totalEmployees: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
          totalDeductions: 0,
          averageSalary: 0,
        }
      );

      if (stats && stats.totalEmployees > 0) {
        stats.averageSalary = stats.totalGrossPay / stats.totalEmployees;
      }

      return (
        stats || {
          totalEmployees: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
          totalDeductions: 0,
          averageSalary: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching payroll stats:", error);
      return {
        totalEmployees: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalDeductions: 0,
        averageSalary: 0,
      };
    }
  }

  // Approve payroll record
  static async approvePayrollRecord(
    recordId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("nd_staff_payroll")
        .update({
          status: "approved",
          approved_by: userId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", recordId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error approving payroll record:", error);
      return false;
    }
  }

  // Bulk create payroll records
  static async bulkCreatePayrollRecords(
    records: PayrollFormData[],
    organizationId: string,
    userId: string
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const record of records) {
      const result = await this.savePayrollRecord(
        record,
        organizationId,
        userId
      );
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }
}
