export interface PayrollEarnings {
  basicPay: number;
  allowance: number;
  overtime: number;
  customEarnings?: Array<{
    name: string;
    amount: number;
  }>;
  performanceIncentive?: {
    enabled: boolean;
    amount: number;
  };
  grossPay: number;
}

export interface PayrollDeduction {
  id: string;
  name: string;
  amount: number;
  type: "employer" | "employee";
  mandatory?: boolean;
}

export interface PayrollRecord {
  id: string;
  staffId: string; // Changed to string to match nd_staff_profile.id
  staffJobId?: number;
  organizationId?: string;
  month: number;
  year: number;
  payToDate: string;

  // Staff information (joined from nd_staff_profile and nd_staff_job)
  employeeName: string;
  employeeIcNo: string;
  position: string;
  organizationName?: string;
  siteName?: string;

  // Earnings
  earnings: PayrollEarnings;

  // Deductions
  employerDeductions: PayrollDeduction[];
  employeeDeductions: PayrollDeduction[];

  // Calculated values
  totalEmployerDeductions: number;
  totalEmployeeDeductions: number;
  netPay: number;
  basicRate: number; // refers to gross pay

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "pending" | "approved" | "paid" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  paymentReference?: string;
  bankReference?: string;
}

export interface PayrollFormData {
  staffId: string; // Changed to string

  month: number;
  year: number;
  payToDate: string;
  earnings: PayrollEarnings;
  employerDeductions: PayrollDeduction[];
  employeeDeductions: PayrollDeduction[];
}

export interface StaffEmployee {
  id: string; // Changed to string to match nd_staff_profile.id
  fullname: string;
  icNo: string;
  position: string;
  positionName?: string;
  organizationId?: string;
  organizationName?: string;
  siteName?: string;
  siteId?: number; // Add siteId field
  isActive: boolean;
  basicPay?: number; // from nd_staff_pay_info
}

export interface PayrollStats {
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  averageSalary: number;
}

export interface PayrollFilter {
  search: string;
  organizationId?: string;
  siteId?: number;
  month?: number;
  year?: number;
  status?: string;
  staffId?: string; // Changed to string
}

export const COMMON_DEDUCTIONS = {
  employer: [
    { name: "EPF", percentage: 13 },
    { name: "SOCSO", percentage: 1.75 },
    { name: "EIS", percentage: 0.2 },
    { name: "HRDF", percentage: 1 },
  ],
  employee: [
    { name: "EPF", percentage: 11 },
    { name: "SOCSO", percentage: 0.5 },
    { name: "EIS", percentage: 0.2 },
    { name: "PTPTN", percentage: 0 }, // Variable amount
    { name: "Income Tax", percentage: 0 }, // Variable amount
    { name: "Loan Deduction", percentage: 0 }, // Variable amount
  ],
};

// Enhanced payroll document types
export interface PayrollDocument {
  id: string;
  payrollId: string;
  documentType:
    | "payslip"
    | "salary_certificate"
    | "annual_statement"
    | "manual_attachment";
  filePath: string;
  fileSize?: number;
  generatedAt: string;
  generatedBy?: string;
  isCurrent: boolean;
}

// Notification interface for payroll updates
export interface PayrollNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "payroll";
  read: boolean;
  createdAt: string;
}

export type DeductionType = keyof typeof COMMON_DEDUCTIONS;
