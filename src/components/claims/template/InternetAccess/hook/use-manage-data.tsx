export interface ManageInternetServiceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    technology: string; // e.g., "Fiber", "DSL", etc.
    bandwidth: string; // e.g., "100 Mbps", "1 Gbps", etc.
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for ManageInternetService data
 * This function is used by ManageInternetService.tsx to fetch ManageInternetService data directly without React hooks
 */
export const fetchManageInternetServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching ManageInternetService data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const manage = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            technology: "Fiber",
            bandwidth: "100 Mbps"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            technology: "DSL",
            bandwidth: "50 Mbps"
        }       
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        manage: manage as ManageInternetServiceData[]
    };
}

// For backward compatibility
export default fetchManageInternetServiceData;

