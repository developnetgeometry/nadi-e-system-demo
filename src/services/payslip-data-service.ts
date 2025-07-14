import { supabase } from "@/integrations/supabase/client";
import { PayrollRecord } from "@/types/payroll";
import { PayslipStaffInfo, PayslipData } from "@/services/payslip-pdf-service";

export interface CompletePayrollData {
  payrollRecord: PayrollRecord;
  staffProfile: {
    id: string;
    fullname: string;
    ic_no: string;
    user_id: string;
    position_id?: number;
  };
  staffJob: {
    id: number;
    site_id: number;
    position_id?: number;
    nd_position?: {
      id: number;
      name: string;
    };
    nd_site_profile?: {
      id: number;
      sitename: string;
      dusp_tp_id?: string;
      organizations?: {
        id: string;
        name: string;
      };
    };
  };
  staffPayInfo: {
    id: number;
    epf_no?: string;
    socso_no?: string;
    tax_no?: string;
    bank_acc_no?: string;
    bank_id?: number;
    nd_bank?: {
      id: number;
      bank_name: string;
    };
  };
}

export class PayslipDataService {
  /**
   * Fetch complete payroll data for PDF generation
   */
  static async fetchCompletePayrollData(
    payrollRecordId: string
  ): Promise<CompletePayrollData | null> {
    try {
      // First, fetch the payroll record
      const { data: payrollRecord, error: payrollError } = await supabase
        .from("nd_staff_payroll")
        .select("*")
        .eq("id", payrollRecordId)
        .single();

      if (payrollError || !payrollRecord) {
        console.error("Error fetching payroll record:", payrollError);
        return null;
      }

      // Fetch staff profile
      const { data: staffProfile, error: profileError } = await supabase
        .from("nd_staff_profile")
        .select("id, fullname, ic_no, user_id, position_id")
        .eq("id", payrollRecord.staff_id)
        .single();

      if (profileError || !staffProfile) {
        console.error("Error fetching staff profile:", profileError);
        return null;
      }

      // Fetch staff job information
      const { data: staffJob, error: jobError } = await supabase
        .from("nd_staff_job")
        .select(
          `
          id,
          site_id,
          position_id,
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
        `
        )
        .eq("staff_id", staffProfile.id)
        .eq("is_active", true)
        .single();

      if (jobError || !staffJob) {
        console.error("Error fetching staff job:", jobError);
        return null;
      }

      // Fetch staff pay info
      const { data: staffPayInfo, error: payInfoError } = await supabase
        .from("nd_staff_pay_info")
        .select(
          `
          id,
          epf_no,
          socso_no,
          tax_no,
          bank_acc_no,
          bank_id
        `
        )
        .eq("staff_id", staffProfile.id)
        .single();

      if (payInfoError) {
        console.error("Error fetching staff pay info:", payInfoError);
        // Pay info might not exist, so we'll continue without it
      }

      // Fetch bank information separately if bank_id exists
      let bankInfo = null;
      if (staffPayInfo?.bank_id) {
        const { data: bank, error: bankError } = await supabase
          .from("nd_bank_list")
          .select("id, bank_name")
          .eq("id", staffPayInfo.bank_id)
          .single();

        if (!bankError && bank) {
          bankInfo = bank;
        }
      }

      return {
        payrollRecord: this.transformPayrollRecord(
          payrollRecord,
          staffProfile,
          staffJob
        ),
        staffProfile,
        staffJob,
        staffPayInfo: staffPayInfo
          ? {
              ...staffPayInfo,
              nd_bank: bankInfo,
            }
          : {
              id: 0,
              epf_no: undefined,
              socso_no: undefined,
              tax_no: undefined,
              bank_acc_no: undefined,
              bank_id: undefined,
              nd_bank: undefined,
            },
      };
    } catch (error) {
      console.error("Error fetching complete payroll data:", error);
      return null;
    }
  }

