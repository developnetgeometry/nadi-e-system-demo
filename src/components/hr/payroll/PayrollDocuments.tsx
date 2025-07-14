import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { documentGenerationService } from "@/services/document-generation-service";
import { Download, FileText, FileCheck, Calendar, Loader2 } from "lucide-react";
import { PayrollRecord } from "@/types/payroll";

interface PayrollDocumentsProps {
  payrollRecord: PayrollRecord;
  onDocumentGenerated?: () => void;
}

interface DocumentInfo {
  id: string;
  document_type: string;
  file_path: string;
  file_size: number;
  generated_at: string;
  is_current: boolean;
}

export const PayrollDocuments: React.FC<PayrollDocumentsProps> = ({
  payrollRecord,
  onDocumentGenerated,
}) => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const { toast } = useToast();

  // Load existing documents
  React.useEffect(() => {
    loadDocuments();
  }, [payrollRecord.id]);

  const loadDocuments = async () => {
    try {
      const docs = await documentGenerationService.getPayrollDocuments(
        payrollRecord.id
      );
      setDocuments(docs);
      setDocumentsLoaded(true);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDocument = async (
    documentType: "payslip" | "salary_certificate" | "annual_statement"
  ) => {
    setLoading((prev) => ({ ...prev, [documentType]: true }));

    try {
      let result;

      switch (documentType) {
        case "payslip":
          result = await documentGenerationService.generatePayslip(
            payrollRecord.id
          );
          break;
        case "salary_certificate":
          result = await documentGenerationService.generateSalaryCertificate(
            payrollRecord.id
          );
          break;
        case "annual_statement":
          result = await documentGenerationService.generateAnnualStatement(
            payrollRecord.id,
            payrollRecord.year
          );
          break;
      }

      toast({
        title: "Success",
        description: `${documentType.replace("_", " ")} generated successfully`,
      });

      await loadDocuments();
      onDocumentGenerated?.();
    } catch (error) {
      console.error(`Failed to generate ${documentType}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate ${documentType.replace("_", " ")}`,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const handleDownloadDocument = async (
    documentId: string,
    documentType: string
  ) => {
    setLoading((prev) => ({ ...prev, [`download_${documentId}`]: true }));

    try {
      const downloadUrl = await documentGenerationService.downloadDocument(
        documentId
      );

      // Create download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${documentType}_${payrollRecord.employeeIcNo}_${payrollRecord.month}_${payrollRecord.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error) {
      console.error("Failed to download document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`download_${documentId}`]: false }));
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "payslip":
        return <FileText className="w-4 h-4" />;
      case "salary_certificate":
        return <FileCheck className="w-4 h-4" />;
      case "annual_statement":
        return <Calendar className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case "payslip":
        return "Payslip";
      case "salary_certificate":
        return "Salary Certificate";
      case "annual_statement":
        return "Annual Statement";
      default:
        return type.replace("_", " ");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Payroll Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Employee Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Employee:</span>{" "}
            {payrollRecord.employeeName}
          </div>
          <div>
            <span className="font-medium">IC Number:</span>{" "}
            {payrollRecord.employeeIcNo}
          </div>
          <div>
            <span className="font-medium">Period:</span> {payrollRecord.month}/
            {payrollRecord.year}
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <Badge
              variant={
                payrollRecord.status === "approved" ? "default" : "secondary"
              }
              className="ml-2"
            >
              {payrollRecord.status}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Document Generation Buttons */}
        <div className="space-y-3">
          <h4 className="font-medium">Generate Documents</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Payslip */}
            <Button
              variant="outline"
              onClick={() => handleGenerateDocument("payslip")}
              disabled={loading.payslip || payrollRecord.status !== "approved"}
              className="flex items-center gap-2"
            >
              {loading.payslip ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Generate Payslip
            </Button>

            {/* Salary Certificate */}
            <Button
              variant="outline"
              onClick={() => handleGenerateDocument("salary_certificate")}
              disabled={
                loading.salary_certificate ||
                payrollRecord.status !== "approved"
              }
              className="flex items-center gap-2"
            >
              {loading.salary_certificate ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileCheck className="w-4 h-4" />
              )}
              Generate Certificate
            </Button>

            {/* Annual Statement */}
            <Button
              variant="outline"
              onClick={() => handleGenerateDocument("annual_statement")}
              disabled={
                loading.annual_statement || payrollRecord.status !== "approved"
              }
              className="flex items-center gap-2"
            >
              {loading.annual_statement ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Generate Annual
            </Button>
          </div>

          {payrollRecord.status !== "approved" && (
            <p className="text-sm text-muted-foreground">
              Documents can only be generated for approved payroll records.
            </p>
          )}
        </div>

        <Separator />

        {/* Existing Documents */}
        <div className="space-y-3">
          <h4 className="font-medium">Existing Documents</h4>

          {!documentsLoaded ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents generated yet.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.document_type)}
                    <div>
                      <div className="font-medium">
                        {getDocumentTitle(doc.document_type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Generated on{" "}
                        {new Date(doc.generated_at).toLocaleDateString()}
                        {doc.file_size && ` • ${formatFileSize(doc.file_size)}`}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDownloadDocument(doc.id, doc.document_type)
                    }
                    disabled={loading[`download_${doc.id}`]}
                  >
                    {loading[`download_${doc.id}`] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollDocuments;
