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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-closure/B15N006/B15N006_213_1748422766799_0_63d2ba34e3de7982097624fb_word-invoice-template-3.png", "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-closure/_211_1748419298636_0_63d2ba34e3de7982097624fb_word-invoice-template-3.png"]
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf"]
        }
    ];
    
    // Return the data in the same format as the hook
    return { 
        audits: audits
    };
}

// For backward compatibility
export default fetchAuditData;

