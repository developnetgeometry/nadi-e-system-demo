export interface RefreshData {
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
 * Data fetching function (non-hook) for Refresh data
 * This function is used by Refresh.tsx to fetch Refresh data directly without React hooks
 */
export const fetchRefreshData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching Refresh data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const refresh = [
        {
            site_id: "1",
            standard_code: "B05N002",
            site_name: "NADI Kampung Parit Baru Baruh",
            refId: "B05C003",
            state: "Selangor",
            participant_fullname: "Khalisya Natasha",
            participant_position: "Manager",
            programme_name: "Hari Bersama Komuniti (HBK)",
            programme_method: "Online Training",
            programme_venue: "Physical",
            training_date: "2023-10-01"
        },
        {
            site_id: "2",
            standard_code: "N08N001",
            site_name: "NADI Felda Lui Selatan",
            refId: "N06C001",
            state: "Negeri Sembilan",
            participant_fullname: "Akram Dinzly",
            participant_position: "Assistant Manager",
            programme_name: "Soft Skills",
            programme_method: "Online Training",
            programme_venue: "Physical",
            training_date: "2023-10-02"
        }

        
    ];
    
    // Return the data in the same format as the hook
    return { 
        refresh: refresh as RefreshData[]
    };
}

// For backward compatibility
export default fetchRefreshData;

