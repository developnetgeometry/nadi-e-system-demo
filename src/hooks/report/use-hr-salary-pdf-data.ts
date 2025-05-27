import { useEffect, useState } from "react";


export interface staffSalary {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  staffName?: string;
  staffPosition?: string;
  staffJoiningDate?: string;
  service_period?: string;
  salary?: number;
  position: string;  // Added for chart compatibility
}

export interface staffPerformanceIncentive {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  staffName?: string;
  staffPosition?: string;
  startWorkDate?: string;
  endWorkDate?: string;
  duration?: string;
  position: string;  // Added for chart compatibility
  incentive: number; // Added for chart compatibility
}

export interface staffVacancy {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  position: string;
  filled: number;   // Added for chart compatibility
  vacant: number;   // Added for chart compatibility
}
export interface HRSalaryPdfData {

  staffSalary: staffSalary[];
  staffPerformanceIncentive: staffPerformanceIncentive[];
  staffVacancy: staffVacancy[];

}


// This hook fetches HR Salary data for PDF generation reactively based on filters
export function useHRSalaryPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
): HRSalaryPdfData {
  const [data, setData] = useState<any>({
    staffSalary: [],
    staffPerformanceIncentive: [],
    staffVacancy: [],
    employeeDistribution: [],
    incentiveDistribution: [],
    incentiveChart: '',
    incentiveDistributionChart: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData({
      staffSalary: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "A11N004",
          sitename: "NADI Selekoh",
          state: "Perak",
          staffName: "Mazlan Shah",
          position: "Manager",  // Added for chart compatibility
          staffJoiningDate: "2023-01-01",
          service_period: "6 months",
          salary: 5000,
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "K10N005",
          sitename: "NADI Pekan Kuala 502",
          state: "Kedah",
          staffName: "Wong Jun Hao",
          position: "Assistant Manager",
          staffJoiningDate: "2023-02-01",
          service_period: "4 months",
          salary: 4000,
        },
        {
          id: "3",
          siteId: "site3",
          standard_code: "S02N004",
          sitename: "NADI Pekan Telupid",
          state: "Sabah",
          staffName: "Alice Johnson",
          position: "Part-Time",
          staffJoiningDate: "2023-03-01",
          service_period: "3 months",
          salary: 3000,
        },
      ],
      staffPerformanceIncentive: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "D12N002",
          sitename: "NADI Kampung Lata Janggut",
          state: "Kelantan",
          staffName: "Ahmad Faizal",
          startWorkDate: "2023-01-01",
          endWorkDate: "2023-06-30",
          duration: "6 months",
          position: "Manager",  // Added for chart compatibility
          incentive: 500,     // Added for chart compatibility
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "D12N003",
          sitename: "NADI Kampung Bunut Payong",
          state: "Kelantan",
          staffName: "Mohd Azlan",
          startWorkDate: "2023-02-01",
          endWorkDate: "2023-06-30",
          duration: "4 months",
          position: "Assistant Manager",  // Added for chart compatibility
          incentive: 300,               // Added for chart compatibility
        },
      ],
      staffVacancy: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "D12N004",
          sitename: "NADI Tanjong Mas",
          state: "Kelantan",
          position: "Manager",
          filled: 2,  // Added for chart compatibility
          vacant: 1,  // Added for chart compatibility
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "S02N004",
          sitename: "NADI Pekan Telupid",
          state: "Sabah",
          position: "Assistant Manager",
          filled: 1,  // Added for chart compatibility
          vacant: 2,  // Added for chart compatibility
        },
      ],

    });
    setLoading(false);
    setError(null);
  }, []); // Only run once on mount

  return { ...data, loading, error };
}
