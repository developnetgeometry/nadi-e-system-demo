import { useState, useEffect } from "react";

// Define type for HR Salary Staff Member
export interface HRStaffMember {
  id: string;
  site_id?: string;
  sitename?: string;
  state?: string; // Added state field for NADI & STATE column
  phase_name?: string;
  fullname: string;
  position?: string;
  department?: string;
  salary?: number;
  service_period?: string; // Added service period (e.g., "5y 6m 13d")
  join_date?: string; // Added join date
  date_start_work?: string; // For incentive report
  date_end_work?: string; // For incentive report
  duration?: number; // Duration in days for incentive
  has_incentive?: boolean;
  incentive_amount?: number;
}

// Define data structure for distribution stats
export interface StaffDistribution {
  position: string;
  count: number;
  color: string;
}

// Define data structure for vacancy stats
export interface StaffVacancy {
  position: string;
  open: number;
  filled: number;
  color: string;
}

// Define data structure for turnover rates
export interface TurnoverRate {
  month: string;
  rate: number;
}

// Add type for incentive distribution chart data
export interface IncentiveDistributionData {
  position: string;
  count: number;
  color?: string;
}

  //This where api will fetch the data
// Main hook for HR Salary data
export const useHRSalaryData = (
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) => {
  const [staff, setStaff] = useState<HRStaffMember[]>([]);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [activeNadiSites, setActiveNadiSites] = useState<number>(0);
  const [sitesWithIncentives, setSitesWithIncentives] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeDistribution, setEmployeeDistribution] = useState<StaffDistribution[]>([]);
  const [vacancies, setVacancies] = useState<StaffVacancy[]>([]);
  const [turnoverRates, setTurnoverRates] = useState<TurnoverRate[]>([]);
  const [incentiveDistribution, setIncentiveDistribution] = useState<IncentiveDistributionData[]>([]);


  useEffect(() => {
    setStaff([]);
    setTotalStaff(0);
    setActiveNadiSites(0);
    setSitesWithIncentives(0);
    setEmployeeDistribution([]);
    setVacancies([]);
    setTurnoverRates([]);
    setIncentiveDistribution([]);
    setLoading(false);
    setError(null);
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);


  const averageSalary = 0;
  const averageIncentive = 0;
  const averageTurnoverRate = 0;

  return {
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
    incentiveDistribution,
    loading,
    error
  };
};
