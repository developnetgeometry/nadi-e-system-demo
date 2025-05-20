import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NadiESystemReportPDF } from "../pages/nadiesystem/NadiESystemReport";
import { NadiESystemSite } from "@/hooks/report/use-nadi-e-system-data";

// Define the interface for the props
interface NadiESystemReportDownloadButtonProps {
  duspLabel: string;
  phaseLabel: string;
  periodType: string;
  periodValue: string;
  monthFilter: string | number | null;
  yearFilter: string | number | null;
  duspFilter: (string | number)[] | null;
  phaseFilter: string | number | null;
  sites: NadiESystemSite[];
  totalSites: number;
  sitesWithCms: number;
  sitesWithWebsiteMigration: number;
  sitesWithEmailMigration: number;
  mcmcLogo: string;
  duspLogo: string;
  fileName: string;
  onGenerationStart: () => void;
  onGenerationComplete: (success: boolean) => void;
}

export const NadiESystemReportDownloadButton: React.FC<NadiESystemReportDownloadButtonProps> = ({
  duspLabel, 
  phaseLabel, 
  periodType,
  periodValue,
  monthFilter,
  yearFilter,
  duspFilter,
  phaseFilter,
  sites,
  totalSites,
  sitesWithCms,
  sitesWithWebsiteMigration,
  sitesWithEmailMigration,
  mcmcLogo,
  duspLogo,
  fileName = "nadi-e-system-report.pdf",
  onGenerationStart,
  onGenerationComplete,
}) => {  
  // Track loading state internally    
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to generate and download PDF
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    
    try {
      // Create the PDF document
      const blob = await pdf(
        <NadiESystemReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          sites={sites}
          totalSites={totalSites}
          sitesWithCms={sitesWithCms}
          sitesWithWebsiteMigration={sitesWithWebsiteMigration}
          sitesWithEmailMigration={sitesWithEmailMigration}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
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