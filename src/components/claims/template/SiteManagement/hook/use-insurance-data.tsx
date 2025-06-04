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
            standard_code: "SC001",
            site_name: "Site A",
            refId: "REF001",
            state: "State A",
            duration: "2023-01-01 to 2023-12-31",
            attachments_path: ["https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf", "https://ruanewybqxrdfvrdyeqr.supabase.co/storage/v1/object/public/site-attachment/site-insurance/125/34_1747089875873.pdf"]
        },
        {
            site_id: "2",
            standard_code: "SC002",
            site_name: "Site B",
            refId: "REF002",
            state: "State B",
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