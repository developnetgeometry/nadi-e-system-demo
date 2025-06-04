export interface localAuthorityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
}


/**
 * Data fetching function (non-hook) for local authority data
 * This function is used by localAuthority.tsx to fetch local authority data directly without React hooks
 */


export const fetchlocalAuthorityData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching local authority data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const localAuthority = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B"
        }
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        localAuthority: localAuthority as localAuthorityData[]
    };
}

// For backward compatibility
export default fetchlocalAuthorityData;

