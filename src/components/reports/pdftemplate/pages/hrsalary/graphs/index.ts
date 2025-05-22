// index.ts - Chart Components
export * from './charts/StaffDistributionChart';
export * from './charts/StaffDistributionChartImage';
export * from './charts/SalaryByPositionChart';
export * from './charts/SalaryByPositionChartImage';
export * from './charts/VacancyDistributionChart';
export * from './charts/VacancyDistributionChartImage';
export * from './hooks/useChartImageGenerator';
export * from './utils/colorUtils';
export * from './utils/ChartStyles';
export type { ChartBundle, SalaryData } from './ChartGenerator';  // Export interfaces from ChartGenerator now

// Re-export the ChartGenerator as default
import ChartGenerator from './ChartGenerator';
export default ChartGenerator;
