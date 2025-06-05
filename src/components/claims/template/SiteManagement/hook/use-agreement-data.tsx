// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-agreement-data.tsx
import { supabase } from "@/integrations/supabase/client";

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
    // Fetch from nd_site_agreement_attachment, join nd_site_profile, nd_site, nd_state
    let query = supabase
        .from("nd_site_agreement_attachment")
        .select(`
            id,
            site_profile_id,
            file_path,
            nd_site_profile:site_profile_id(
                id,
                sitename,
                nd_site:nd_site(standard_code, refid_tp),
                state_id:nd_state(name)
            )
        `);
    if (phaseFilter) query = query.eq("nd_site_profile.phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) query = query.in("site_profile_id", nadiFilter.map(Number));
    // Add TP and DUSP filter logic if needed
    const { data: agreementDetails, error } = await query;
    if (error) throw error;
    if (!agreementDetails || agreementDetails.length === 0) return { agreement: [] };
    const agreement = agreementDetails.map(ag => {
        const profile = ag.nd_site_profile;
        let standard_code = "";
        let refId = "";
        if (profile?.nd_site && Array.isArray(profile.nd_site)) {
            standard_code = profile.nd_site[0]?.standard_code || "";
            refId = profile.nd_site[0]?.refid_tp || "";
        }
        return {
            site_id: String(profile?.id || ag.site_profile_id),
            standard_code,
            site_name: profile?.sitename || "",
            refId,
            state: profile?.state_id?.name || "",
            attachments_path: ag.file_path || []
        };
    });
    return { agreement };
}

// For backward compatibility
export default fetchAgreementData;