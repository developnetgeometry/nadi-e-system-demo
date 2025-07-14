import { supabase } from "@/integrations/supabase/client";
import {
  PayrollRecord,
  PayrollFormData,
  StaffEmployee,
  PayrollFilter,
} from "@/types/payroll";
import { notificationService } from "@/services/notification-service";

export class PayrollService {
  // Fetch staff employees for TP organization
  static async fetchStaffEmployees(
    organizationId: string
  ): Promise<StaffEmployee[]> {
    try {
      // Get staff job information
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

      console.log("Raw data from database:", data);
      console.log("Error:", error);
      console.log("Data length:", data?.length || 0);

      if (error) throw error;

      // Filter data in JavaScript since some staff may not have job_id assigned yet
      const filteredData =
        data?.filter((staff) => {
          console.log(`\n--- Checking staff: ${staff.fullname} ---`);
          console.log("Staff ID:", staff.id);
          console.log("Job ID:", staff.job_id);
          console.log("nd_staff_job:", staff.nd_staff_job);

          // Skip staff without job assignment
          if (!staff.job_id || !staff.nd_staff_job) {
            console.log("❌ No job assignment - FILTERED OUT");
            return false;
          }

          // Check if staff job is in the specified organization
          const siteProfile = staff.nd_staff_job.nd_site_profile;
          console.log("Site Profile:", siteProfile);
          console.log("Site Profile dusp_tp_id:", siteProfile?.dusp_tp_id);
          console.log("Looking for organization ID:", organizationId);

          if (!siteProfile || siteProfile.dusp_tp_id !== organizationId) {
            console.log("❌ Not in specified organization - FILTERED OUT");
            return false;
          }

          // Check if job is active
          console.log("Job is_active:", staff.nd_staff_job.is_active);
          if (!staff.nd_staff_job.is_active) {
            console.log("❌ Job is not active - FILTERED OUT");
            return false;
          }

          // Check if position is staff_manager or staff_assistant_manager
          const positionName = staff.nd_staff_job.nd_position?.name;
          console.log("Position name:", positionName);
          const isValidPosition =
            positionName === "staff_manager" ||
            positionName === "staff_assistant_manager" ||
            positionName === "Assistant Manager" ||
            positionName === "Manager";
          console.log("Is valid position:", isValidPosition);

          if (!isValidPosition) {
            console.log(
              "❌ Not staff_manager or staff_assistant_manager or Manager or Assistant Manager- FILTERED OUT"
            );
            return false;
          }

          console.log("✅ PASSED ALL FILTERS");
          return true;
        }) || [];

      console.log("\n=== FILTERING RESULTS ===");
      console.log("Total staff profiles:", data?.length || 0);
      console.log("Filtered staff count:", filteredData.length);
      console.log("Filtered data:", filteredData);

      const mappedData = filteredData.map((staff) => {
        const result = {
          id: staff.id,
          fullname: staff.fullname || "Unknown",
          icNo: staff.ic_no || "",
          position: staff.nd_staff_job?.nd_position?.name || "Unknown",
          positionName: staff.nd_staff_job?.nd_position?.name,
          organizationId:
            staff.nd_staff_job?.nd_site_profile?.organizations?.id,
          organizationName:
            staff.nd_staff_job?.nd_site_profile?.organizations?.name,
          siteName: staff.nd_staff_job?.nd_site_profile?.sitename,
          siteId: staff.nd_staff_job?.site_id, // Add siteId from nd_staff_job
          isActive: staff.is_active || false,
          basicPay: staff.nd_staff_pay_info?.basic_pay || 0, // Handle null staff_pay_id
        };

        console.log("Mapped staff:", result);
        return result;
      });

      console.log("=== FINAL RESULT ===");
      console.log("Returning", mappedData.length, "employees");
      console.log("Final mapped data:", mappedData);

      return mappedData;
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

  // Fetch payroll records with filters for TP organization
  static async fetchPayrollRecords(
    filters: PayrollFilter,
    userOrganizationId?: string
  ): Promise<PayrollRecord[]> {
    try {
      // Helper function to ensure numeric values are valid numbers
      const ensureNumber = (value: any): number => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };

      // Helper function to safely parse and validate earnings JSON
      const parseEarnings = (earningsJson: any, fallbackRecord: any) => {
        try {
          let earnings = earningsJson;
          if (typeof earningsJson === "string") {
            earnings = JSON.parse(earningsJson);
          }

          // Ensure all numeric fields are valid numbers
          return {
            basicPay: ensureNumber(
              earnings?.basicPay || fallbackRecord.basic_pay
            ),
            allowance: ensureNumber(
              earnings?.allowance || fallbackRecord.allowance
            ),
            overtime: ensureNumber(
              earnings?.overtime || fallbackRecord.overtime
            ),
            customEarnings: Array.isArray(earnings?.customEarnings)
              ? earnings.customEarnings.map((earning: any) => ({
                  ...earning,
                  amount: ensureNumber(earning.amount),
                }))
              : [],
            performanceIncentive: {
              enabled: earnings?.performanceIncentive?.enabled || false,
              amount: ensureNumber(earnings?.performanceIncentive?.amount),
            },
            grossPay: ensureNumber(
              earnings?.grossPay || fallbackRecord.gross_pay
            ),
          };
        } catch (error) {
          console.warn("Error parsing earnings JSON:", error);
          return {
            basicPay: ensureNumber(fallbackRecord.basic_pay),
            allowance: ensureNumber(fallbackRecord.allowance),
            overtime: ensureNumber(fallbackRecord.overtime),
            customEarnings: [],
            performanceIncentive: {
              enabled: false,
              amount: 0,
            },
            grossPay: ensureNumber(fallbackRecord.gross_pay),
          };
        }
      };

      let query = supabase.from("nd_staff_payroll").select(`
          *,
          nd_staff_profile!inner (
            id,
            fullname,
            ic_no,
            user_id,
            job_id,
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

      // Apply organization filter for TP users
      if (userOrganizationId) {
        query = query.eq("organization_id", userOrganizationId);
      }

      // Apply additional filters with type assertion
      if (filters.staffId) {
        query = (query as any).eq("staff_id", filters.staffId);
      }

      if (filters.month) {
        query = (query as any).eq("month", filters.month);
      }

      if (filters.year) {
        query = (query as any).eq("year", filters.year);
      }

      if (filters.siteId) {
        query = (query as any).eq("site_id", filters.siteId);
      }

      // Execute the query with type assertion
      const { data, error } = await (query as any).order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return (
        data?.map((record) => ({
          id: record.id,
          staffId: record.staff_id,
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
          month: record.month || 0,
          year: record.year || 0,
          payToDate: record.payroll_date,
          earnings: parseEarnings(record.earnings_json, record),
          employerDeductions: record.employer_deductions
            ? typeof record.employer_deductions === "string"
              ? JSON.parse(record.employer_deductions)
              : Array.isArray(record.employer_deductions)
              ? record.employer_deductions.map((deduction: any) => ({
                  ...deduction,
                  // Ensure amount is a number
                  amount: ensureNumber(deduction.amount),
                  name: deduction.name || "",
                }))
              : record.employer_deductions
            : [],
          employeeDeductions: record.employee_deductions
            ? typeof record.employee_deductions === "string"
              ? JSON.parse(record.employee_deductions)
              : Array.isArray(record.employee_deductions)
              ? record.employee_deductions.map((deduction: any) => ({
                  ...deduction,
                  // Ensure amount is a number
                  amount: ensureNumber(deduction.amount),
                  name: deduction.name || "",
                }))
              : record.employee_deductions
            : [],
          totalEmployerDeductions: ensureNumber(
            record.total_employer_deductions
          ),
          totalEmployeeDeductions: ensureNumber(
            record.total_employee_deductions
          ),
          netPay: ensureNumber(record.net_pay),
          basicRate: ensureNumber(record.basic_rate),
          createdBy: record.created_by,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
          status: "approved", // Default status since column was removed
          approvedBy: record.approved_by,
          approvedAt: record.approved_at,
          paymentReference: record.payment_reference,
          bankReference: record.bank_reference,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      return [];
    }
  }

  // Create or update payroll record for TP users
  static async savePayrollRecord(
    data: PayrollFormData,
    organizationId: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Extract user_id from userId parameter if it's a JSON string
      let extractedUserId = userId;
      try {
        const parsedUserId = JSON.parse(userId);
        if (
          parsedUserId &&
          typeof parsedUserId === "object" &&
          parsedUserId.group_profile?.user_id
        ) {
          extractedUserId = parsedUserId.group_profile.user_id;
        }
      } catch (e) {
        // If parsing fails, use the original userId (assuming it's already a UUID)
        extractedUserId = userId;
      }

      console.log("Original userId:", userId);
      console.log("Extracted userId:", extractedUserId);

      // Get staff job information - use raw query to avoid type issues
      const { data: staffJob, error: staffJobError } = await (supabase as any)
        .from("nd_staff_job")
        .select("id, site_id")
        .eq("staff_id", data.staffId)
        .eq("is_active", true)
        .maybeSingle();

      if (staffJobError) {
        console.warn("Error fetching staff job:", staffJobError);
      }

      // Calculate totals
      const customEarningsTotal =
        data.earnings.customEarnings?.reduce(
          (sum, earning) => sum + earning.amount,
          0
        ) || 0;

      const performanceIncentiveAmount = data.earnings.performanceIncentive
        ?.enabled
        ? data.earnings.performanceIncentive.amount
        : 0;

      const totalEmployerDeductions = data.employerDeductions.reduce(
        (sum, deduction) => sum + deduction.amount,
        0
      );
      const totalEmployeeDeductions = data.employeeDeductions.reduce(
        (sum, deduction) => sum + deduction.amount,
        0
      );

      // Calculate gross pay: basic + allowance + overtime + custom earnings + performance incentive
      const grossPay =
        data.earnings.basicPay +
        data.earnings.allowance +
        data.earnings.overtime +
        customEarningsTotal +
        performanceIncentiveAmount;

      const netPay = grossPay - totalEmployeeDeductions;

      // Prepare JSON data for database insertion - convert to strings to avoid format issues
      const earningsJson = JSON.stringify({
        basicPay: Number(data.earnings.basicPay) || 0,
        allowance: Number(data.earnings.allowance) || 0,
        overtime: Number(data.earnings.overtime) || 0,
        customEarnings: data.earnings.customEarnings || [],
        performanceIncentive: data.earnings.performanceIncentive || {
          enabled: false,
          amount: 0,
        },
        grossPay: Number(grossPay) || 0,
      });

      // Convert arrays to JSON strings to avoid format() issues
      const employerDeductionsJson = JSON.stringify(
        data.employerDeductions.map((deduction) => ({
          ...deduction,
          amount: Number(deduction.amount) || 0,
        }))
      );

      const employeeDeductionsJson = JSON.stringify(
        data.employeeDeductions.map((deduction) => ({
          ...deduction,
          amount: Number(deduction.amount) || 0,
        }))
      );

      const payrollRecord = {
        staff_id: data.staffId,
        staff_job_id: staffJob?.id,
        site_id: staffJob?.site_id,
        organization_id: organizationId,
        month: data.month,
        year: data.year,
        payroll_date: data.payToDate,
        // Keep both old and new column structures for compatibility
        basic_pay: data.earnings.basicPay,
        allowance: data.earnings.allowance || 0,
        overtime: data.earnings.overtime || 0,
        bonus: performanceIncentiveAmount, // Store performance incentive as bonus for backward compatibility
        gross_pay: grossPay, // Use calculated gross pay
        earnings_json: earningsJson, // Already stringified JSON
        employer_deductions: employerDeductionsJson, // Already stringified JSON
        employee_deductions: employeeDeductionsJson, // Already stringified JSON
        total_employer_deductions: totalEmployerDeductions,
        total_employee_deductions: totalEmployeeDeductions,
        net_pay: netPay,
        basic_rate: grossPay, // Basic rate refers to gross pay
        created_by: extractedUserId,
        approved_by: extractedUserId,
        approved_at: new Date().toISOString(),
      };

      console.log(
        "Payroll record to save:",
        JSON.stringify(payrollRecord, null, 2)
      );

      // Check if record exists for this staff, month, and year
      const { data: existingRecord } = await supabase
        .from("nd_staff_payroll")
        .select("id")
        .eq("staff_id", data.staffId)
        .eq("month", data.month)
        .eq("year", data.year)
        .maybeSingle();

      let result;
      let isNewRecord = false;

      if (existingRecord) {
        // Update existing record
        console.log("Updating existing record:", existingRecord.id);
        result = await supabase
          .from("nd_staff_payroll")
          .update({
            ...payrollRecord,
            updated_at: new Date().toISOString(),
            updated_by: extractedUserId,
          })
          .eq("id", existingRecord.id);
      } else {
        // Create new record
        console.log("Creating new payroll record");
        result = await supabase.from("nd_staff_payroll").insert(payrollRecord);
        isNewRecord = true;
      }

      console.log("Database operation result:", result);
      if (result.error) {
        console.error("Database error details:", result.error);
        throw result.error;
      }

      // Send notification to staff member when payroll is created or updated
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

  // Fetch staff's own payroll records (for staff users)
  static async fetchStaffOwnPayroll(
    staffUserId: string,
    filters: PayrollFilter
  ): Promise<PayrollRecord[]> {
    try {
      // First get the staff profile using user_id
      const { data: staffProfile } = await supabase
        .from("nd_staff_profile")
        .select("id")
        .eq("user_id", staffUserId)
        .single();

      if (!staffProfile) {
        return [];
      }

      // Then fetch payroll records for this staff
      const updatedFilters = { ...filters, staffId: staffProfile.id };
      return await this.fetchPayrollRecords(updatedFilters);
    } catch (error) {
      console.error("Error fetching staff own payroll:", error);
      return [];
    }
  }

  // Delete payroll record (for TP users only)
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

  // Get payroll statistics for dashboard
  static async getPayrollStats(
    organizationId: string,
    month?: number,
    year?: number
  ) {
    try {
      const currentMonth = month || new Date().getMonth() + 1;
      const currentYear = year || new Date().getFullYear();

      const { data, error } = await supabase
        .from("nd_staff_payroll")
        .select(
          "gross_pay, net_pay, total_employee_deductions, total_employer_deductions"
        )
        .eq("organization_id", organizationId)
        .eq("month", currentMonth)
        .eq("year", currentYear);

      if (error) throw error;

      const records = data || [];
      const totalRecords = records.length;
      const totalGrossPay = records.reduce(
        (sum, record) => sum + (record.gross_pay || 0),
        0
      );
      const totalNetPay = records.reduce(
        (sum, record) => sum + (record.net_pay || 0),
        0
      );
      const totalDeductions = records.reduce(
        (sum, record) => sum + (record.total_employee_deductions || 0),
        0
      );
      const averageSalary = totalRecords > 0 ? totalGrossPay / totalRecords : 0;

      return {
        totalEmployees: totalRecords,
        totalGrossPay,
        totalNetPay,
        totalDeductions,
        averageSalary,
      };
    } catch (error) {
      console.error("Error getting payroll stats:", error);
      return {
        totalEmployees: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalDeductions: 0,
        averageSalary: 0,
      };
    }
  }
}
