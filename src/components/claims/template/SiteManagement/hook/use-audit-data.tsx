export interface AuditData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Audit data
 * This function is used by Audit.tsx to fetch audit data directly without React hooks
 */
export const fetchAuditData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching audit data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const audits = [
        {
            site_id: "1",
            standard_code: "J05N002",
            site_name: "NADI Bandar Permas",
            refId: "J05C002",
            state: "Johor",
        },
        {
            site_id: "2",
            standard_code: "N11N003",
            site_name: "NADI Desa Permai Repah",
            refId: "DG_PI1M_127",
            state: "Negeri Sembilan"
        }
    ];
    
    // Return the data in the same format as the hook
    return { 
        audits: audits as AuditData[]
    };
}

// For backward compatibility
export default fetchAuditData;

