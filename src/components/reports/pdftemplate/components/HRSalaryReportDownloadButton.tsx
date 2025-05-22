// HRSalaryReportDownloadButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useHRSalaryPdfData } from '@/hooks/report/use-hr-salary-pdf-data';
import { HRSalaryReportPDF } from '../pages/hrsalary/HRSalaryReport';
import ChartGenerator, { ChartBundle } from '../pages/hrsalary/graphs';

interface HRSalaryReportDownloadButtonProps {
  // Report info
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;

  // Filter values to include in the report
  duspFilter: (string | number)[] | null;
  phaseFilter: string | number | null;
  monthFilter: string | number | null;
  yearFilter: string | number | null;
  tpFilter?: (string | number)[] | null;
  
  // Logos
  mcmcLogo?: string;
  duspLogo?: string;
  
  // Button configuration
  fileName?: string;
  onGenerationStart?: () => void;
  onGenerationComplete?: (success: boolean) => void;
  className?: string;
}

export const HRSalaryReportDownloadButton: React.FC<HRSalaryReportDownloadButtonProps> = ({
  duspLabel = "",
  phaseLabel = "All Phases",
  periodType = "All Time",
  periodValue = "All Records",
  duspFilter,
  phaseFilter,
  monthFilter,
  yearFilter,
  tpFilter,
  mcmcLogo = "",
  duspLogo = "",
  fileName = "hr-salary-report.pdf",
  onGenerationStart,
  onGenerationComplete,
  className
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfData = useHRSalaryPdfData(
    duspFilter || [],
    phaseFilter,
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

      // Step 1: Generate chart images
      const chartPromise = new Promise<ChartBundle>((resolve) => {
        // Create a temporary div to mount the chart generator
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        // Create a temporary React root
        let isCleanedUp = false;
        const cleanup = () => {
          if (!isCleanedUp && document.body.contains(tempDiv)) {
            try {
              document.body.removeChild(tempDiv);
              isCleanedUp = true;
            } catch (error) {
              console.warn('Cleanup error:', error);
            }
          }
        };
        
        // Mount the ChartGenerator component
        const chartGeneratorElement = document.createElement('div');
        tempDiv.appendChild(chartGeneratorElement);
        
        // Use React to render the chart generator
        const onChartReady = (charts: ChartBundle) => {
          resolve(charts);
          setTimeout(cleanup, 500);
        };
        
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(chartGeneratorElement);
          root.render(
            <ChartGenerator
              employeeDistribution={pdfData.employeeDistribution}
              vacancies={pdfData.vacancies}
              staff={pdfData.staff}
              incentiveDistribution={pdfData.incentiveDistribution}
              onChartsReady={onChartReady}
            />
          );
        });
      });
      
      // Step 2: Wait for chart images to be generated
      const charts = await chartPromise;
      
      // Step 3: Create the PDF with chart images
      const fileName = `HR_Salary_Report_${monthFilter || ''}_${yearFilter || ''}.pdf`;
      const blob = await pdf(
        <HRSalaryReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
          staff={pdfData.staff}
          totalStaff={pdfData.totalStaff}
          activeNadiSites={pdfData.activeNadiSites}
          sitesWithIncentives={pdfData.sitesWithIncentives}
          averageSalary={pdfData.averageSalary}
          averageIncentive={pdfData.averageIncentive}
          employeeDistribution={pdfData.employeeDistribution}
          vacancies={pdfData.vacancies}
          turnoverRates={pdfData.turnoverRates}
          averageTurnoverRate={pdfData.averageTurnoverRate}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          staffDistributionChart={charts.staffDistributionChart}
          salaryChart={charts.salaryChart}
          vacancyChart={charts.vacancyChart}
          incentiveChart={charts.incentiveChart}
          incentiveDistributionChart={charts.incentiveDistributionChart}
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
      console.error("Error generating HR Salary report PDF:", err);
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

export default HRSalaryReportDownloadButton;
