import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  // Staff distribution data based on image
  const [employeeDistribution, setEmployeeDistribution] = useState<StaffDistribution[]>([
    { position: 'Manager', count: 2, color: '#0000FF' }, // Blue in chart
    { position: 'Assistant Manager', count: 1, color: '#FFA500' }, // Orange in chart
    { position: 'Part Timer', count: 2, color: '#008000' }, // Green in chart
  ]);

  // Vacancies data based on image (showing 5 total vacancies)
  const [vacancies, setVacancies] = useState<StaffVacancy[]>([
    { position: 'Manager', open: 3, filled: 0, color: '#0000FF' },
    { position: 'Assistant Manager', open: 2, filled: 0, color: '#FFA500' },
  ]);

  // Turnover rate data (based on 0.3% shown in image)
  const [turnoverRates, setTurnoverRates] = useState<TurnoverRate[]>([
    { month: 'Jan', rate: 0.3 },
    { month: 'Feb', rate: 0.3 },
    { month: 'Mar', rate: 0.3 },
    { month: 'Apr', rate: 0.3 }
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
          // Mock data based on the actual required format
        setTimeout(() => {
          // Mock data based on the images provided
          const nadiSites = [
            { site: 'BATU 1 SUNGAI PINGGAN', state: 'JOHOR' },
            { site: 'KAMPUNG BERUAS', state: 'PAHANG' }
          ];
          
          const mockStaff: HRStaffMember[] = [];
          
          // Generate staff similar to the example in the images
          const staffNames = [
            'AHMAD AIMAN BIN HUSIN',
            'AHMAD AIDIL BIN ISHAK'
          ];
          
          // Generate 20 mock staff members to match the report example
          for (let i = 0; i < 20; i++) {
            const siteIndex = i % 2;
            const nameIndex = i % 2;
            const isManager = nameIndex === 0; // Ahmad Aiman is always a manager, Ahmad Aidil is assistant
            
            const position = isManager ? 'MANAGER' : 'ASSIST. MANAGER';
            const salary = isManager ? 2500 : 2000;
            const servicePeriod = isManager ? '5y 6m 13d' : '6y 1m 20d';
            const joinDate = isManager ? '01 AUG 2019' : '15 DEC 2018';
            
            mockStaff.push({
              id: `staff-${i + 1}`,
              site_id: `site-${siteIndex + 1}`,
              sitename: nadiSites[siteIndex].site,
              state: nadiSites[siteIndex].state,
              fullname: staffNames[nameIndex],
              position,
              salary,
              service_period: servicePeriod,
              join_date: joinDate,
              date_start_work: joinDate,
              date_end_work: joinDate, // Same date for example
              duration: isManager ? 30 : 28,
              has_incentive: true,
              incentive_amount: isManager ? 2000 : 1500,
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
