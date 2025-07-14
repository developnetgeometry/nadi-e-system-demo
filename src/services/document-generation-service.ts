import { supabase } from "@/integrations/supabase/client";
import { PayrollRecord } from "@/types/payroll";

export interface DocumentGenerationRequest {
  payrollId: string;
  documentType: "payslip" | "salary_certificate" | "annual_statement";
  templateOptions?: Record<string, any>;
}

export interface DocumentGenerationResponse {
  documentId: string;
  filePath: string;
  downloadUrl: string;
  fileSize: number;
}

class DocumentGenerationService {
  /**
   * Generate a payroll document (payslip, salary certificate, or annual statement)
   */
  async generateDocument(
    request: DocumentGenerationRequest
  ): Promise<DocumentGenerationResponse> {
    try {
      // First, get the payroll record
      const payrollRecord = await this.getPayrollRecord(request.payrollId);

      // Call the Edge Function to generate PDF
      const { data, error } = await supabase.functions.invoke(
        "generate-payroll-document",
        {
          body: {
            payrollRecord,
            documentType: request.documentType,
            templateOptions: request.templateOptions,
          },
        }
      );

      if (error) {
        throw new Error(`Document generation failed: ${error.message}`);
      }

      // Store document record in database
      const documentRecord = await this.storeDocumentRecord({
        payrollId: request.payrollId,
        documentType: request.documentType,
        filePath: data.filePath,
        fileSize: data.fileSize,
      });

      return {
        documentId: documentRecord.id,
        filePath: data.filePath,
        downloadUrl: data.downloadUrl,
        fileSize: data.fileSize,
      };
    } catch (error) {
      console.error("Error generating document:", error);
      throw error;
    }
  }

  /**
   * Get existing documents for a payroll record
   */
  async getPayrollDocuments(payrollId: string) {
    const { data, error } = await supabase
      .from("nd_staff_payroll_documents")
      .select("*")
      .eq("payroll_id", payrollId)
      .eq("is_current", true)
      .order("generated_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }

    return data;
  }

  /**
   * Download a generated document
   */
  async downloadDocument(documentId: string): Promise<string> {
    // Get document record
    const { data: document, error: docError } = await supabase
      .from("nd_staff_payroll_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      throw new Error("Document not found");
    }

    // Get signed URL for download
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from("payroll-documents")
      .createSignedUrl(document.file_path, 300); // 5 minutes expiry

    if (urlError) {
      throw new Error(`Failed to generate download URL: ${urlError.message}`);
    }

    return signedUrl.signedUrl;
  }

  /**
   * Generate payslip for a specific payroll record
   */
  async generatePayslip(
    payrollId: string
  ): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      payrollId,
      documentType: "payslip",
    });
  }

  /**
   * Generate salary certificate for an employee
   */
  async generateSalaryCertificate(
    payrollId: string,
    templateOptions?: Record<string, any>
  ): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      payrollId,
      documentType: "salary_certificate",
      templateOptions,
    });
  }

  /**
   * Generate annual statement for an employee
   */
  async generateAnnualStatement(
    payrollId: string,
    year: number
  ): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      payrollId,
      documentType: "annual_statement",
      templateOptions: { year },
    });
  }

  /**
   * Bulk generate payslips for multiple payroll records
   */
  async bulkGeneratePayslips(
    payrollIds: string[]
  ): Promise<DocumentGenerationResponse[]> {
    const results = await Promise.allSettled(
      payrollIds.map((id) => this.generatePayslip(id))
    );

    return results
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<DocumentGenerationResponse> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  }

  /**
   * Get payroll record with all necessary data for document generation
   */
  private async getPayrollRecord(payrollId: string): Promise<PayrollRecord> {
    const { data, error } = await supabase
      .from("nd_staff_payroll_enhanced")
      .select(
        `
        *,
        staff_profile!inner(
          id,
          fullname,
          ic_no,
          email,
          phone_no
        ),
        staff_job(
          id,
          position,
          site_profile!inner(
            id,
            site_name,
            organization:organizations!inner(
              id,
              name
            )
          )
        ),
        created_by_profile:profiles!nd_staff_payroll_enhanced_created_by_fkey(
          id,
          full_name
        ),
        approved_by_profile:profiles!nd_staff_payroll_enhanced_approved_by_fkey(
          id,
          full_name
        )
      `
      )
      .eq("id", payrollId)
      .single();

    if (error || !data) {
      throw new Error(`Payroll record not found: ${error?.message}`);
    }

    // Transform the data to match PayrollRecord interface
    return {
      id: data.id,
      staffId: data.staff_id,
      staffJobId: data.staff_job_id,
      organizationId: data.organization_id,
      month: data.month,
      year: data.year,
      payToDate: data.pay_to_date,
      employeeName: data.staff_profile.fullname,
      employeeIcNo: data.staff_profile.ic_no,
      position: data.staff_job?.position || "",
      organizationName: data.staff_job?.site_profile?.organization?.name || "",
      siteName: data.staff_job?.site_profile?.site_name || "",
      earnings: data.earnings,
      employerDeductions: data.employer_deductions || [],
      employeeDeductions: data.employee_deductions || [],
      totalEmployerDeductions: data.total_employer_deductions,
      totalEmployeeDeductions: data.total_employee_deductions,
      netPay: data.net_pay,
      basicRate: data.basic_rate,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status,
    } as PayrollRecord;
  }

  /**
   * Store document record in database
   */
  private async storeDocumentRecord(params: {
    payrollId: string;
    documentType: string;
    filePath: string;
    fileSize: number;
  }) {
    // First, mark any existing documents of this type as not current
    await supabase
      .from("nd_staff_payroll_documents")
      .update({ is_current: false })
      .eq("payroll_id", params.payrollId)
      .eq("document_type", params.documentType);

    // Insert new document record
    const { data, error } = await supabase
      .from("nd_staff_payroll_documents")
      .insert({
        payroll_id: params.payrollId,
        document_type: params.documentType,
        file_path: params.filePath,
        file_size: params.fileSize,
        is_current: true,
        generated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store document record: ${error.message}`);
    }

    return data;
  }
}

export const documentGenerationService = new DocumentGenerationService();
