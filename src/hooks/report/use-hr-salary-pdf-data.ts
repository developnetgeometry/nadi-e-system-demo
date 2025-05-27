import { useEffect, useState } from "react";
import { HRStaffMember, StaffDistribution, StaffVacancy, TurnoverRate } from "./use-hr-salary-data";

// This hook fetches HR Salary data for PDF generation reactively based on filters
export function useHRSalaryPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) {
  const [data, setData] = useState<any>({
    staff: [],
    totalStaff: 0,
    activeNadiSites: 0,
    sitesWithIncentives: 0,
    averageSalary: 0,
    averageIncentive: 0,
    employeeDistribution: [],
    vacancies: [],
    turnoverRates: [],
    averageTurnoverRate: 0,
    incentiveDistribution: [],
    incentiveChart: '',
    incentiveDistributionChart: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData({
      staff: [],
      totalStaff: 0,
      activeNadiSites: 0,
      sitesWithIncentives: 0,
      averageSalary: 0,
      averageIncentive: 0,
      employeeDistribution: [],
      vacancies: [],
      turnoverRates: [],
      averageTurnoverRate: 0,
      incentiveDistribution: [],
      incentiveChart: '',
      incentiveDistributionChart: '',
    });
    setLoading(false);
    setError(null);
  }, []); // Only run once on mount

  return { ...data, loading, error };
}
