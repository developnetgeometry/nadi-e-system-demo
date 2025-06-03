export interface AwarenessPromotionData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    programme_name: string;
    programme_date: string;
    attachments_path?: string[]; // Optional, if there are attachments
}


/**
 * Data fetching function (non-hook) for Awareness Promotion data
 * This function is used by AwarenessPromotion.tsx to fetch Awareness Promotion data directly without React hooks
 */


export const fetchAwarenessPromotionData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching Awareness Promotion data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const anp = [
        {
            site_id: "1",
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            programme_name: "Awareness Campaign 1",
            programme_date: "2023-01-15",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf", "https://example.com/attachment2.pdf"]
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            programme_name: "Awareness Campaign 2",
            programme_date: "2023-02-20"
        }
        
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        anp: anp as AwarenessPromotionData[]
    };
}

// For backward compatibility
export default fetchAwarenessPromotionData;