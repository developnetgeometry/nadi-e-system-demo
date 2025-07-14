import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PayslipDataService } from "@/services/payslip-data-service";
import { PayslipPDFService } from "@/services/payslip-pdf-service";

export const usePayslipDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadPayslip = async (payrollRecordId: string, userId: string) => {
    setIsDownloading(true);

    try {
      // Show loading toast
      toast({
        title: "Preparing payslip...",
        description: "Please wait while we generate your payslip.",
      });

      // Fetch complete payroll data
      const completeData = await PayslipDataService.fetchCompletePayrollData(
        payrollRecordId
      );

      if (!completeData) {
        throw new Error("Failed to fetch payroll data");
      }

      // Convert to payslip data
      const payslipData = PayslipDataService.convertToPayslipData(
        completeData,
        userId
      );

      // Generate and download PDF
      PayslipPDFService.generatePayslipPDF(payslipData);

      // Show success toast
      toast({
        title: "Payslip downloaded successfully",
        description: "Your payslip has been downloaded to your device.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading payslip:", error);

      toast({
        title: "Download failed",
        description:
          "There was an error generating your payslip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadPayslip,
    isDownloading,
  };
};
