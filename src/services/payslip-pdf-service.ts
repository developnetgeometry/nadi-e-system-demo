import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PayrollRecord } from "@/types/payroll";

export interface PayslipStaffInfo {
  fullname: string;
  ic_no: string;
  employee_id: string;
  position: string;
  location_site: string;
  epf_no?: string;
  socso_no?: string;
  tax_no?: string;
  bank_account_no?: string;
  bank_name?: string;
}

export interface PayslipData {
  payrollRecord: PayrollRecord;
  staffInfo: PayslipStaffInfo;
  organizationName: string;
  payMonth: string;
  payDate: string;
  createdDate: string;
}
/**
 * Service to generate payslip PDF
 */
export class PayslipPDFService {
  static formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  static formatDate(date: string): string {
    try {
      return new Date(date).toLocaleDateString("en-GB");
    } catch {
      return date;
    }
  }

  static generatePayslipPDF(data: PayslipData): void {
    const doc = new jsPDF("landscape", "mm", "a4");
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const {
      payrollRecord,
      staffInfo,
      organizationName,
      payMonth,
      payDate,
      createdDate,
    } = data;

    const drawBox = (x: number, y: number, w: number, h: number) => {
      doc.setDrawColor(0);
      doc.rect(x, y, w, h);
    };

    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const { fontSize = 9, fontStyle = "normal", align = "left" } = options;
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle);
      doc.text(text, x, y, { align });
    };

    // === HEADER ===
    const headerHeight = 40;
    drawBox(margin, y, contentWidth, headerHeight);

    addText(organizationName.toUpperCase(), margin + 2, y + 7, {
      fontSize: 10,
      fontStyle: "bold",
    });
    addText(`PAYROLL MONTH - ${payMonth.toUpperCase()}`, pageWidth / 2, y + 7, {
      align: "center",
      fontStyle: "bold",
    });
    addText("MONTHLY / BANK", pageWidth - margin - 2, y + 7, {
      align: "right",
    });

    // Left Column
    addText(`NAME: ${staffInfo.fullname}`, margin + 2, y + 15);
    addText(`IC NO.: ${staffInfo.ic_no}`, margin + 2, y + 21);
    addText(`EMPLOYEE: ${staffInfo.employee_id}`, margin + 2, y + 27);

    // Middle Column
    const middleX = margin + contentWidth / 3;
    addText(`JOB TITLE: ${staffInfo.position}`, middleX, y + 15);
    addText(`LOCATION: ${staffInfo.location_site}`, middleX, y + 21);

    // Right Column
    const rightX = margin + (contentWidth / 3) * 2;
    addText(`EPF NO.: ${staffInfo.epf_no || "-"}`, rightX, y + 15);
    addText(`SOCSO NO.: ${staffInfo.socso_no || "-"}`, rightX, y + 21);
    addText(`TAX NO.: ${staffInfo.tax_no || "-"}`, rightX, y + 27);
    addText(
      `BANK AC. NO.: ${staffInfo.bank_account_no || "-"}`,
      rightX,
      y + 33
    );
    addText(this.formatDate(payDate), pageWidth - margin - 2, y + 15, {
      align: "right",
    });

    y += headerHeight + 5;

    // === MAIN 3-COLUMN SECTION ===
    const colWidth = contentWidth / 3;
    const sectionHeight = 80;

    // Draw boxes
    drawBox(margin, y, colWidth, sectionHeight);
    drawBox(margin + colWidth, y, colWidth, sectionHeight);
    drawBox(margin + 2 * colWidth, y, colWidth, sectionHeight);

    // Column Titles
    addText("EARNINGS", margin + 2, y + 6, { fontStyle: "bold" });
    addText("DEDUCTION", margin + colWidth + 2, y + 6, { fontStyle: "bold" });
    addText("EMPLOYER", margin + 2 * colWidth + 2, y + 6, {
      fontStyle: "bold",
    });

    // Calculate statutory deductions
    const basicPay = payrollRecord.earnings.basicPay;
    const epfEmployee = basicPay * 0.11; // 11% EPF employee contribution
    const socsoEmployee = Math.min(basicPay * 0.005, 24.5); // 0.5% SOCSO employee, capped at 24.5
    const eisEmployee = Math.min(basicPay * 0.002, 19.6); // 0.2% EIS employee, capped at 19.6

    const epfEmployer = basicPay * 0.13; // 13% EPF employer contribution
    const socsoEmployer = Math.min(basicPay * 0.0175, 85.75); // 1.75% SOCSO employer, capped at 85.75
    const eisEmployer = Math.min(basicPay * 0.002, 19.6); // 0.2% EIS employer, capped at 19.6

    // EARNINGS VALUES
    let earningsY = y + 14;
    addText("BASIC PAY", margin + 2, earningsY);
    addText(this.formatCurrency(basicPay), margin + colWidth - 2, earningsY, {
      align: "right",
    });
    earningsY += 6;

    if (
      payrollRecord.earnings.allowance &&
      payrollRecord.earnings.allowance > 0
    ) {
      addText("ALLOWANCE", margin + 2, earningsY);
      addText(
        this.formatCurrency(payrollRecord.earnings.allowance),
        margin + colWidth - 2,
        earningsY,
        { align: "right" }
      );
      earningsY += 6;
    }

    if (
      payrollRecord.earnings.overtime &&
      payrollRecord.earnings.overtime > 0
    ) {
      addText("OVERTIME", margin + 2, earningsY);
      addText(
        this.formatCurrency(payrollRecord.earnings.overtime),
        margin + colWidth - 2,
        earningsY,
        { align: "right" }
      );
      earningsY += 6;
    }

    // Custom earnings
    if (payrollRecord.earnings.customEarnings) {
      payrollRecord.earnings.customEarnings.forEach((earning) => {
        if (earning.amount > 0) {
          addText(earning.name.toUpperCase(), margin + 2, earningsY);
          addText(
            this.formatCurrency(earning.amount),
            margin + colWidth - 2,
            earningsY,
            { align: "right" }
          );
          earningsY += 6;
        }
      });
    }

    // EMPLOYEE DEDUCTIONS
    let deductionY = y + 14;
    const dedX = margin + colWidth;

    // Additional employee deductions
    if (
      payrollRecord.employeeDeductions &&
      payrollRecord.employeeDeductions.length > 0
    ) {
      payrollRecord.employeeDeductions.forEach((deduction) => {
        if (deduction.amount > 0) {
          addText(deduction.name.toUpperCase(), dedX + 2, deductionY);
          addText(
            this.formatCurrency(deduction.amount),
            dedX + colWidth - 2,
            deductionY,
            { align: "right" }
          );
          deductionY += 6;
        }
      });
    }

    // EMPLOYER CONTRIBUTIONS
    let employerY = y + 14;
    const empX = margin + 2 * colWidth;

    // Additional employer contributions
    if (
      payrollRecord.employerDeductions &&
      payrollRecord.employerDeductions.length > 0
    ) {
      payrollRecord.employerDeductions.forEach((deduction) => {
        if (deduction.amount > 0) {
          addText(deduction.name.toUpperCase(), empX + 2, employerY);
          addText(
            this.formatCurrency(deduction.amount),
            empX + colWidth - 2,
            employerY,
            { align: "right" }
          );
          employerY += 6;
        }
      });
    }

    // Show basic rate at bottom of employer column
    addText("BASIC RATE", empX + 2, y + sectionHeight - 8);
    addText(
      this.formatCurrency(basicPay),
      empX + colWidth - 2,
      y + sectionHeight - 8,
      { align: "right" }
    );

    y += sectionHeight + 5;

    // === SUMMARY ROW ===
    const summaryHeight = 15;
    const boxW = contentWidth / 3;
    drawBox(margin, y, contentWidth, summaryHeight);
    drawBox(margin, y, boxW, summaryHeight);
    drawBox(margin + boxW, y, boxW, summaryHeight);
    drawBox(margin + boxW * 2, y, boxW, summaryHeight);

    // Calculate totals
    const totalEarnings = payrollRecord.earnings.grossPay;
    const totalEmployeeDeductions =
      epfEmployee +
      socsoEmployee +
      eisEmployee +
      (payrollRecord.employeeDeductions?.reduce(
        (sum, ded) => sum + ded.amount,
        0
      ) || 0);
    const totalEmployerDeductions =
      epfEmployer +
      socsoEmployer +
      eisEmployer +
      (payrollRecord.employerDeductions?.reduce(
        (sum, ded) => sum + ded.amount,
        0
      ) || 0);

    // Net pay = Total Earnings - Employee Deductions (Employer deductions don't reduce net pay)
    const netPay = totalEarnings - totalEmployeeDeductions;

    addText("GROSS PAY", margin + 2, y + 10);
    addText(this.formatCurrency(totalEarnings), margin + boxW - 2, y + 10, {
      align: "right",
    });

    addText("TOTAL DEDUCTIONS", margin + boxW + 2, y + 10);
    addText(
      this.formatCurrency(totalEmployeeDeductions),
      margin + boxW * 2 - 2,
      y + 10,
      { align: "right" }
    );

    addText("NET PAY", margin + boxW * 2 + 2, y + 10);
    addText(this.formatCurrency(netPay), margin + boxW * 3 - 2, y + 10, {
      align: "right",
    });

    y += summaryHeight + 10;
    addText(
      "This payslip is computer generated and does not require a signature.",
      pageWidth / 2,
      y,
      { align: "center", fontSize: 8, fontStyle: "italic" }
    );
    addText(
      `Generated on: ${this.formatDate(createdDate)}`,
      pageWidth / 2,
      y + 6,
      { align: "center", fontSize: 8 }
    );

    // Save
    const filename = `Payslip_${staffInfo.fullname.replace(
      /\s+/g,
      "_"
    )}_${payMonth.replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  }
}
