// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-agreement-data.tsx
export interface agreementData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    attachments_path?: string[]; // Optional attachment field
}


/**
 * Data fetching function (non-hook) for agreement data
 * This function is used by agreement.tsx to fetch agreement data directly without React hooks
 */


export const fetchAgreementData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching agreement data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const agreement = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            attachments_path: [
                "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf",
                "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf"
            ]
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
        agreement: agreement as agreementData[]
    };
}

// For backward compatibility
export default fetchAgreementData;