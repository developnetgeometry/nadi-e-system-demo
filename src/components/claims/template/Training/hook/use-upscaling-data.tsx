export interface UpscalingData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    participant_fullname: string;
    participant_position: string;
    programme_name: string;
    programme_method: string;
    programme_venue: string;
    training_date: string;
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Upscaling data
 * This function is used by Upscaling.tsx to fetch Upscaling data directly without React hooks
 */
export const fetchUpscalingData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching Upscaling data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const upscaling = [
        {
            site_id: "1",
            standard_code: "B12N001",
            site_name: "NADI Kampung Tebuk Haji Yusuf",
            refId: "B10C001",
            state: "Selangor",
            participant_fullname: "Kamal Abdillah",
            participant_position: "Manager",
            programme_name: "Manfaat MADANI",
            programme_method: "Online",
            programme_venue: "Physical",
            training_date: "2023-10-01"
        },
        {
            site_id: "2",
            standard_code: "J05N001",
            site_name: "NADI Felda Bukit Aping Barat",
            refId: "J05C001",
            state: "Johor",
            participant_fullname: "Maisarah Fadhilah",
            participant_position: "Assistant Manager",
            programme_name: "AI untuk Rakyat",
            programme_method: "Physical",
            programme_venue: "Community Center",
            training_date: "2023-10-05"
        }

        
    ];
    
    // Return the data in the same format as the hook
    return { 
        upscaling: upscaling as UpscalingData[]
    };
}

// For backward compatibility
export default fetchUpscalingData;

