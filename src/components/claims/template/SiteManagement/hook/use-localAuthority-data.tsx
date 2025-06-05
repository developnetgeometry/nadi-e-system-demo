import { supabase } from "@/integrations/supabase/client";

export interface localAuthorityData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
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
    // Fetch from nd_site_profile where local_authority is TRUE
    let query = supabase
        .from("nd_site_profile")
        .select(`
            id,
            sitename,
            local_authority,
            nd_site:nd_site(standard_code, refid_tp),
            state_id:nd_state(name)
        `)
        .eq("local_authority", true);
    if (phaseFilter) query = query.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) query = query.in("id", nadiFilter.map(Number));
    // Add TP and DUSP filter logic if needed
    const { data: siteDetails, error } = await query;
    if (error) throw error;
    if (!siteDetails || siteDetails.length === 0) return { localAuthority: [] };
    const localAuthority = siteDetails.map(site => ({
        site_id: String(site.id),
        standard_code: site.nd_site?.[0]?.standard_code || "",
        site_name: site.sitename || "",
        refId: site.nd_site?.[0]?.refid_tp || "",
        state: site.state_id?.name || ""
    }));
    return { localAuthority };
}

// For backward compatibility
export default fetchlocalAuthorityData;

