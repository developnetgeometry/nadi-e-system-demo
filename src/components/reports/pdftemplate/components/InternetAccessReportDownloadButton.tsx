import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
}) => {  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);

  // Calculate percentages for key metrics
  const internetAccessPercentage = totalSites > 0 
    ? ((sitesWithInternet / totalSites) * 100).toFixed(1) 
    : "0";
    // Effect to reset button state when filters change
  useEffect(() => {
    // Reset the button state when any filter changes
    if (showDownloadLink) {
      setShowDownloadLink(false);
      setIsGenerating(false);
    }
  }, [duspFilter, phaseFilter, monthFilter, yearFilter]);

  // Handle button click to start PDF generation
  const handleGenerateClick = () => {
    setIsGenerating(true);
    setShowDownloadLink(true);
    onGenerationStart?.();
  };

  // Only render PDFDownloadLink after user has clicked to generate
  if (!showDownloadLink) {
    return (      <Button
        variant="secondary"
        className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
        onClick={handleGenerateClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Generate PDF Report
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={
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

        return (          <Button
            disabled={loading}
            variant="secondary"
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
          >            {loading ? (
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
