import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteManagementReportPDF } from "../pages/sitemanagement/SiteManagementReport";

// Types for Site Management Report
type Site = {
    standard_code: string;
    name: string;
    state: string;
};

type Utility = {
    site_id: string;
    site_name: string;
    state: string;
    has_water?: boolean;
    has_electricity?: boolean;
    has_sewerage?: boolean;
    type_name?: string;
    amount_bill?: number;
};

type Insurance = {
    standard_code: string;
    site_name: string;
    state: string;
    duration: string;
};

type Audit = {
    standard_code: string;
    site_name: string;
    state: string;
};

type Agreement = {
    standard_code: string;
    site_name: string;
    state: string;
};

type AwarenessProgram = {
    standard_code: string;
    site_name: string;
    state: string;
    program_name: string;
    program_date: string;
    status: string;
};

type LocalAuthority = {
    standard_code: string;
    site_name: string;
    state: string;
};

// Props for the Site Management Report Download Button
type SiteManagementReportDownloadButtonProps = {
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;
    totalSites: number;
    mcmcLogo: string;
    duspLogo: string;
    sites: Site[];
    utilities: Utility[];
    insurance: Insurance[];
    localAuthority?: LocalAuthority[];
    audits: Audit[];
    agreements: Agreement[];
    programmes: AwarenessProgram[];
    buttonText?: string;
    fileName?: string;
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
    duspFilter?: (string | number)[];
    phaseFilter?: string | number | null;
    nadiFilter?: (string | number)[];
    onGenerationStart?: () => void;
    onGenerationComplete?: (success: boolean) => void;
};

// Helper component for rendering the download button with improved UX
export const SiteManagementReportDownloadButton = ({
    duspLabel,
    phaseLabel,
    periodType,
    periodValue,
    totalSites,
    mcmcLogo,
    duspLogo,
    sites,
    utilities,
    insurance,
    localAuthority = [],
    audits,
    agreements,
    programmes,
    fileName = "site-management-report.pdf",
    monthFilter = null,
    yearFilter = null,
    duspFilter = [],
    phaseFilter = null,
    nadiFilter = [],
    onGenerationStart,
    onGenerationComplete
}: SiteManagementReportDownloadButtonProps) => {    
    // Track loading state internally    
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Function to generate and download PDF
    const generateAndDownloadPDF = async () => {
        setIsGenerating(true);
        onGenerationStart?.();
        
        try {
            // Create the PDF document
            const blob = await pdf(
                <SiteManagementReportPDF
                    duspLabel={duspLabel}
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                    totalSites={totalSites}
                    mcmcLogo={mcmcLogo}
                    duspLogo={duspLogo}
                    sites={sites}
                    utilities={utilities}
                    localAuthority={localAuthority}
                    insurance={insurance}
                    audits={audits}
                    agreements={agreements}
                    programmes={programmes}
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

export default SiteManagementReportDownloadButton;
