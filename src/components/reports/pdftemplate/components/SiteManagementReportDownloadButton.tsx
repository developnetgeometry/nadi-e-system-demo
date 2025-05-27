import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteManagementReportPDF } from "../pages/sitemanagement/SiteManagementReport";
import { useSiteManagementPdfData } from '@/hooks/report/use-site-management-pdf-data';

// Props for the Site Management Report Download Button
// Only accept filter/config props, not mapped arrays
interface SiteManagementReportDownloadButtonProps {
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;
  totalSites?: number; // Optional, can be derived
  mcmcLogo: string;
  duspLogo: string;
  monthFilter?: string | number | null;
  yearFilter?: string | number | null;
  duspFilter?: (string | number)[];
  phaseFilter?: string | number | null;
  nadiFilter?: (string | number)[];
  tpFilter?: (string | number)[];
  onGenerationStart?: () => void;
  onGenerationComplete?: (success: boolean) => void;
}

export const SiteManagementReportDownloadButton = ({
  duspLabel,
  phaseLabel,
  periodType,
  periodValue,

  mcmcLogo,
  duspLogo,

  monthFilter = null,
  yearFilter = null,
  duspFilter = [],
  phaseFilter = null,
  nadiFilter = [],
  tpFilter = [],
  onGenerationStart,
  onGenerationComplete
}: SiteManagementReportDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  // Fetch all PDF data internally
  const pdfData = useSiteManagementPdfData(
    duspFilter,
    phaseFilter,
    nadiFilter,
    monthFilter,
    yearFilter,
    tpFilter
  );
  const fileName = `site-management-report-${new Date().toISOString().split('T')[0]}.pdf`;  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    try {
      // Check if data is still loading
      if (pdfData.loading) {
        console.warn("Data is still loading. Waiting for data to be available...");
        // Wait a bit before continuing
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Debug data before PDF generation
      console.log('PDF DATA CHECK:', {
        sitesCount: pdfData.sites?.length || 0,
        utilitiesCount: pdfData.utilities?.length || 0, 
        insuranceCount: pdfData.insurance?.length || 0,
        localAuthorityCount: pdfData.localAuthority?.length || 0,
        auditsCount: pdfData.audits?.length || 0,
        agreementsCount: pdfData.agreements?.length || 0,
        programmeCount: pdfData.awarenessPromotion?.length || 0,
        filters: { monthFilter, yearFilter, duspFilter, phaseFilter, nadiFilter, tpFilter }
      });
      
      const blob = await pdf(
        <SiteManagementReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          sites={pdfData.sites || []}
          utilities={pdfData.utilities || []}
          localAuthority={pdfData.localAuthority || []}
          insurance={pdfData.insurance || []}
          audits={pdfData.audits || []}
          agreements={pdfData.agreements || []}
          programmes={pdfData.awarenessPromotion || []}
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
      onGenerationComplete?.(true);    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Provide more detailed error info
      if (error instanceof Error) {
        console.error(`Error details: ${error.name}: ${error.message}`);
        console.error('Stack trace:', error.stack);
        
        // Check common issues
        if (error.message.includes('undefined')) {
          console.error('Possible undefined data issue - check if all required data is loaded.');
        }
        if (error.message.includes('map') || error.message.includes('is not a function')) {
          console.error('Possible invalid data structure - ensure arrays are properly initialized.');
        }
      }
      
      setIsGenerating(false);
      onGenerationComplete?.(false);
    }
  };
  // Show warning if data is missing
  const hasMissingData = !pdfData.sites?.length || 
    (!pdfData.utilities?.length && 
     !pdfData.insurance?.length && 
     !pdfData.localAuthority?.length &&
     !pdfData.audits?.length &&
     !pdfData.agreements?.length &&
     !pdfData.awarenessPromotion?.length);

  return (
    <div className="flex flex-col items-end">
      <Button
        disabled={isGenerating}
        variant="secondary"
        className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
        onClick={generateAndDownloadPDF}
        title={hasMissingData ? "Some data sections may be empty in the report" : "Download PDF report"}
      >
        {isGenerating ? (
          <>
            <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </>
        )}
      </Button>
    </div>
  );
};

export default SiteManagementReportDownloadButton;
