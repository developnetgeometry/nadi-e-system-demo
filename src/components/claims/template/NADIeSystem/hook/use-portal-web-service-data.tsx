import { supabase } from "@/integrations/supabase/client";

export interface PortalWebServiceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    site_url_web_portal: string;
    website_last_updated: string; // Column now exists in database
}

/**
 * Data fetching function (non-hook) for PortalWebService data
 * This function is used by Portal&WebService.tsx to fetch PortalWebService data directly without React hooks
 */
export const fetchPortalWebServiceData = async ({
    startDate = null,
    endDate = null,
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
}) => {
    console.log("Fetching PortalWebService data with filters:", { 
        startDate, 
        endDate, 
        duspFilter, 
        phaseFilter, 
        nadiFilter, 
        tpFilter 
    });
    
    // Fetch site details from nd_site_profile
    let siteQuery = supabase
        .from("nd_site_profile")
        .select(`
            id,
            sitename,
            website,
            website_last_updated,
            nd_site:nd_site(standard_code, refid_tp, refid_mcmc),
            state_id:nd_state(name)
        `);

    // Apply filters
    if (phaseFilter) siteQuery = siteQuery.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) siteQuery = siteQuery.in("id", nadiFilter.map(Number));

    const { data: siteDetails, error: siteError } = await siteQuery;
    if (siteError) throw siteError;
    if (!siteDetails || siteDetails.length === 0) return { portalWebService: [] };

    console.log("Fetched site details with website_last_updated:", siteDetails.map(site => ({
        id: site.id,
        sitename: site.sitename,
        website: site.website,
        website_last_updated: site.website_last_updated
    })));

    // Transform the data to match the interface
    const portalWebService: PortalWebServiceData[] = siteDetails.map(site => ({
        site_id: String(site.id),
        standard_code: site.nd_site?.[0]?.refid_mcmc || "",
        site_name: site.sitename || "",
        refId: site.nd_site?.[0]?.refid_tp || "",
        state: site.state_id?.name || "",
        site_url_web_portal: site.website || "", // Use the actual website column from database
        website_last_updated: site.website_last_updated || "", // Now fetches from database column
    }));
    
    // Return the data in the same format as the hook
    return { 
        portalWebService: portalWebService
    };
}

// For backward compatibility
export default fetchPortalWebServiceData;

