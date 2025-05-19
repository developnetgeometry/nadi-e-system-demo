import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
    status: string;
};

type Audit = {
    standard_code: string;
    site_name: string;
    state: string;
    audit_date: string;
    status: string;
};

type Agreement = {
    standard_code: string;
    site_name: string;
    state: string;
    start_date: string;
    end_date: string;
    status: string;
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
    authority_name: string;
    reference_no: string;
    duration: string;
    status: string;
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
    buttonText = "Generate PDF",
    fileName = "site-management-report.pdf",
    onGenerationStart,
    onGenerationComplete
}: SiteManagementReportDownloadButtonProps) => {
    // Track loading state internally
    const [isGenerating, setIsGenerating] = React.useState(false);
    // Track if user has clicked to generate PDF
    const [userClickedGenerate, setUserClickedGenerate] = React.useState(false);

    // Handle the initial button click to start generating PDF
    const handleGeneratePDF = () => {
        setUserClickedGenerate(true);
        setIsGenerating(true);
        onGenerationStart?.();
    };

    // Log the data for debugging - remove in production
    React.useEffect(() => {
        if (userClickedGenerate) {
            console.log("PDF data being used:", {
                sites: sites.length,
                utilities: utilities.length,
                insurance: insurance.length,
                localAuthority: localAuthority?.length || 0,
                audits: audits.length,
                agreements: agreements.length
            });
        }
    }, [userClickedGenerate, sites, utilities, insurance, localAuthority, audits, agreements]);

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

export default SiteManagementReportDownloadButton;
