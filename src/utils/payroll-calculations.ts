import {
  PayrollRecord,
  PayrollDeduction,
  COMMON_DEDUCTIONS,
} from "@/types/payroll";

// Calculate EPF, SOCSO, EIS based on Malaysian standards
export const calculateMalaysianDeductions = (grossPay: number) => {
  const employerDeductions: PayrollDeduction[] = [];
  const employeeDeductions: PayrollDeduction[] = [];

  // EPF calculations
  const epfEmployeeRate = 0.11; // 11%
  const epfEmployerRate = 0.13; // 13%

  employeeDeductions.push({
    id: "epf_employee",
    name: "EPF",
    amount: Math.round(grossPay * epfEmployeeRate * 100) / 100,
    type: "employee",
    mandatory: true,
  });

  employerDeductions.push({
    id: "epf_employer",
    name: "EPF",
    amount: Math.round(grossPay * epfEmployerRate * 100) / 100,
    type: "employer",
    mandatory: true,
  });

  // SOCSO calculations (based on wage brackets)
  const socsoEmployeeAmount = calculateSOCSO(grossPay, "employee");
  const socsoEmployerAmount = calculateSOCSO(grossPay, "employer");

  if (socsoEmployeeAmount > 0) {
    employeeDeductions.push({
      id: "socso_employee",
      name: "SOCSO",
      amount: socsoEmployeeAmount,
      type: "employee",
      mandatory: true,
    });
  }

  if (socsoEmployerAmount > 0) {
    employerDeductions.push({
      id: "socso_employer",
      name: "SOCSO",
      amount: socsoEmployerAmount,
      type: "employer",
      mandatory: true,
    });
  }

  // EIS calculations (0.2% each for employer and employee)
  const eisRate = 0.002; // 0.2%
  const eisAmount = Math.round(grossPay * eisRate * 100) / 100;

  employeeDeductions.push({
    id: "eis_employee",
    name: "EIS",
    amount: eisAmount,
    type: "employee",
    mandatory: true,
  });

  employerDeductions.push({
    id: "eis_employer",
    name: "EIS",
    amount: eisAmount,
    type: "employer",
    mandatory: true,
  });

  return {
    employerDeductions,
    employeeDeductions,
  };
};

// Calculate SOCSO based on wage brackets (simplified version)
const calculateSOCSO = (
  grossPay: number,
  type: "employee" | "employer"
): number => {
  // SOCSO wage brackets (simplified - in a real app, use the full table)
  const socsoTable = [
    { min: 0, max: 30, employee: 0.1, employer: 0.4 },
    { min: 30.01, max: 50, employee: 0.15, employer: 0.6 },
    { min: 50.01, max: 70, employee: 0.2, employer: 0.8 },
    { min: 70.01, max: 100, employee: 0.3, employer: 1.2 },
    { min: 100.01, max: 140, employee: 0.4, employer: 1.6 },
    { min: 140.01, max: 200, employee: 0.6, employer: 2.4 },
    { min: 200.01, max: 300, employee: 0.85, employer: 3.4 },
    { min: 300.01, max: 400, employee: 1.15, employer: 4.6 },
    { min: 400.01, max: 500, employee: 1.45, employer: 5.8 },
    { min: 500.01, max: 600, employee: 1.75, employer: 7.0 },
    { min: 600.01, max: 700, employee: 2.05, employer: 8.2 },
    { min: 700.01, max: 800, employee: 2.35, employer: 9.4 },
    { min: 800.01, max: 900, employee: 2.65, employer: 10.6 },
    { min: 900.01, max: 1000, employee: 2.95, employer: 11.8 },
    { min: 1000.01, max: 1100, employee: 3.25, employer: 13.0 },
    { min: 1100.01, max: 1200, employee: 3.55, employer: 14.2 },
    { min: 1200.01, max: 1300, employee: 3.85, employer: 15.4 },
    { min: 1300.01, max: 1400, employee: 4.15, employer: 16.6 },
    { min: 1400.01, max: 1500, employee: 4.45, employer: 17.8 },
    { min: 1500.01, max: 1600, employee: 4.75, employer: 19.0 },
    { min: 1600.01, max: 1700, employee: 5.05, employer: 20.2 },
    { min: 1700.01, max: 1800, employee: 5.35, employer: 21.4 },
    { min: 1800.01, max: 1900, employee: 5.65, employer: 22.6 },
    { min: 1900.01, max: 2000, employee: 5.95, employer: 23.8 },
    { min: 2000.01, max: 2100, employee: 6.25, employer: 25.0 },
    { min: 2100.01, max: 2200, employee: 6.55, employer: 26.2 },
    { min: 2200.01, max: 2300, employee: 6.85, employer: 27.4 },
    { min: 2300.01, max: 2400, employee: 7.15, employer: 28.6 },
    { min: 2400.01, max: 2500, employee: 7.45, employer: 29.8 },
    { min: 2500.01, max: 2600, employee: 7.75, employer: 31.0 },
    { min: 2600.01, max: 2700, employee: 8.05, employer: 32.2 },
    { min: 2700.01, max: 2800, employee: 8.35, employer: 33.4 },
    { min: 2800.01, max: 2900, employee: 8.65, employer: 34.6 },
    { min: 2900.01, max: 3000, employee: 8.95, employer: 35.8 },
    { min: 3000.01, max: 3100, employee: 9.25, employer: 37.0 },
    { min: 3100.01, max: 3200, employee: 9.55, employer: 38.2 },
    { min: 3200.01, max: 3300, employee: 9.85, employer: 39.4 },
    { min: 3300.01, max: 3400, employee: 10.15, employer: 40.6 },
    { min: 3400.01, max: 3500, employee: 10.45, employer: 41.8 },
    { min: 3500.01, max: 3600, employee: 10.75, employer: 43.0 },
    { min: 3600.01, max: 3700, employee: 11.05, employer: 44.2 },
    { min: 3700.01, max: 3800, employee: 11.35, employer: 45.4 },
    { min: 3800.01, max: 3900, employee: 11.65, employer: 46.6 },
    { min: 3900.01, max: 4000, employee: 11.95, employer: 47.8 },
    { min: 4000.01, max: Infinity, employee: 19.75, employer: 79.0 },
  ];

  const bracket = socsoTable.find(
    (b) => grossPay >= b.min && grossPay <= b.max
  );
  return bracket ? bracket[type] : 0;
};

