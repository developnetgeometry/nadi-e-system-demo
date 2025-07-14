import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { payrollRecord, documentType, templateOptions } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Generate PDF based on document type
    let pdfBuffer: Uint8Array;
    let fileName: string;

    switch (documentType) {
      case "payslip":
        pdfBuffer = await generatePayslipPDF(payrollRecord);
        fileName = `payslip_${payrollRecord.employeeIcNo}_${payrollRecord.month}_${payrollRecord.year}.pdf`;
        break;
      case "salary_certificate":
        pdfBuffer = await generateSalaryCertificatePDF(
          payrollRecord,
          templateOptions
        );
        fileName = `salary_certificate_${
          payrollRecord.employeeIcNo
        }_${Date.now()}.pdf`;
        break;
      case "annual_statement":
        pdfBuffer = await generateAnnualStatementPDF(
          payrollRecord,
          templateOptions
        );
        fileName = `annual_statement_${payrollRecord.employeeIcNo}_${
          templateOptions?.year || payrollRecord.year
        }.pdf`;
        break;
      default:
        throw new Error(`Unsupported document type: ${documentType}`);
    }

    // Upload PDF to Supabase Storage
    const filePath = `payroll/${documentType}/${fileName}`;
    const { data: uploadData, error: uploadError } =
      await supabaseClient.storage
        .from("payroll-documents")
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseClient.storage.from("payroll-documents").getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        filePath,
        downloadUrl: publicUrl,
        fileSize: pdfBuffer.length,
        fileName,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// PDF Generation Functions
async function generatePayslipPDF(payrollRecord: any): Promise<Uint8Array> {
  // Using jsPDF for PDF generation
  const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");

  const doc = new jsPDF();

  // Add company header
  doc.setFontSize(16);
  doc.text("NADI E-SYSTEM", 20, 20);
  doc.text("PAYSLIP", 20, 30);

  // Employee information
  doc.setFontSize(12);
  doc.text(`Employee Name: ${payrollRecord.employeeName}`, 20, 50);
  doc.text(`IC Number: ${payrollRecord.employeeIcNo}`, 20, 60);
  doc.text(`Position: ${payrollRecord.position}`, 20, 70);
  doc.text(`Organization: ${payrollRecord.organizationName}`, 20, 80);
  doc.text(`Site: ${payrollRecord.siteName}`, 20, 90);

  // Pay period
  doc.text(`Pay Period: ${payrollRecord.month}/${payrollRecord.year}`, 120, 50);
  doc.text(
    `Pay Date: ${new Date(payrollRecord.payToDate).toLocaleDateString()}`,
    120,
    60
  );

  // Earnings section
  let yPos = 110;
  doc.setFontSize(14);
  doc.text("EARNINGS", 20, yPos);
  doc.setFontSize(12);
  yPos += 10;

  doc.text("Basic Pay:", 20, yPos);
  doc.text(`RM ${payrollRecord.earnings.basicPay.toFixed(2)}`, 120, yPos);
  yPos += 10;

  if (payrollRecord.earnings.allowance > 0) {
    doc.text("Allowance:", 20, yPos);
    doc.text(`RM ${payrollRecord.earnings.allowance.toFixed(2)}`, 120, yPos);
    yPos += 10;
  }

  doc.text("Gross Pay:", 20, yPos);
  doc.text(`RM ${payrollRecord.earnings.grossPay.toFixed(2)}`, 120, yPos);
  yPos += 20;

  // Deductions section
  doc.setFontSize(14);
  doc.text("DEDUCTIONS", 20, yPos);
  doc.setFontSize(12);
  yPos += 10;

  for (const deduction of payrollRecord.employeeDeductions) {
    doc.text(`${deduction.name}:`, 20, yPos);
    doc.text(`RM ${deduction.amount.toFixed(2)}`, 120, yPos);
    yPos += 10;
  }

  doc.text("Total Deductions:", 20, yPos);
  doc.text(`RM ${payrollRecord.totalEmployeeDeductions.toFixed(2)}`, 120, yPos);
  yPos += 20;

  // Net pay
  doc.setFontSize(14);
  doc.text("NET PAY:", 20, yPos);
  doc.text(`RM ${payrollRecord.netPay.toFixed(2)}`, 120, yPos);

  // Footer
  yPos += 30;
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text("This is a computer-generated document.", 20, yPos + 10);

  return new Uint8Array(doc.output("arraybuffer"));
}

