export interface ManPowerData {
    status: string;
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    position: string;
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for ManPower data
 * This function is used by ManPower.tsx to fetch ManPower data directly without React hooks
 */
export const fetchManPowerData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    
    console.log("Fetching ManPower data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const manpower = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            status: "Active",
            position: "Manager",
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            status: "Inactive",
            position: "Assistant Manager",
        }
    ];
    
    // Return the data in the same format as the hook
    return { 
       manpower:  manpower as  ManPowerData[]
    };
}

// For backward compatibility
export default fetchManPowerData;

