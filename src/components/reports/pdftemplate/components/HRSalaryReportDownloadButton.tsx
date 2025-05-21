// HRSalaryReportDownloadButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useHRSalaryData } from '@/hooks/report/use-hr-salary-data';
import { HRSalaryReportPDF } from '../pages/hrsalary/HRSalaryReport';
import ChartGenerator from '../pages/hrsalary/graphs/ChartGenerator';

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
  
  // Get the HR Salary data from the hook
  const {
    staff,
    totalStaff,
    activeNadiSites,
    sitesWithIncentives,
    averageSalary,
    averageIncentive,
    employeeDistribution,
    vacancies,
    turnoverRates,
    averageTurnoverRate,
    loading,
    error
  } = useHRSalaryData(
    duspFilter, 
    phaseFilter,
    monthFilter,
    yearFilter,
    tpFilter
  );
  
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // Step 1: Generate chart images
      const chartPromise = new Promise<{
        staffDistributionChart: string;
        salaryChart: string;
        vacancyChart: string;
      }>((resolve) => {
        // Create a temporary div to mount the chart generator
        const tempDiv = document.createElement('div');
        document.body.appendChild(tempDiv);
        
        // Create a temporary React root
        const cleanup = () => {
          document.body.removeChild(tempDiv);
        };
        
        // Mount the ChartGenerator component
        const chartGeneratorElement = document.createElement('div');
        tempDiv.appendChild(chartGeneratorElement);
        
        // Use React to render the chart generator
        const onChartReady = (charts: {
          staffDistributionChart: string;
          salaryChart: string;
          vacancyChart: string;
        }) => {
          resolve(charts);
          setTimeout(cleanup, 500); // Clean up after a delay to ensure complete rendering
        };
        
        // Render chart component with ReactDOM.render or similar approach
        // This is a simplified version - you would need to use createRoot or another method
        // depending on your React version
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(chartGeneratorElement);
          root.render(
            <ChartGenerator
              employeeDistribution={employeeDistribution}
              vacancies={vacancies}
              staff={staff}
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
          duspLabel={duspFilter?.join(', ')}
          phaseLabel={phaseFilter?.toString() || ""}
          periodType={monthFilter ? "MONTH / YEAR" : "QUARTER / YEAR"}
          periodValue={`${monthFilter || ''}/${yearFilter || ''}`}
          staff={staff}
          totalStaff={totalStaff}
          activeNadiSites={activeNadiSites}
          sitesWithIncentives={sitesWithIncentives}
          averageSalary={averageSalary}
          averageIncentive={averageIncentive}
          employeeDistribution={employeeDistribution}
          vacancies={vacancies}
          turnoverRates={turnoverRates}
          averageTurnoverRate={averageTurnoverRate}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
          monthFilter={monthFilter}
          yearFilter={yearFilter}
          staffDistributionChart={charts.staffDistributionChart}
          salaryChart={charts.salaryChart}
          vacancyChart={charts.vacancyChart}
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
      disabled={isGenerating || loading || !!error}
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
