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
            standard_code: "J03N021",
            site_name: "NADI Felda Palong Timur 1",
            refId: "CELCOM-024",
            state: "Johor",
        },
        {
            site_id: "2",
            standard_code: "J03N022",
            site_name: "NADI Felda Kahang Timur",
            refId: "CELCOM-025",
            state: "Johor"
        }

    ];

    // Return the data in the same format as the hook
    return {
        agreement: agreement as agreementData[]
    };
}

// For backward compatibility
export default fetchAgreementData;