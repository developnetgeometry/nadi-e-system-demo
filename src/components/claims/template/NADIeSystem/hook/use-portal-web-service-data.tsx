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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            site_url_web_portal: "https://www.youtube.com/",
            email_staff: ["yap.jia.hui@batupayung.my","muhammad.luqman@batupayung.my"],
            // attachments_path: ["https://example.com/attachment-a.pdf"]
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            site_url_web_portal: "https://example.com/portal-b",
            email_staff: ["sim.mei.hui@PPRTamanDahlia.my","mazlan.shah@PPRTamanDahlia.my"],
            // attachments_path: ["https://example.com/attachment-b.pdf"]
        },
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        portalWebService: portalWebService as PortalWebServiceData[]
    };
}

// For backward compatibility
export default fetchPortalWebServiceData;

