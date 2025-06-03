// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-insurance-data.tsx
export interface insuranceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    duration: string; // Duration of the insurance policy
    attachments_path?: string[]; // Optional attachment field
}


/**
 * Data fetching function (non-hook) for insurance data
 * This function is used by insurance.tsx to fetch insurance data directly without React hooks
 */


export const fetchInsuranceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching insurance data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Mock data (replace with actual API call in production)
    const insurance = [
        {
            site_id: "1",
            standard_code: "B13N002",
            site_name: "NADI Kota Raja",
            refId: "B11C002",
            state: "Selangor",
            duration: "2023-01-01 to 2023-12-31",
        },
        {
            site_id: "2",
            standard_code: "S06N017",
            site_name: "NADI Kg. Kuala",
            refId: "CELCOM-060",
            state: "Sabah",
            duration: "2023-01-01 to 2023-12-31"
        }
        
    ];
    
    // Return the data in the same format as the hook
    return { 
        insurance: insurance as insuranceData[]
    };
}

// For backward compatibility
export default fetchInsuranceData;