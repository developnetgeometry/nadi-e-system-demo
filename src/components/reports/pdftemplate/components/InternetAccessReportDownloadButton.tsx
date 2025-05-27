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
  fileName: string;
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
  fileName = "internet-access-report.pdf",
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

  // Calculate percentages for key metrics
  const internetAccessPercentage = pdfData.totalSites > 0
    ? ((pdfData.sitesWithInternet / pdfData.totalSites) * 100).toFixed(1)
    : "0";

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
          sites={pdfData.sites}
          totalSites={pdfData.totalSites}
          sitesWithInternet={pdfData.sitesWithInternet}
          sitesWithoutInternet={pdfData.sitesWithoutInternet}
          connectionTypes={pdfData.connectionTypes}
          providers={pdfData.providers}
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
