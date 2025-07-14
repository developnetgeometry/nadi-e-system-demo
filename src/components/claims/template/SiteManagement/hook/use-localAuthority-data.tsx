import { supabase } from "@/integrations/supabase/client";

export interface localAuthorityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    status: boolean;
    start_date: string | null;
    end_date: string | null;
}


/**
 * Data fetching function (non-hook) for local authority data
 * This function is used by localAuthority.tsx to fetch local authority data directly without React hooks
 */


export const fetchlocalAuthorityData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    // Fetch all site details from nd_site_profile
    let query = supabase
        .from("nd_site_profile")
        .select(`
            id,
            sitename,
            nd_site:nd_site(standard_code, refid_tp),
            state_id:nd_state(name)
        `);
    
    if (phaseFilter) query = query.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) query = query.in("id", nadiFilter.map(Number));

    const { data: siteDetails, error } = await query;

    if (error) throw error;
    if (!siteDetails || siteDetails.length === 0) return { localAuthority: [] };

    // Get site IDs for checking local authority status
    const siteIds = siteDetails.map(site => site.id);

    // Check local authority status for each site within the date range
    let localAuthorityQuery = supabase
        .from("nd_site_local_authority")
        .select("site_profile_id, start_date, end_date")
        .in("site_profile_id", siteIds);

    // Apply date range filters if provided
    if (startDate && endDate) {
        localAuthorityQuery = localAuthorityQuery
            .or(`start_date.lte.${endDate},start_date.is.null`)
            .or(`end_date.gte.${startDate},end_date.is.null`);
    } else if (startDate) {
        localAuthorityQuery = localAuthorityQuery
            .or(`end_date.gte.${startDate},end_date.is.null`);
    } else if (endDate) {
        localAuthorityQuery = localAuthorityQuery
            .or(`start_date.lte.${endDate},start_date.is.null`);
    }

    const { data: localAuthorityRecords, error: laError } = await localAuthorityQuery;

    if (laError) throw laError;

    // Create a Map of site IDs to their consolidated local authority details
    const sitesWithLocalAuthority = new Map();
    
    (localAuthorityRecords || []).forEach(record => {
        const siteId = record.site_profile_id;
        const existingRecord = sitesWithLocalAuthority.get(siteId);
        
        if (!existingRecord) {
            // First record for this site
            sitesWithLocalAuthority.set(siteId, {
                start_date: record.start_date,
                end_date: record.end_date
            });
        } else {
            // Consolidate with existing record
            const earliestStart = !existingRecord.start_date || !record.start_date 
                ? null // If either is null, treat as "always active" (no start date)
                : new Date(existingRecord.start_date) < new Date(record.start_date) 
                    ? existingRecord.start_date 
                    : record.start_date;
                    
            const latestEnd = !existingRecord.end_date || !record.end_date 
                ? null // If either is null, treat as "still active" (no end date)
                : new Date(existingRecord.end_date) > new Date(record.end_date) 
                    ? existingRecord.end_date 
                    : record.end_date;
            
            sitesWithLocalAuthority.set(siteId, {
                start_date: earliestStart,
                end_date: latestEnd
            });
        }
    });

    const localAuthority = siteDetails.map(site => {
        const laDetails = sitesWithLocalAuthority.get(site.id);
        return {
            site_id: String(site.id),
            standard_code: site.nd_site?.[0]?.standard_code || "",
            site_name: site.sitename || "",
            refId: site.nd_site?.[0]?.refid_tp || "",
            state: site.state_id?.name || "",
            status: !!laDetails, // true if local authority record exists
            start_date: laDetails?.start_date || null,
            end_date: laDetails?.end_date || null
        };
    });
    
    return { localAuthority };
}

// For backward compatibility
export default fetchlocalAuthorityData;

