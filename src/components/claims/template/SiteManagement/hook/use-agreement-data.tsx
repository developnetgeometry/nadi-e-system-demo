// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-agreement-data.tsx
import { supabase } from "@/integrations/supabase/client";

export interface agreementData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    status: boolean; // Whether site has agreement or not in the date range
    start_date: string | null;
    end_date: string | null;
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
    // 1. Fetch all site details from nd_site_profile
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
    if (!siteDetails || siteDetails.length === 0) return { agreement: [] };

    // 2. Get site IDs for checking agreement status
    const siteIds = siteDetails.map(site => site.id);

    // 3. Fetch agreement data for these sites
    let agreementQuery = supabase
        .from("nd_site_agreement")
        .select(`
            site_profile_id,
            start_date,
            end_date,
            file_path
        `)
        .in("site_profile_id", siteIds);

    // Apply date range filters if provided
    if (startDate && endDate) {
        agreementQuery = agreementQuery
            .or(`start_date.lte.${endDate},start_date.is.null`)
            .or(`end_date.gte.${startDate},end_date.is.null`);
    } else if (startDate) {
        agreementQuery = agreementQuery
            .or(`end_date.gte.${startDate},end_date.is.null`);
    } else if (endDate) {
        agreementQuery = agreementQuery
            .or(`start_date.lte.${endDate},start_date.is.null`);
    }

    const { data: agreementRecords, error: agreementError } = await agreementQuery;
    if (agreementError) throw agreementError;

    // 4. Consolidate overlapping agreement records per site (earliest start, latest end)
    const consolidatedAgreements = new Map();

    (agreementRecords || []).forEach(agreement => {
        if (agreement.site_profile_id && agreement.start_date && agreement.end_date) {
            const siteId = agreement.site_profile_id;
            
            if (!consolidatedAgreements.has(siteId)) {
                // First agreement for this site
                consolidatedAgreements.set(siteId, {
                    site_profile_id: siteId,
                    start_date: agreement.start_date,
                    end_date: agreement.end_date,
                    file_paths: agreement.file_path || []
                });
            } else {
                // Consolidate with existing agreement for this site
                const existing = consolidatedAgreements.get(siteId);
                const earliestStart = new Date(existing.start_date) < new Date(agreement.start_date) 
                    ? existing.start_date 
                    : agreement.start_date;
                    
                const latestEnd = new Date(existing.end_date) > new Date(agreement.end_date) 
                    ? existing.end_date 
                    : agreement.end_date;
                
                consolidatedAgreements.set(siteId, {
                    ...existing,
                    start_date: earliestStart,
                    end_date: latestEnd,
                    file_paths: [...existing.file_paths, ...(agreement.file_path || [])]
                });
            }
        }
    });

    // 5. Create a Set for quick lookup of sites with agreements
    const sitesWithAgreements = new Set(consolidatedAgreements.keys());

    // 6. Generate agreement records - one row per site with status
    const agreement = siteDetails.map(site => {
        const hasAgreement = sitesWithAgreements.has(site.id);
        const consolidatedData = consolidatedAgreements.get(site.id);

        return {
            site_id: String(site.id),
            standard_code: site.nd_site?.[0]?.refid_mcmc || "",
            site_name: site.sitename || "",
            refId: site.nd_site?.[0]?.refid_tp || "",
            state: site.state_id?.name || "",
            status: hasAgreement, // True if site has agreement in the date range
            start_date: consolidatedData?.start_date || null,
            end_date: consolidatedData?.end_date || null,
            attachments_path: consolidatedData?.file_paths || []
        };
    });

    return { agreement: agreement as agreementData[] };
}

// For backward compatibility
export default fetchAgreementData;