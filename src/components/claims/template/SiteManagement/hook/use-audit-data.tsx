import { supabase } from "@/integrations/supabase/client";

export interface AuditData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    status: boolean; // Whether site has audit or not in the date range
    attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Audit data
 * This function is used by Audit.tsx to fetch audit data directly without React hooks
 */
export const fetchAuditData = async ({
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
            nd_site:nd_site(standard_code, refid_tp),
            state_id:nd_state(name)
        `);
    
    if (phaseFilter) siteQuery = siteQuery.eq("phase_id", Number(phaseFilter));
    if (nadiFilter && nadiFilter.length > 0) siteQuery = siteQuery.in("id", nadiFilter.map(Number));

    const { data: siteDetails, error: siteError } = await siteQuery;
    if (siteError) throw siteError;
    if (!siteDetails || siteDetails.length === 0) return { audits: [] };

    // 2. Get site IDs for checking audit status
    const siteIds = siteDetails.map(site => site.id);

    // 3. Fetch audit data for these sites
    let auditQuery = supabase
        .from("nd_site_audit")
        .select(`
            site_profile_id,
            audit_date,
            file_path
        `)
        .in("site_profile_id", siteIds);

    // Apply date range filter if provided
    if (startDate && endDate) {
        auditQuery = auditQuery.gte("audit_date", startDate).lte("audit_date", endDate);
    } else if (startDate) {
        auditQuery = auditQuery.gte("audit_date", startDate);
    } else if (endDate) {
        auditQuery = auditQuery.lte("audit_date", endDate);
    }

    const { data: auditRecords, error: auditError } = await auditQuery;
    if (auditError) throw auditError;

    // 4. Create a Set for quick lookup of sites with audits in the date range
    const sitesWithAudits = new Set();
    const siteAttachments = new Map(); // To store file paths for sites with audits

    (auditRecords || []).forEach(audit => {
        if (audit.site_profile_id) {
            sitesWithAudits.add(audit.site_profile_id);
            
            // Collect file paths for sites with audits
            if (audit.file_path && audit.file_path.length > 0) {
                const existingPaths = siteAttachments.get(audit.site_profile_id) || [];
                siteAttachments.set(audit.site_profile_id, [...existingPaths, ...audit.file_path]);
            }
        }
    });

    // 5. Generate audit records - one row per site with status
    const audits = siteDetails.map(site => {
        const hasAudit = sitesWithAudits.has(site.id);
        const attachments = siteAttachments.get(site.id) || [];

        return {
            site_id: String(site.id),
            standard_code: site.nd_site?.[0]?.standard_code || "",
            site_name: site.sitename || "",
            refId: site.nd_site?.[0]?.refid_tp || "",
            state: site.state_id?.name || "",
            status: hasAudit, // True if site has audit in the date range
            attachments_path: attachments
        };
    });

    return { audits };
}

// For backward compatibility
export default fetchAuditData;

