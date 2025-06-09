export interface ManageInternetServiceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    technology: string; // e.g., "Fiber", "DSL", etc.
    bandwidth: string; // e.g., "100 Mbps", "1 Gbps", etc.
    // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for ManageInternetService data
 * This function is used by ManageInternetService.tsx to fetch ManageInternetService data directly without React hooks
 */
export const fetchManageInternetServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching ManageInternetService data with filters:", {
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    // Mock data (replace with actual API call in production)
    const manage = [
        {
            site_id: "1",
            standard_code: "M01N003",
            site_name: "NADI Taman Murai Jaya",
            refId: "M02C003",
            state: "Melaka",
            technology: "FIBER (UNIFI)",
            bandwidth: "300Mbps"
        },
        {
            site_id: "2",
            standard_code: "M01N004",
            site_name: "NADI Kampung Pegoh",
            refId: "M02C004",
            state: "Melaka",
            technology: "MICROWAVE (DANAWA)",
            bandwidth: "100Mbps"
        },
        {
            site_id: "3",
            standard_code: "Q11N011",
            site_name: "NADI Bengoh",
            refId: "PK017Q",
            state: "Sarawak",
            technology: "STARLINK",
            bandwidth: "100Mbps"
        },
    ];

    // Return the data in the same format as the hook
    return {
        manage: manage as ManageInternetServiceData[]
    };
}

// For backward compatibility
export default fetchManageInternetServiceData;

