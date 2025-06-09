// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-insurance-data.tsx
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
    // 1. Get site_ids (as numbers) from nadiFilter if provided
    let siteIds = Array.isArray(nadiFilter) ? nadiFilter.map(Number).filter(Boolean) : [];

    // 2. Fetch site remarks (insurance records)
    let query = supabase
        .from("nd_site_remark")
        .select("id, site_id, type_id, description, nd_insurance_report(insurance_type_id, start_date, end_date)");
    if (siteIds.length > 0) {
        query = query.in("site_id", siteIds);
    }
    // (Revert) Remove date range filtering on start_date here
    const { data: remarks, error: remarksError } = await query;
    if (remarksError) throw remarksError;

    // 3. Fetch site profile info for all involved site_ids
    const uniqueSiteIds = [...new Set(remarks.map(r => r.site_id))];
    let sitesWithDetails = [];
    if (uniqueSiteIds.length > 0) {
        // Fetch from nd_site_profile with joins to nd_site and nd_state (like use-site-management-pdf-data)
        const { data: details, error: detailsError } = await supabase
            .from("nd_site_profile")
            .select(`
                id,
                sitename,
                nd_site:nd_site(standard_code, refid_tp),
                state_id:nd_state(name)
            `)
            .in("id", uniqueSiteIds);
        if (detailsError) throw detailsError;
        sitesWithDetails = details;
    }

    // 4. Map to insuranceData interface
    const insurance = remarks.map((item) => {
        const site = sitesWithDetails.find((s) => s.id === item.site_id);
        let duration = "";
        if (item.nd_insurance_report && item.nd_insurance_report.length > 0) {
            const report = item.nd_insurance_report[0];
            if (report.start_date && report.end_date) {
                const start = new Date(report.start_date);
                const end = new Date(report.end_date);
                let years = end.getFullYear() - start.getFullYear();
                let months = end.getMonth() - start.getMonth();
                let days = end.getDate() - start.getDate();
                if (days < 0) {
                    months--;
                    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
                }
                if (months < 0) {
                    years--;
                    months += 12;
                }
                if (years > 0 && months === 0 && days === 0) {
                    duration = years === 1 ? "1 YEAR" : `${years} YEARS`;
                } else if (years > 0) {
                    duration = `${years} YEARS ${months} MONTHS`;
                } else if (months > 0 && days === 0) {
                    duration = months === 1 ? "1 MONTH" : `${months} MONTHS`;
                } else if (months > 0) {
                    duration = `${months} MONTHS ${days} DAYS`;
                } else {
                    duration = days === 1 ? "1 DAY" : `${days} DAYS`;
                }
            }
        }
        return {
            site_id: String(item.site_id),
            standard_code: site?.nd_site?.[0]?.standard_code || "",
            site_name: site?.sitename || "",
            refId: site?.nd_site?.[0]?.refid_tp || "",
            state: site?.state_id?.name || "",
            duration,
            attachments_path: [], // Add logic if you want to fetch attachments
        };
    }).filter(item => item.duration); // Only include sites with insurance in the range

    return { insurance };
};

// React Query hook
export const useInsuranceData = (filters) => {
    return useQuery({
        queryKey: ["insuranceData", filters],
        queryFn: () => fetchInsuranceData(filters),
    });
};

// For backward compatibility
export default fetchInsuranceData;