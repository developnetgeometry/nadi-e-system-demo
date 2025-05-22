// ChartGenerator.tsx
import { useState, useEffect } from 'react';
import {
  StaffDistribution,
  StaffVacancy,
  HRStaffMember,
  IncentiveDistributionData
} from "@/hooks/report/use-hr-salary-data";
import { StaffDistributionChart } from './charts/StaffDistributionChart';
import { SalaryByPositionChart } from './charts/SalaryByPositionChart';
import { VacancyDistributionChart } from './charts/VacancyDistributionChart';
import { IncentiveByPositionChart } from './charts/IncentiveByPositionChart';
import { IncentiveDistributionChart } from './charts/IncentiveDistributionChart';

// Define chart bundle type
export interface ChartBundle {
  staffDistributionChart: string;
  salaryChart: string;
  vacancyChart: string;
  incentiveChart: string;
  incentiveDistributionChart: string;
}

// Define salary data type used by SalaryByPositionChart
export interface SalaryData {
  position: string;
  salary: number;
  color?: string;
}

interface ChartGeneratorProps {
  employeeDistribution: StaffDistribution[];
  vacancies: StaffVacancy[];
  staff: HRStaffMember[];
  incentiveDistribution: IncentiveDistributionData[];
  onChartsReady: (charts: ChartBundle) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  employeeDistribution,
  vacancies,
  staff,
  incentiveDistribution,
  onChartsReady
}) => {
  const [charts, setCharts] = useState<Partial<ChartBundle>>({});

  // Handle individual chart ready events
  const handleChartReady = (type: keyof ChartBundle, base64Image: string) => {
    setCharts(prevCharts => ({
      ...prevCharts,
      [type]: base64Image
    }));
  };

  useEffect(() => {
    // When all charts are ready, notify parent component
    if (
      charts.staffDistributionChart &&
      charts.salaryChart &&
      charts.vacancyChart &&
      charts.incentiveChart &&
      charts.incentiveDistributionChart
    ) {
      onChartsReady(charts as ChartBundle);
    }
  }, [charts, onChartsReady]);

  // TODO: Fetch and process salaryData, incentiveData, etc. from your database here
  const salaryData: SalaryData[] = [];
  const incentiveData: { position: string; incentive: number; color?: string }[] = [];

  // Render all chart components directly with image generation and style
  return (
    <>
      <StaffDistributionChart
        data={employeeDistribution}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('staffDistributionChart', img)}
      />
      <SalaryByPositionChart
        data={salaryData}
        width={650}
        height={420}
        onReady={(img) => handleChartReady('salaryChart', img)}
      />
      <VacancyDistributionChart
        data={vacancies}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('vacancyChart', img)}
      />
      <IncentiveByPositionChart
        data={incentiveData}
        width={650}
        height={420}
        onReady={(img) => handleChartReady('incentiveChart', img)}
      />
      <IncentiveDistributionChart
        data={incentiveDistribution}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('incentiveDistributionChart', img)}
      />
    </>
  );
};

export default ChartGenerator;