// Export payroll data to CSV
export const exportPayrollToCSV = (
  records: PayrollRecord[],
  filename: string = "payroll-export"
) => {
  if (records.length === 0) {
    throw new Error("No records to export");
  }

  const csvHeaders = [
    "Employee Name",
    "Position",
    "Organization",
    "Month",
    "Year",
    "Pay To Date",
    "Basic Pay",
    "Allowance",
    "Gross Pay",
    "Total Employee Deductions",
    "Net Pay",
    "Status",
    "Created Date",
  ];

  const csvRows = records.map((record) => [
    record.employeeName,
    record.position,
    record.organizationName,
    record.month.toString(),
    record.year.toString(),
    new Date(record.payToDate).toLocaleDateString(),
    record.earnings.basicPay.toFixed(2),
    record.earnings.allowance.toFixed(2),
    record.earnings.grossPay.toFixed(2),
    record.totalEmployeeDeductions.toFixed(2),
    record.netPay.toFixed(2),
    record.status,
    new Date(record.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    csvHeaders.join(","),
    ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Filter payroll records
export const filterPayrollRecords = (
  records: PayrollRecord[],
  searchQuery: string,
  month?: number,
  year?: number,
  status?: string,
  employeeId?: string
): PayrollRecord[] => {
  return records.filter((record) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        record.employeeName.toLowerCase().includes(searchLower) ||
        record.position.toLowerCase().includes(searchLower) ||
        record.organizationName.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Month filter
    if (month && record.month !== month) return false;

    // Year filter
    if (year && record.year !== year) return false;

    // Status filter
    if (status && record.status !== status) return false;

    // Employee filter
    if (employeeId && record.employeeId !== employeeId) return false;

    return true;
  });
};

// Validate payroll form data
export const validatePayrollData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.employeeId) {
    errors.push("Employee is required");
  }

  if (!data.month || data.month < 1 || data.month > 12) {
    errors.push("Valid month is required");
  }

  if (!data.year || data.year < 2020 || data.year > 2100) {
    errors.push("Valid year is required");
  }

  if (!data.payToDate) {
    errors.push("Pay to date is required");
  }

  if (!data.earnings?.basicPay || data.earnings.basicPay <= 0) {
    errors.push("Basic pay must be greater than 0");
  }

  if (data.earnings?.allowance < 0) {
    errors.push("Allowance cannot be negative");
  }

  // Validate deductions
  if (data.employerDeductions) {
    data.employerDeductions.forEach(
      (deduction: PayrollDeduction, index: number) => {
        if (!deduction.name) {
          errors.push(`Employer deduction ${index + 1} name is required`);
        }
        if (deduction.amount < 0) {
          errors.push(
            `Employer deduction ${index + 1} amount cannot be negative`
          );
        }
      }
    );
  }

  if (data.employeeDeductions) {
    data.employeeDeductions.forEach(
      (deduction: PayrollDeduction, index: number) => {
        if (!deduction.name) {
          errors.push(`Employee deduction ${index + 1} name is required`);
        }
        if (deduction.amount < 0) {
          errors.push(
            `Employee deduction ${index + 1} amount cannot be negative`
          );
        }
      }
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
