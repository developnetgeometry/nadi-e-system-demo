// ChartGenerator.tsx
import { useState, useEffect } from 'react';
import {
  StaffDistribution,
  StaffVacancy,
  HRStaffMember
} from "@/hooks/report/use-hr-salary-data";
import { ChartImageRenderer } from './ChartImageRenderer';

interface ChartGeneratorProps {
  employeeDistribution: StaffDistribution[];
  vacancies: StaffVacancy[];
  staff: HRStaffMember[];
  onChartsReady: (charts: {
    staffDistributionChart: string;
    salaryChart: string;
    vacancyChart: string;
  }) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  employeeDistribution,
  vacancies,
  staff,
  onChartsReady
}) => {
  const [staffDistributionChart, setStaffDistributionChart] = useState<string | null>(null);
  const [salaryChart, setSalaryChart] = useState<string | null>(null);
  const [vacancyChart, setVacancyChart] = useState<string | null>(null);
  
  // Prepare salary data for chart
  const salaryData = employeeDistribution.map(item => {
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

  useEffect(() => {
    // When all charts are ready, notify parent component
    if (staffDistributionChart && salaryChart && vacancyChart) {
      onChartsReady({
        staffDistributionChart,
        salaryChart,
        vacancyChart
      });
    }
  }, [staffDistributionChart, salaryChart, vacancyChart, onChartsReady]);
  
  // Component doesn't render anything visible
  return (
    <>
      <ChartImageRenderer
        type="staffDistribution"
        data={employeeDistribution}
        onReady={setStaffDistributionChart}
        width={520}
        height={380}
      />
      <ChartImageRenderer
        type="salaryByPosition"
        data={salaryData}
        onReady={setSalaryChart}
        width={650}
        height={420}
      />
      <ChartImageRenderer
        type="vacancyDistribution"
        data={vacancies}
        onReady={setVacancyChart}
        width={520}
        height={380}
      />
    </>
  );
};

export default ChartGenerator;
