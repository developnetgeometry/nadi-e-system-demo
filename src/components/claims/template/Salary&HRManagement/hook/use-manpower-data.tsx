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
            standard_code: "B02N002",
            site_name: "NADI Taman Seri Serendah",
            refId: "B03C002",
            state: "Selangor",
            status: "Active",
            position: "Manager",
        },
        {
            site_id: "2",
            standard_code: "C11N008",
            site_name: "NADI Felda Keratong 5",
            refId: "C09C003",
            state: "Pahang",
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

