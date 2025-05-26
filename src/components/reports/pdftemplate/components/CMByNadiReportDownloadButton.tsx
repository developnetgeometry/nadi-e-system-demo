// HRSalaryReportDownloadButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useTrainingPdfData } from '@/hooks/report/use-training-pdf-data';
import { useCMByNadiPdfData } from '@/hooks/report/use-cm-bynadi-pdf-data';
import { CMByNadiReportPDF } from '../pages/comprehensive-maintainance/CMByNadiReport';

interface CMByNadiReportDownloadButtonProps {
    // Report info
    duspLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Filter values to include in the report
    duspFilter: (string | number)[] | null;
    nadiFilter: (string | number)[] | null;
    monthFilter: string | number | null;
    yearFilter: string | number | null;
    tpFilter?: (string | number)[] | null;

    // Logos
    mcmcLogo?: string;
    duspLogo?: string;

    // Button configuration
    onGenerationStart?: () => void;
    onGenerationComplete?: (success: boolean) => void;
    className?: string;
}

export const CMByNadiReportDownloadButton = ({
    duspLabel,
    periodType,
    periodValue,
    duspFilter,
    nadiFilter,
    monthFilter,
    yearFilter,
    tpFilter,
    mcmcLogo = "",
    duspLogo = "",
    onGenerationStart,
    onGenerationComplete,
    className
}: CMByNadiReportDownloadButtonProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    // Step 1: Fetch the data needed for the PDF
    const pdfData = useCMByNadiPdfData(
        duspFilter || [],
        nadiFilter,
        monthFilter,
        yearFilter,
        tpFilter || []
    );

    const handleGenerateReport = async () => {
        try {
            setIsGenerating(true);
            onGenerationStart?.();

            // Use the pdfData directly (already loaded by the hook)
            // Optionally, you may want to check pdfData.loading and pdfData.error here

            // Step 1: Create the PDF
            const fileName = `CM_BY_NADI_Report_${monthFilter || ''}_${yearFilter || ''}.pdf`;
            const blob = await pdf(
                <CMByNadiReportPDF
                    duspLabel={duspLabel}
                    periodType={periodType}
                    periodValue={periodValue}

                    mcmcLogo={mcmcLogo}
                    duspLogo={duspLogo}
                    
                    monthFilter={monthFilter}
                    yearFilter={yearFilter}

                    maintainanceData={pdfData?.maintainanceData}
                    siteInfo={pdfData?.siteInfo}
                    supervisorInfo={pdfData?.supervisorInfo}
                />
            ).toBlob();

            // Step 4: Create and trigger download
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
        } catch (err) {
            console.error("Error generating CM by NADI report PDF:", err);
            setIsGenerating(false);
            onGenerationComplete?.(false);
        }
    };

    return (
        <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            variant="secondary"
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
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