async function generateSalaryCertificatePDF(
  payrollRecord: any,
  templateOptions: any
): Promise<Uint8Array> {
  const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");

  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text("NADI E-SYSTEM", 20, 20);
  doc.text("SALARY CERTIFICATE", 20, 30);

  // Date
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 50);

  // Content
  let yPos = 80;
  doc.text("TO WHOM IT MAY CONCERN:", 20, yPos);
  yPos += 20;

  doc.text(
    `This is to certify that ${payrollRecord.employeeName} (IC: ${payrollRecord.employeeIcNo})`,
    20,
    yPos
  );
  yPos += 10;
  doc.text(
    `is employed with ${payrollRecord.organizationName} as a ${payrollRecord.position}.`,
    20,
    yPos
  );
  yPos += 20;

  doc.text(
    `Current monthly salary: RM ${payrollRecord.earnings.grossPay.toFixed(2)}`,
    20,
    yPos
  );
  yPos += 10;
  doc.text(
    `Net monthly salary: RM ${payrollRecord.netPay.toFixed(2)}`,
    20,
    yPos
  );
  yPos += 30;

  doc.text("This certificate is issued for official purposes.", 20, yPos);
  yPos += 40;

  // Signature section
  doc.text("Authorized Signature:", 20, yPos);
  doc.text("_____________________", 20, yPos + 20);
  doc.text("HR Department", 20, yPos + 30);
  doc.text("NADI E-SYSTEM", 20, yPos + 40);

  return new Uint8Array(doc.output("arraybuffer"));
}

async function generateAnnualStatementPDF(
  payrollRecord: any,
  templateOptions: any
): Promise<Uint8Array> {
  const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");

  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text("NADI E-SYSTEM", 20, 20);
  doc.text("ANNUAL SALARY STATEMENT", 20, 30);

  // Employee information
  doc.setFontSize(12);
  doc.text(`Employee Name: ${payrollRecord.employeeName}`, 20, 50);
  doc.text(`IC Number: ${payrollRecord.employeeIcNo}`, 20, 60);
  doc.text(`Position: ${payrollRecord.position}`, 20, 70);
  doc.text(`Year: ${templateOptions?.year || payrollRecord.year}`, 20, 80);

  // Note: This would typically require aggregating all payroll records for the year
  // For now, showing current month's data as an example
  let yPos = 100;
  doc.text("SUMMARY:", 20, yPos);
  yPos += 20;

  doc.text("Total Gross Pay (Current Month):", 20, yPos);
  doc.text(`RM ${payrollRecord.earnings.grossPay.toFixed(2)}`, 120, yPos);
  yPos += 10;

  doc.text("Total Deductions (Current Month):", 20, yPos);
  doc.text(`RM ${payrollRecord.totalEmployeeDeductions.toFixed(2)}`, 120, yPos);
  yPos += 10;

  doc.text("Total Net Pay (Current Month):", 20, yPos);
  doc.text(`RM ${payrollRecord.netPay.toFixed(2)}`, 120, yPos);

  // Footer
  yPos += 40;
  doc.setFontSize(10);
  doc.text("Note: This statement shows data for current month only.", 20, yPos);
  doc.text(
    "For complete annual summary, contact HR department.",
    20,
    yPos + 10
  );
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos + 20);

  return new Uint8Array(doc.output("arraybuffer"));
}
