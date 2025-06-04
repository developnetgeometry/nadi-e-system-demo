import { supabase } from "@/integrations/supabase/client";

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
    // 1. Get filtered site IDs (as in use-site-management-pdf-data)
    let siteIds = [];
    let siteQuery = supabase.from("nd_site_profile").select(`id, sitename, nd_site:nd_site(standard_code, refid_tp), state_id:nd_state(name)`);
    if (phaseFilter) siteQuery = siteQuery.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) siteQuery = siteQuery.in("id", nadiFilter.map(Number));
    // Add TP and DUSP filter logic if needed
    const { data: siteDetails, error: siteError } = await siteQuery;
    if (siteError) throw siteError;
    if (!siteDetails || siteDetails.length === 0) return { utility: [] };
    siteIds = siteDetails.map(site => Number(site.id));

    // 2. Fetch utility records for those site IDs, join to nd_type_utilities
    let utilitiesQuery = supabase
        .from("nd_utilities")
        .select(`
            id,
            site_id,
            type_id,
            year,
            month,
            nd_type_utilities:nd_type_utilities(name)
        `)
        .in("site_id", siteIds)
        .in("type_id", [1, 2, 3]);

    // Add filtering by startDate and endDate (using year and month columns)
    if (startDate && endDate) {
        // Parse start and end
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Filter for year >= startYear and year <= endYear
        utilitiesQuery = utilitiesQuery.gte("year", start.getFullYear()).lte("year", end.getFullYear());
        // For same year, filter by month as well
        if (start.getFullYear() === end.getFullYear()) {
            utilitiesQuery = utilitiesQuery.gte("month", start.getMonth() + 1).lte("month", end.getMonth() + 1);
        }
    } else if (startDate) {
        const start = new Date(startDate);
        utilitiesQuery = utilitiesQuery.gte("year", start.getFullYear());
        utilitiesQuery = utilitiesQuery.gte("month", start.getMonth() + 1);
    } else if (endDate) {
        const end = new Date(endDate);
        utilitiesQuery = utilitiesQuery.lte("year", end.getFullYear());
        utilitiesQuery = utilitiesQuery.lte("month", end.getMonth() + 1);
    }

    const { data: utilities, error: utilitiesError } = await utilitiesQuery;
    if (utilitiesError) throw utilitiesError;

    // 3. Group by site and determine utility types (by name, not just type_id)
    // For each site, for each type, check if every month in the range has a bill
    function getMonthYearList(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = [];
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        while (current <= end) {
            months.push({ year: current.getFullYear(), month: current.getMonth() + 1 });
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }

    let monthYearList = [];
    if (startDate && endDate) {
        monthYearList = getMonthYearList(startDate, endDate);
    }

    const siteMap = new Map();
    for (const site of siteDetails) {
        const site_id = String(site.id);
        // For each type: 1=electricity, 2=water, 3=sewerage
        let hasAllElectric = true, hasAllWater = true, hasAllSewerage = true;
        for (const { year, month } of monthYearList) {
            // For each type, check if a bill exists for this site, year, month, and type
            if (!utilities.some(u => u.site_id === site.id && u.type_id === 1 && u.year === year && u.month === month)) {
                hasAllElectric = false;
            }
            if (!utilities.some(u => u.site_id === site.id && u.type_id === 2 && u.year === year && u.month === month)) {
                hasAllWater = false;
            }
            if (!utilities.some(u => u.site_id === site.id && u.type_id === 3 && u.year === year && u.month === month)) {
                hasAllSewerage = false;
            }
        }
        siteMap.set(site_id, {
            site_id,
            standard_code: site.nd_site?.[0]?.standard_code || "",
            site_name: site.sitename || "",
            refId: site.nd_site?.[0]?.refid_tp || "",
            state: site.state_id?.name || "",
            water: monthYearList.length > 0 ? hasAllWater : false,
            electricity: monthYearList.length > 0 ? hasAllElectric : false,
            sewerage: monthYearList.length > 0 ? hasAllSewerage : false
        });
    }
    const utility = Array.from(siteMap.values());
    return { utility };
}

// For backward compatibility
export default fetchUtilityData;