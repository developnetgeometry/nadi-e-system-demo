import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define type for HR Salary Staff Member
export interface HRStaffMember {
  id: string;
  site_id?: string;
  sitename?: string;
  phase_name?: string;
  fullname: string;
  position?: string;
  department?: string;
  salary?: number;
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

  // Staff distribution data (mock data for now)
  const [employeeDistribution, setEmployeeDistribution] = useState<StaffDistribution[]>([
    { position: 'Manager', count: 24, color: '#0088FE' },
    { position: 'Assistant Manager', count: 36, color: '#00C49F' },
    { position: 'Part Timer', count: 68, color: '#FF8042' },
  ]);

  // Vacancies data (mock data for now)
  const [vacancies, setVacancies] = useState<StaffVacancy[]>([
    { position: 'Manager', open: 6, filled: 2, color: '#0088FE' },
    { position: 'Assistant Manager', open: 4, filled: 1, color: '#00C49F' },
  ]);

  // Turnover rate data (mock data for now)
  const [turnoverRates, setTurnoverRates] = useState<TurnoverRate[]>([
    { month: 'July', rate: 5.1 },
    { month: 'Aug', rate: 4.9 },
    { month: 'Sep', rate: 5.2 },
    { month: 'Oct', rate: 4.7 },
    { month: 'Nov', rate: 4.5 },
    { month: 'Dec', rate: 4.8 }
  ]);

  // Load staff data
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual Supabase query once the tables are set up
        // For now, we'll use mock data
        
        // Example query structure:
        /*
        let query = supabase
          .from('hr_staff')
          .select(`
            id,
            site_id,
            sites(sitename, phase_id),
            phases(name),
            fullname,
            position,
            department,
            salary,
            has_incentive,
            incentive_amount
          `)
          .order('fullname');
          
        // Apply filters
        if (duspFilter && duspFilter.length > 0) {
          query = query.in('dusp_id', duspFilter);
        }
        
        if (phaseFilter) {
          query = query.eq('phase_id', phaseFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setStaff(data || []);
        */
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockStaff: HRStaffMember[] = [];
          
          // Generate 128 mock staff members
          for (let i = 0; i < 128; i++) {
            const position = i < 24 ? 'Manager' : i < 60 ? 'Assistant Manager' : 'Part Timer';
            const salary = position === 'Manager' ? 5000 + Math.random() * 2000 :
                          position === 'Assistant Manager' ? 3000 + Math.random() * 1000 :
                          1500 + Math.random() * 500;
            
            const hasIncentive = Math.random() > 0.5;
            
            mockStaff.push({
              id: `staff-${i + 1}`,
              site_id: `site-${Math.floor(Math.random() * 12) + 1}`,
              sitename: `NADI Site ${Math.floor(Math.random() * 12) + 1}`,
              phase_name: `Phase ${Math.floor(Math.random() * 3) + 1}`,
              fullname: `Staff Member ${i + 1}`,
              position,
              department: ['Admin', 'IT', 'Operations', 'Finance'][Math.floor(Math.random() * 4)],
              salary,
              has_incentive: hasIncentive,
              incentive_amount: hasIncentive ? Math.round(salary * 0.1) : 0,
            });
          }
          
          setStaff(mockStaff);
          setTotalStaff(mockStaff.length);
          
          // Calculate number of unique active NADI sites
          const uniqueSites = new Set(mockStaff.map(staff => staff.site_id));
          setActiveNadiSites(uniqueSites.size);
          
          // Calculate sites with incentives
          const sitesWithIncentivesSet = new Set(
            mockStaff.filter(s => s.has_incentive).map(s => s.site_id)
          );
          setSitesWithIncentives(sitesWithIncentivesSet.size);
          
          setLoading(false);
        }, 1000);
        
      } catch (err: any) {
        console.error("Error fetching HR staff data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

  // Calculate average salary
  const averageSalary = useMemo(() => {
    if (staff.length === 0) return 0;
    const total = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
    return total / staff.length;
  }, [staff]);
  
  // Calculate average incentive amount
  const averageIncentive = useMemo(() => {
    const staffWithIncentives = staff.filter(s => s.has_incentive);
    if (staffWithIncentives.length === 0) return 0;
    const total = staffWithIncentives.reduce((sum, s) => sum + (s.incentive_amount || 0), 0);
    return total / staffWithIncentives.length;
  }, [staff]);
  
  // Calculate average turnover rate
  const averageTurnoverRate = useMemo(() => {
    if (turnoverRates.length === 0) return 0;
    const total = turnoverRates.reduce((sum, rate) => sum + rate.rate, 0);
    return total / turnoverRates.length;
  }, [turnoverRates]);

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
    loading,
    error
  };
};
