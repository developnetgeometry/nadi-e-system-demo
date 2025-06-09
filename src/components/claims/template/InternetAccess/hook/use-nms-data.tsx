export interface NMSData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for NMS data
 * This function is used by NMS.tsx to fetch NMS data directly without React hooks
 */
export const fetchNMSData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching NMS data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const nms = [
        {
            site_id: "1",
            standard_code: "J05N006",
            site_name: "NADI Felda Nitar 2",
            refId: "DG_PI1M_017",
            state: "Johor",
            attachments_path: [
                "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"
            ]
        },
        {
            site_id: "2",
            standard_code: "B09N002",
            site_name: "NADI Felda Gedangsa",
            refId: "DG_PI1M_036",
            state: "Selangor",
            attachments_path: [
                "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-agreement/119/site%20attachment.png"
            ]
        }
    ];
    
    // Return the data in the same format as the hook
    return { 
        nms: nms as NMSData[]
    };
}

// For backward compatibility
export default fetchNMSData;

