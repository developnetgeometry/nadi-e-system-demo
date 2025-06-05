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
            standard_code: "D09N005",
            site_name: "NADI Kg Karangan",
            refId: "PI1M03D",
            state: "Kelantan",
            programme_name: "NADI-KidVenture",
            programme_date: "2023-01-15",        
        },
        {
            site_id: "2",
            standard_code: "D09N006",
            site_name: "Site B",
            refId: "PI1M04D",
            state: "Kelantan",
            programme_name: "BUDI MADANI",
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