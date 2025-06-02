export interface MonitoringData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Monitoring data
 * This function is used byMonitoring.tsx to fetch Monitoring data directly without React hooks
 */
export const fetchMonitoringData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching Monitoring data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const monitor = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf","https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf"]
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"]
        }

        
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        monitor: monitor as MonitoringData[]
    };
}

// For backward compatibility
export default fetchMonitoringData;