  /**
   * Transform database payroll record to PayrollRecord type
   */
  private static transformPayrollRecord(
    dbRecord: any,
    staffProfile: any,
    staffJob: any
  ): PayrollRecord {
    // Parse JSON fields safely
    const parseJsonField = (field: any) => {
      try {
        if (typeof field === "string") {
          return JSON.parse(field);
        }
        return field || null;
      } catch (e) {
        console.warn("Failed to parse JSON field:", field);
        return null;
      }
    };

    const earnings = parseJsonField(dbRecord.earnings_json) || {};
    const employerDeductions =
      parseJsonField(dbRecord.employer_deductions) || [];
    const employeeDeductions =
      parseJsonField(dbRecord.employee_deductions) || [];

    // Ensure deductions are arrays
    const ensureArray = (data: any) => (Array.isArray(data) ? data : []);

    return {
      id: dbRecord.id,
      staffId: dbRecord.staff_id,
      staffJobId: dbRecord.staff_job_id,
      organizationId: dbRecord.organization_id,
      month: dbRecord.month,
      year: dbRecord.year || new Date().getFullYear(),
      payToDate:
        dbRecord.payroll_date || new Date().toISOString().split("T")[0],

      // Staff information
      employeeName: staffProfile.fullname,
      employeeIcNo: staffProfile.ic_no,
      position: staffJob.nd_position?.name || "Unknown Position",
      organizationName:
        staffJob.nd_site_profile?.organizations?.name || "Unknown Organization",
      siteName: staffJob.nd_site_profile?.sitename || "Unknown Site",

      // Earnings
      earnings: {
        basicPay: parseFloat(dbRecord.basic_pay) || 0,
        allowance: parseFloat(dbRecord.allowance) || 0,
        overtime: parseFloat(dbRecord.overtime) || 0,
        customEarnings: ensureArray(earnings.customEarnings),
        performanceIncentive: earnings.performanceIncentive || {
          enabled: false,
          amount: 0,
        },
        grossPay: parseFloat(dbRecord.gross_pay) || 0,
      },

      // Deductions
      employerDeductions: ensureArray(employerDeductions),
      employeeDeductions: ensureArray(employeeDeductions),

      // Calculated values
      totalEmployerDeductions:
        parseFloat(dbRecord.employer_deductions_total) || 0,
      totalEmployeeDeductions:
        parseFloat(dbRecord.employee_deductions_total) || 0,
      netPay: parseFloat(dbRecord.net_pay) || 0,
      basicRate:
        parseFloat(dbRecord.basic_rate) || parseFloat(dbRecord.gross_pay) || 0,

      // Metadata
      createdBy: dbRecord.created_by || "",
      createdAt: dbRecord.created_at || new Date().toISOString(),
      updatedAt: dbRecord.updated_at || new Date().toISOString(),
      status: dbRecord.status || "draft",
      approvedBy: dbRecord.approved_by,
      approvedAt: dbRecord.approved_at,
      paymentReference: dbRecord.payment_reference,
      bankReference: dbRecord.bank_reference,
    };
  }

  /**
   * Convert complete payroll data to payslip data for PDF generation
   */
  static convertToPayslipData(
    completeData: CompletePayrollData,
    userId: string
  ): PayslipData {
    const { payrollRecord, staffProfile, staffJob, staffPayInfo } =
      completeData;

    const staffInfo: PayslipStaffInfo = {
      fullname: staffProfile.fullname,
      ic_no: staffProfile.ic_no,
      employee_id: staffProfile.id,
      position: staffJob.nd_position?.name || "Unknown Position",
      location_site: staffJob.nd_site_profile?.sitename || "Unknown Site",
      epf_no: staffPayInfo.epf_no,
      socso_no: staffPayInfo.socso_no,
      tax_no: staffPayInfo.tax_no,
      bank_account_no: staffPayInfo.bank_acc_no,
      bank_name: staffPayInfo.nd_bank?.bank_name,
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const payMonth = `${monthNames[payrollRecord.month - 1]} ${
      payrollRecord.year
    }`;

    return {
      payrollRecord,
      staffInfo,
      organizationName:
        payrollRecord.organizationName || "Unknown Organization",
      payMonth,
      payDate: payrollRecord.payToDate,
      createdDate: payrollRecord.createdAt,
    };
  }
}
