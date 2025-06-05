export interface PortalWebServiceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    site_url_web_portal: string;
    email_staff: string[];
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for PortalWebService data
 * This function is used by Portal&WebService.tsx to fetch PortalWebService data directly without React hooks
 */
export const fetchPortalWebServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching PortalWebService data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const portalWebService = [
        {
            site_id: "1",
            standard_code: "K11N012",
            site_name: "NADI Kampung Musa",
            refId: "K09C002",
            state: "Kedah",
            site_url_web_portal: "https://kgmusa.nadi.my/",
            email_staff: ["yap.jia.hui@kgmusa.nadi.my","muhammad.luqman@kgmusa.nadi.my"],
           
        },
        {
            site_id: "2",
            standard_code: "N11N009",
            site_name: "NADI Taman Bukit Inai",
            refId: "N09C001",
            state: "Kelantan",
            site_url_web_portal: "tamanbukitinai.nadi.my",
            email_staff: ["sim.mei.hui@tamanbukitinai.nadi.my","mazlan.shah@tamanbukitinai.nadi.my"],
          
        },
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        portalWebService: portalWebService as PortalWebServiceData[]
    };
}

// For backward compatibility
export default fetchPortalWebServiceData;

