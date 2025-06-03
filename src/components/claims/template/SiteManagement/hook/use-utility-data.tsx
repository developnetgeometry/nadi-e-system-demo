export interface utilityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    water: boolean; //site has water bill
    electricity: boolean; //site has electricity bill
    sewerage: boolean; // site has sewerage bill
}


/**
 * Data fetching function (non-hook) for utility data
 * This function is used by utility.tsx to fetch utility data directly without React hooks
 */


export const fetchUtilityData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching utility data with filters:", {
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    // Mock data (replace with actual API call in production)
    const utility = [
        {
            site_id: "1",
            standard_code: "K00N002",
            site_name: "NADI Pekan Kampung Lalang",
            refId: "K01C002",
            state: "Kedah",
            water: true,
            electricity: true,
            sewerage: false
        },
        {
            site_id: "2",
            standard_code: "J11N008",
            site_name: "NADI Bandar Petri Jaya",
            refId: "J09C003",
            state: "Johor",
            water: false,
            electricity: true,
            sewerage: true
        }


    ];

    // Return the data in the same format as the hook
    return {
        utility: utility as utilityData[]
    };
}

// For backward compatibility
export default fetchUtilityData;