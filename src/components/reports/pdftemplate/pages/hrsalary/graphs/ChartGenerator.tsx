// ChartGenerator.tsx
import { useState, useEffect } from 'react';
import {
  StaffDistribution,
  StaffVacancy,
  HRStaffMember
} from "@/hooks/report/use-hr-salary-data";
import { StaffDistributionChartImage } from './charts/StaffDistributionChartImage';
import { SalaryByPositionChartImage } from './charts/SalaryByPositionChartImage';
import { VacancyDistributionChartImage } from './charts/VacancyDistributionChartImage';

// Define chart bundle type
export interface ChartBundle {
  staffDistributionChart: string;
  salaryChart: string;
  vacancyChart: string;
}

// Define salary data type used by SalaryByPositionChartImage
export interface SalaryData {
  position: string;
  salary: number;
  color?: string;
}

interface ChartGeneratorProps {
  employeeDistribution: StaffDistribution[];
  vacancies: StaffVacancy[];
  staff: HRStaffMember[];
  onChartsReady: (charts: ChartBundle) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  employeeDistribution,
  vacancies,
  staff,
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
    if (charts.staffDistributionChart && charts.salaryChart && charts.vacancyChart) {
      onChartsReady(charts as ChartBundle);
    }
  }, [charts, onChartsReady]);

  // Prepare salary data directly here
  const salaryData: SalaryData[] = employeeDistribution.map(item => {
    // Find average salary for this position
    const staffWithPosition = staff.filter(s => 
      s.position?.toUpperCase().includes(item.position.toUpperCase())
    );
    
    const avgSalary = staffWithPosition.length > 0
      ? staffWithPosition.reduce((sum, s) => sum + (s.salary || 0), 0) / staffWithPosition.length
      : 0;
    
    return {
      position: item.position,
      salary: avgSalary,
      color: item.color
    };
  });
  
  // Render all chart components directly
  return (
    <>
      <StaffDistributionChartImage
        key="staffDistribution"
        data={employeeDistribution}
        onReady={(img) => handleChartReady('staffDistributionChart', img)}
        width={520}
        height={380}
      />
      <SalaryByPositionChartImage
        key="salaryByPosition"
        data={salaryData}
        onReady={(img) => handleChartReady('salaryChart', img)}
        width={650}
        height={420}
      />
      <VacancyDistributionChartImage
        key="vacancyDistribution"
        data={vacancies}
        onReady={(img) => handleChartReady('vacancyChart', img)}
        width={520}
        height={380}
      />
    </>
  );
};

export default ChartGenerator;
