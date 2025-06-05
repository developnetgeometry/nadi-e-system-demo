import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InternetAccessReportPDF } from "../pages/internetaccess/InternetAccessReport";
import { useInternetAccessPdfData } from '@/hooks/report/use-internet-access-pdf-data';

interface InternetAccessReportDownloadButtonProps {
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;
  monthFilter?: string | number | null;
  yearFilter?: string | number | null;
  duspFilter?: (string | number)[];
  phaseFilter?: string | number | null;
  tpFilter?: (string | number)[];
  mcmcLogo?: string;
  duspLogo?: string;
  onGenerationStart?: () => void;
  onGenerationComplete?: (success: boolean) => void;
}

export const InternetAccessReportDownloadButton: React.FC<InternetAccessReportDownloadButtonProps> = ({
  duspLabel = "",
  phaseLabel = "All Phases",
  periodType = "All Time",
  periodValue = "All Records",
  monthFilter = null,
  yearFilter = null,
  duspFilter = [],
  phaseFilter = null,
  tpFilter = [],
  mcmcLogo = "",
  duspLogo = "",
  onGenerationStart,
  onGenerationComplete,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  // Fetch all PDF data internally
  const pdfData = useInternetAccessPdfData(
    duspFilter,
    phaseFilter,
    monthFilter,
    yearFilter,
    tpFilter
  );

  const fileName = `internet-access-report-${new Date().toISOString().split('T')[0]}.pdf`;
  // Function to generate and download PDF
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    try {
      const blob = await pdf(
        <InternetAccessReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          internetSite={pdfData.internetSite}
          
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          currentMonth={new Date().getMonth() + 1}
          currentYear={new Date().getFullYear()}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
      onGenerationComplete?.(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      onGenerationComplete?.(false);
    }
  };

  return (
    <Button
      disabled={isGenerating}
      variant="secondary"
      className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
      onClick={generateAndDownloadPDF}
    >
      {isGenerating ? (
        <>
          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download
        </>
      )}
    </Button>
  );
};
