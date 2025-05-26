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
  fileName?: string;
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

  // Map data for PDF (same as previously done in the page)
  const mappedSites = pdfData.sites.map(site => ({
    standard_code: site.standard_code || '',
    name: site.sitename || '',
    state: site.phase_name || '',
  }));
  const mappedUtilities = pdfData.utilities.map(utility => ({
    site_id: utility.site_id,
    site_name: utility.sitename || '',
    state: '',
    has_water: utility.type_name === 'Water',
    has_electricity: utility.type_name === 'Electricity',
    has_sewerage: utility.type_name === 'Sewerage',
    type_name: utility.type_name,
    amount_bill: utility.amount_bill,
  }));
  const mappedInsurance = pdfData.insurance.map(ins => ({
    standard_code: ins.site_id || '',
    site_name: ins.sitename || '',
    state: '',
    duration: ins.start_date && ins.end_date ?
      `${new Date(ins.start_date).toLocaleDateString()} - ${new Date(ins.end_date).toLocaleDateString()}` :
      'N/A',
  }));
  const mappedLocalAuthority = pdfData.localAuthority.map(la => ({
    standard_code: la.site_id || '',
    site_name: la.sitename || '',
    state: '',
  }));
  const mappedAudits = pdfData.audits.map(audit => ({
    standard_code: audit.site_id || '',
    site_name: audit.sitename || '',
    state: '',
  }));
  const mappedAgreements = pdfData.agreements.map(agreement => ({
    standard_code: agreement.site_id || '',
    site_name: agreement.sitename || '',
    state: '',
  }));
  const mappedProgrammes = pdfData.awarenessPromotion.map(prog => ({
    standard_code: prog.site_id || '',
    site_name: prog.sitename || '',
    state: '',
    program_name: prog.programme_name || '',
    program_date: prog.date || '',
    status: prog.status || '',
  }));

  const fileName=`site-management-report-${new Date().toISOString().split('T')[0]}.pdf`
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    try {
      const blob = await pdf(
        <SiteManagementReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          sites={mappedSites}
          utilities={mappedUtilities}
          localAuthority={mappedLocalAuthority}
          insurance={mappedInsurance}
          audits={mappedAudits}
          agreements={mappedAgreements}
          programmes={mappedProgrammes}
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
      console.error('Error generating PDF:', error);
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

export default SiteManagementReportDownloadButton;
