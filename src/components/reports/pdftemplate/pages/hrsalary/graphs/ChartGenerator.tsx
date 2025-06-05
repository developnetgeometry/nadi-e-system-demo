// ChartGenerator.tsx
import { useState, useEffect, useMemo } from 'react';
import { StaffDistributionChart } from './charts/StaffDistributionChart';
import { SalaryByPositionChart } from './charts/SalaryByPositionChart';
import { VacancyDistributionChart } from './charts/VacancyDistributionChart';
import { IncentiveByPositionChart } from './charts/IncentiveByPositionChart';
import { IncentiveDistributionChart } from './charts/IncentiveDistributionChart';
import type { staffPerformanceIncentive, staffSalary, staffVacancy } from '@/hooks/report/use-hr-salary-pdf-data';

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

// Define transformed data types
export interface FormattedSalaryData {
  position: string;
  salary: number;
  count: number;
  color?: string;
}

export interface FormattedVacancyData {
  position: string;
  filled: number;
  vacant: number;
  color?: string;
}

export interface FormattedIncentiveData {
  position: string;
  incentive: number;
  count: number;
  color?: string;
}

interface ChartGeneratorProps {
  staffSalary: staffSalary[];
  staffPerformanceIncentive: staffPerformanceIncentive[];
  staffVacancy: staffVacancy[];

  onChartsReady: (charts: ChartBundle) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  staffSalary ,
  staffPerformanceIncentive,
  staffVacancy,
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
  // Transform staffSalary data for charts
  const transformedSalaryData = useMemo(() => {
    // Group by position and calculate average salary
    const positionGroups: Record<string, { total: number, count: number }> = {};
      staffSalary.forEach(staff => {
      // Use staffPosition as fallback if position is not available
      const position = staff.position || staff.staffPosition || 'Unknown';
      if (!positionGroups[position]) {
        positionGroups[position] = { total: 0, count: 0 };
      }
      positionGroups[position].total += staff.salary || 0;
      positionGroups[position].count += 1;
    });
    
    // Generate formatted data with positions, average salaries and counts
    return Object.entries(positionGroups).map(([position, data], index) => ({
      position,
      salary: data.total / data.count,
      count: data.count,
      // Add some default colors based on index
      color: [`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`, `#FF6D01`, `#46BDC6`][index % 6]
    }));
  }, [staffSalary]);

  // Transform vacancy data
  const transformedVacancyData = useMemo(() => {
    const positionData: Record<string, { filled: number, vacant: number }> = {};
      staffVacancy.forEach(vacancy => {
      // Make sure position is always defined
      const position = vacancy.position || 'Unknown';
      if (!positionData[position]) {
        positionData[position] = { filled: 0, vacant: 0 };
      }
      positionData[position].filled += vacancy.filled || 0;
      positionData[position].vacant += vacancy.vacant || 0;
    });
    
    return Object.entries(positionData).map(([position, data], index) => ({
      position,
      filled: data.filled,
      vacant: data.vacant,
      color: [`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`, `#FF6D01`, `#46BDC6`][index % 6]
    }));
  }, [staffVacancy]);
  // Transform incentive data
  const transformedIncentiveData = useMemo(() => {
    const positionGroups: Record<string, { total: number, count: number }> = {};
    
    staffPerformanceIncentive.forEach(staff => {
      // Use staffPosition as fallback if position is not available
      const position = staff.position || staff.staffPosition || 'Unknown';
      if (!positionGroups[position]) {
        positionGroups[position] = { total: 0, count: 0 };
      }
      positionGroups[position].total += staff.incentive || 0;
      positionGroups[position].count += 1;
    });
    
    return Object.entries(positionGroups).map(([position, data], index) => ({
      position,
      incentive: data.total / data.count,
      count: data.count,
      color: [`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`, `#FF6D01`, `#46BDC6`][index % 6]
    }));
  }, [staffPerformanceIncentive]);

  // Render all chart components directly with image generation and style
  return (
    <>
      <StaffDistributionChart
        data={transformedSalaryData}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('staffDistributionChart', img)}
      />
      <SalaryByPositionChart
        data={transformedSalaryData}
        width={650}
        height={420}
        onReady={(img) => handleChartReady('salaryChart', img)}
      />
      <VacancyDistributionChart
        data={transformedVacancyData}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('vacancyChart', img)}
      />
      <IncentiveByPositionChart
        data={transformedIncentiveData}
        width={650}
        height={420}
        onReady={(img) => handleChartReady('incentiveChart', img)}
      />
      <IncentiveDistributionChart
        data={transformedIncentiveData}
        width={520}
        height={380}
        onReady={(img) => handleChartReady('incentiveDistributionChart', img)}
      />
    </>
  );
};

export default ChartGenerator;
