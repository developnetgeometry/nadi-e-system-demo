import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InternetAccessReportPDF } from "../pages/internetaccess/InternetAccessReport";

interface InternetAccessSite {
  id?: string;
  standard_code?: string;
  sitename?: string;
  phase_name?: string;
  has_internet?: boolean;
  connection_type?: string;
  provider?: string;
  speed?: string;
  status?: string;
}

interface InternetAccessReportDownloadButtonProps {
  // Report info
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;

  // Filter values to include in the report
  monthFilter?: string | number | null;
  yearFilter?: string | number | null;
  duspFilter?: (string | number)[];
  phaseFilter?: string | number | null;

  // Data for reports
  sites: InternetAccessSite[];
  totalSites: number;
  sitesWithInternet: number;
  sitesWithoutInternet: number;
  connectionTypes: { type: string; count: number }[];
  providers: { name: string; count: number }[];

  // Logos
  mcmcLogo?: string;
  duspLogo?: string;

  // Button configuration
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
  sites = [],
  totalSites = 0,
  sitesWithInternet = 0,
  sitesWithoutInternet = 0,
  connectionTypes = [],
  providers = [],
  mcmcLogo = "",
  duspLogo = "",
  fileName = "internet-access-report.pdf",
  onGenerationStart,
  onGenerationComplete,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate percentages for key metrics
  const internetAccessPercentage = totalSites > 0 
    ? ((sitesWithInternet / totalSites) * 100).toFixed(1) 
    : "0";

  // Function to generate and download PDF
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    
    try {
      // Create the PDF document
      const blob = await pdf(
        <InternetAccessReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          sites={sites}
          totalSites={totalSites}
          sitesWithInternet={sitesWithInternet}
          sitesWithoutInternet={sitesWithoutInternet}
          connectionTypes={connectionTypes}
          providers={providers}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          currentMonth={new Date().getMonth() + 1}
          currentYear={new Date().getFullYear()}
        />
      ).toBlob();
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create and click a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);
      
      // Signal completion
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
