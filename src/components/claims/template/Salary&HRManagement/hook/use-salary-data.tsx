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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            status: "Active",
            staff_name: "John Doe",
            staff_position: "Assistant Manager",
            staff_join_date: "2023-01-01",
            staff_service_period: "9 months",
            staff_salary: 3000
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            status: "Inactive",
            staff_name: "Jane Smith",
            staff_position: "Manager",
            staff_join_date: "2022-05-15",
            staff_service_period: "1 year 5 months",
            staff_salary: 5000
        },
        {
            site_id: "3",
            standard_code: "SC003",
            site_name: "Site C",
            refId: "REF003",
            state: "State C",
            status: "Active",
            staff_name: "Alice Johnson",
            staff_position: "Manager",
            staff_join_date: "2021-03-10",
            staff_service_period: "2 years 8 months",
            staff_salary: 5000
        },
        {
            site_id: "4",
            standard_code: "SC004",
            site_name: "Site D",
            refId: "REF004",
            state: "State D",
            status: "Active",
            staff_name: "Bob Brown",
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

