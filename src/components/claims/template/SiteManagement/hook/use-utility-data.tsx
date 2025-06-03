export interface utilityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    water: boolean; //site has water bill
    electricity: boolean; //site has electricity bill
    sewerage: boolean; // site has sewerage bill
}


/**
 * Data fetching function (non-hook) for utility data
 * This function is used by utility.tsx to fetch utility data directly without React hooks
 */


export const fetchUtilityData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching utility data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const utility = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            water: true,
            electricity: true,
            sewerage: false
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            water: false,
            electricity: true,
            sewerage: true
        }
        
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        utility: utility as utilityData[]
    };
}

// For backward compatibility
export default fetchUtilityData;