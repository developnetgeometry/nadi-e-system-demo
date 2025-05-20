import React, { useState, useEffect } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
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
  buttonText: string;
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
  buttonText = "Generate PDF",
  fileName = "nadi-e-system-report.pdf",
  onGenerationStart,
  onGenerationComplete,
}) => {
  // Track loading state internally    
  const [isGenerating, setIsGenerating] = useState(false);
  // Track if user has clicked to generate PDF
  const [userClickedGenerate, setUserClickedGenerate] = useState(false);
  
  // Effect to reset button state when filters change
  useEffect(() => {
    // Reset the button state when any filter changes
    if (userClickedGenerate) {
      setUserClickedGenerate(false);
      setIsGenerating(false);
    }
  }, [duspFilter, phaseFilter, monthFilter, yearFilter]);
  
  // Handle the initial button click to start generating PDF
  const handleGeneratePDF = () => {
    setUserClickedGenerate(true);
    setIsGenerating(true);
    onGenerationStart?.();
  };

  // If user hasn't clicked to generate, just show the initial button
  if (!userClickedGenerate) {
    return (
      <Button
        variant="secondary"
        className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
        onClick={handleGeneratePDF}
      >
        <Download className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    );
  }

  // Only render PDFDownloadLink after user has clicked to generate
  return (
    <PDFDownloadLink
      document={
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
      }
      fileName={fileName}
    >
      {({ loading, error, url }) => {
        // Handle PDF generation lifecycle
        React.useEffect(() => {
          if (!loading && isGenerating) {
            setIsGenerating(false);
            onGenerationComplete?.(!error);
          }
        }, [loading, error, url]);

        if (error) {
          console.error("Error generating PDF:", error);
        }

        return (
          <Button
            disabled={loading}
            variant="secondary"
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};
