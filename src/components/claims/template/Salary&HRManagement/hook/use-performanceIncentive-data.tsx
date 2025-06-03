export interface PerformanceIncentiveData {
    status: string;
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    staff_name?: string; // Optional field for staff names
    staff_position?: string; // Optional field for staff position
    staff_start_work_date?: string; // Optional field for staff start work date
    staff_end_work_date?: string; // Optional field for staff end work date
    staff_duration?: string; // Optional field for staff duration
    staff_incentive?: number; // Optional field for staff position incentive
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for PerformanceIncentive data
 * This function is used by PerformanceIncentive.tsx to fetch PerformanceIncentive data directly without React hooks
 */
export const fetchPerformanceIncentiveData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    
    console.log("Fetching PerformanceIncentive data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const incentive = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            status: "Active",
            staff_name: "John Doe",
            staff_position: "Assistant Manager",
            staff_start_work_date: "2023-01-01",
            staff_end_work_date: "2023-09-30",
            staff_duration: "9 months",
            staff_incentive: 500
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
            staff_start_work_date: "2022-05-15",
            staff_end_work_date: "2023-10-01",
            staff_duration: "1 year 4 months",
            staff_incentive: 700
        }
        
    ];
    
    // Return the data in the same format as the hook
    return { 
       incentive:  incentive as  PerformanceIncentiveData[]
    };
}

// For backward compatibility
export default fetchPerformanceIncentiveData;

