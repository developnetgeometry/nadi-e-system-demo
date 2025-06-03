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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            participant_fullname: "John Doe",
            participant_position: "Manager",
            programme_name: "Refresh Programme A",
            programme_method: "Online Training",
            programme_venue: "Physical",
            training_date: "2023-10-01"
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
            participant_fullname: "Jane Smith",
            participant_position: "Assistant Manager",
            programme_name: "Refresh Programme B",
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

