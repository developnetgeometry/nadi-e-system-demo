import { supabase } from "@/integrations/supabase/client";

export interface utilityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    water: number | null; // Bill amount for water
    electricity: number | null; // Bill amount for electricity
    sewerage: number | null; // Bill amount for sewerage
    bill_month: number;
    bill_year: number;
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
    // 1. Get filtered site IDs 
    let siteQuery = supabase
        .from("nd_site_profile")
        .select(`
            id, 
            sitename,
            nd_site:nd_site(standard_code, refid_tp, refid_mcmc), 
            state_id:nd_state(name)
        `);
    
    if (phaseFilter) siteQuery = siteQuery.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) siteQuery = siteQuery.in("id", nadiFilter.map(Number));

    const { data: siteDetails, error: siteError } = await siteQuery;
    if (siteError) throw siteError;
    if (!siteDetails || siteDetails.length === 0) return { utility: [] };

    const siteIds = siteDetails.map(site => Number(site.id));

    // 2. Fetch utility records for those site IDs
    let utilitiesQuery = supabase
        .from("nd_utilities")
        .select(`
            site_id,
            type_id,
            year,
            month,
            amount_bill
        `)
        .in("site_id", siteIds)
        .in("type_id", [1, 2, 3]); // 1=electricity, 2=water, 3=sewerage

    // Add filtering by startDate and endDate (using year and month columns)
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        const startMonth = start.getMonth() + 1;
        const endMonth = end.getMonth() + 1;

        // Filter by year range
        utilitiesQuery = utilitiesQuery.gte("year", startYear).lte("year", endYear);
        
        // For more precise month filtering when years are the same
        if (startYear === endYear) {
            utilitiesQuery = utilitiesQuery.gte("month", startMonth).lte("month", endMonth);
        }
    } else if (startDate) {
        const start = new Date(startDate);
        utilitiesQuery = utilitiesQuery.gte("year", start.getFullYear());
        // For same year, also filter by month
        utilitiesQuery = utilitiesQuery.gte("month", start.getMonth() + 1);
    } else if (endDate) {
        const end = new Date(endDate);
        utilitiesQuery = utilitiesQuery.lte("year", end.getFullYear());
        // For same year, also filter by month
        utilitiesQuery = utilitiesQuery.lte("month", end.getMonth() + 1);
    }

    const { data: utilities, error: utilitiesError } = await utilitiesQuery;
    if (utilitiesError) throw utilitiesError;

    // 3. Generate month/year combinations within the date range
    function getMonthYearList(startDate, endDate) {
        if (!startDate || !endDate) return [];
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = [];
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        
        while (current <= end) {
            months.push({ 
                year: current.getFullYear(), 
                month: current.getMonth() + 1 
            });
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }

    const monthYearList = getMonthYearList(startDate, endDate);
    
    // If no date range specified, get all unique year/month combinations from utilities
    const targetPeriods = monthYearList.length > 0 
        ? monthYearList 
        : [...new Set(utilities.map(u => `${u.year}-${u.month}`))].map(period => {
            const [year, month] = period.split('-');
            return { year: parseInt(year), month: parseInt(month) };
        });

    // 4. Create utility records - one row per site per month/year combination
    const utility = [];

    for (const site of siteDetails) {
        for (const { year, month } of targetPeriods) {
            // Find utility bills for this site in this month/year
            const siteUtilities = utilities.filter(u => 
                u.site_id === site.id && 
                u.year === year && 
                u.month === month
            );

            // Get amounts for each utility type
            const waterBill = siteUtilities.find(u => u.type_id === 2); // Water
            const electricityBill = siteUtilities.find(u => u.type_id === 1); // Electricity  
            const sewerageBill = siteUtilities.find(u => u.type_id === 3); // Sewerage

            utility.push({
                site_id: String(site.id),
                standard_code: site.nd_site?.[0]?.refid_mcmc || "",
                site_name: site.sitename || "",
                refId: site.nd_site?.[0]?.refid_tp || "",
                state: site.state_id?.name || "",
                water: waterBill?.amount_bill || null,
                electricity: electricityBill?.amount_bill || null,
                sewerage: sewerageBill?.amount_bill || null,
                bill_month: month,
                bill_year: year
            });
        }
    }

    return { utility };
}

// For backward compatibility
export default fetchUtilityData;