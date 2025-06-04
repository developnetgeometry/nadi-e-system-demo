export interface SalaryData {
    status: string;
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    staff_name?: string; // Optional field for staff name
    staff_position?: string; // Optional field for staff position
    staff_join_date?: string; // Optional field for staff joining date
    staff_service_period?: string; // Optional field for staff service period
    staff_salary?: number; // Optional field for staff salary
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) forSalary data
 * This function is used by Salary.tsx to fetch Salary data directly without React hooks
 */
export const fetchSalaryData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    
    console.log("Fetching Salary data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const salary = [
        {
            site_id: "1",
            standard_code: "J05N007",
            site_name: "NADI Taman Lautan Biru",
            refId: "DG_PI1M_129",
            state: "Johor",
            status: "Active",
            staff_name: "Ahmad Khusyairi",
            staff_position: "Assistant Manager",
            staff_join_date: "2023-01-01",
            staff_service_period: "9 months",
            staff_salary: 3000
        },
        {
            site_id: "2",
            standard_code: "C13N003",
            site_name: "NADI Tanah Rata",
            refId: "C11C003",
            state: "Pahang",
            status: "Inactive",
            staff_name: "Siti Zahra",
            staff_position: "Manager",
            staff_join_date: "2022-05-15",
            staff_service_period: "1 year 5 months",
            staff_salary: 5000
        },
        {
            site_id: "3",
            standard_code: "S13N005",
            site_name: "NADI Felda Umas",
            refId: "S11C005",
            state: "Sabah",
            status: "Active",
            staff_name: "Alice Johnson",
            staff_position: "Manager",
            staff_join_date: "2021-03-10",
            staff_service_period: "2 years 8 months",
            staff_salary: 5000
        },
        {
            site_id: "4",
            standard_code: "B09N001",
            site_name: "NADI Hulu Chuchoh",
            refId: "DG_PI1M_035",
            state: "Selangor",
            status: "Active",
            staff_name: "Muhammad Akmal",
            staff_position: "Part-Time",
            staff_join_date: "2020-11-20",
            staff_service_period: "3 years 6 months",
            staff_salary: 2000
        }   
    ];
    
    // Return the data in the same format as the hook
    return { 
       salary:  salary as  SalaryData[]
    };
}

// For backward compatibility
export default fetchSalaryData;

