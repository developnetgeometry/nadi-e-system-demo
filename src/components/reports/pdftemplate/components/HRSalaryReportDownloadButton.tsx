import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { HRSalaryReportPDF } from "../pages/hrsalary/HRSalaryReport";
import { StaffDistribution, StaffVacancy, TurnoverRate, HRStaffMember } from "@/hooks/report/use-hr-salary-data";

interface HRSalaryReportDownloadButtonProps {
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
  staff: HRStaffMember[];
  totalStaff: number;
  activeNadiSites: number;
  sitesWithIncentives: number;
  averageSalary: number;
  averageIncentive: number;
  employeeDistribution: StaffDistribution[];
  vacancies: StaffVacancy[];
  turnoverRates: TurnoverRate[];
  averageTurnoverRate: number;

  // Logos
  mcmcLogo?: string;
  duspLogo?: string;

  // Button configuration
  fileName: string;
  onGenerationStart?: () => void;
  onGenerationComplete?: (success: boolean) => void;
}

export const HRSalaryReportDownloadButton: React.FC<HRSalaryReportDownloadButtonProps> = ({
  duspLabel = "",
  phaseLabel = "All Phases",
  periodType = "All Time",
  periodValue = "All Records",
  monthFilter = null,
  yearFilter = null,
  duspFilter = [],
  phaseFilter = null,
  staff = [],
  totalStaff = 0,
  activeNadiSites = 0,
  sitesWithIncentives = 0,
  averageSalary = 0,
  averageIncentive = 0,
  employeeDistribution = [],
  vacancies = [],
  turnoverRates = [],
  averageTurnoverRate = 0,
  mcmcLogo = "",
  duspLogo = "",
  fileName = "hr-salary-report.pdf",
  onGenerationStart,
  onGenerationComplete,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Function to generate and download PDF
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    onGenerationStart?.();
    
    try {
      // Create the PDF document
      const blob = await pdf(
        <HRSalaryReportPDF
          duspLabel={duspLabel}
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
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
          currentMonth={new Date().getMonth() + 1}
          currentYear={new Date().getFullYear()}
        />
      ).toBlob();
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onGenerationComplete?.(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      onGenerationComplete?.(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="secondary"
      className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
      onClick={generateAndDownloadPDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <span className="animate-spin">◌</span>
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isGenerating ? "Generating..." : "Download Report"}
    </Button>
  );
};