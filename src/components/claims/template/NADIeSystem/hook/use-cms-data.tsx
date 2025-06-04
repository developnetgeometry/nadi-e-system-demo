export interface CMSData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    pc_client_count: number;
    date_install: string;
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for CMS data
 * This function is used by CMS.tsx to fetch CMS data directly without React hooks
 */
export const fetchCMSData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching CMS data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const cms = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            pc_client_count: 10,
            date_install: "2023-10-01"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            pc_client_count: 5,
            date_install: "2023-10-02"
        },
        {
            site_id: "3",
            standard_code: "SC003",
            site_name: "Site C",
            refId: "REF003",
            state: "State C",
            pc_client_count: 8,
            date_install: "2023-10-03"
        }
        
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        cms: cms as CMSData[]
    };
}

// For backward compatibility
export default fetchCMSData;

