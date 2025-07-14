// filepath: c:\Users\NetGeo\Documents\Report\nadi-e-system\src\components\claims\template\SiteManagement\hook\use-insurance-data.tsx
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface insuranceData {
    site_id: string;
    standard_code: string;
    site_name: string;
    refId: string;
    state: string;
    status: boolean; // Whether site has insurance or not
    start_date: string | null;
    end_date: string | null;
    insurance_type: string | null; // Insurance type name
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
    if (!siteDetails || siteDetails.length === 0) return { insurance: [] };

    // 2. Get site IDs for checking insurance status
    const siteIds = siteDetails.map(site => site.id);

    // 3. Fetch insurance data for these sites
    let insuranceQuery = supabase
        .from("nd_site_remark")
        .select(`
            site_id,
            nd_insurance_report(
                insurance_type_id, 
                start_date, 
                end_date,
                nd_insurance_coverage_type!inner(name)
            )
        `)
        .in("site_id", siteIds);

    // Note: Date filtering on nested relations is complex in Supabase
    // We'll fetch all records and filter in JavaScript instead
    
    const { data: insuranceRecords, error: insuranceError } = await insuranceQuery;
    if (insuranceError) throw insuranceError;

    // Apply date range filters in JavaScript after fetching
    let filteredInsuranceRecords = insuranceRecords || [];
    
    if (startDate || endDate) {
        filteredInsuranceRecords = (insuranceRecords || []).map(record => {
            if (record.nd_insurance_report && record.nd_insurance_report.length > 0) {
                const filteredReports = record.nd_insurance_report.filter(report => {
                    if (!report.start_date || !report.end_date) return false;
                    
                    const reportStart = new Date(report.start_date);
                    const reportEnd = new Date(report.end_date);
                    
                    // Check if insurance period overlaps with requested date range
                    if (startDate && endDate) {
                        const reqStart = new Date(startDate);
                        const reqEnd = new Date(endDate);
                        return reportStart <= reqEnd && reportEnd >= reqStart;
                    } else if (startDate) {
                        const reqStart = new Date(startDate);
                        return reportEnd >= reqStart;
                    } else if (endDate) {
                        const reqEnd = new Date(endDate);
                        return reportStart <= reqEnd;
                    }
                    return true;
                });
                
                return {
                    ...record,
                    nd_insurance_report: filteredReports
                };
            }
            return record;
        }).filter(record => record.nd_insurance_report && record.nd_insurance_report.length > 0);
    }

    // 4. Create an array to store individual insurance records per site per type
    const insuranceRecordsFlat = [];
    
    (filteredInsuranceRecords || []).forEach(record => {
        if (record.nd_insurance_report && record.nd_insurance_report.length > 0) {
            const siteId = record.site_id;
            
            record.nd_insurance_report.forEach(insuranceReport => {
                if (!insuranceReport.start_date || !insuranceReport.end_date) return;
                
                const insuranceType = insuranceReport.nd_insurance_coverage_type?.name || "Unknown";
                
                // Check if we already have this combination of site + insurance type
                const existingIndex = insuranceRecordsFlat.findIndex(
                    item => item.site_id === siteId && item.insurance_type === insuranceType
                );
                
                if (existingIndex === -1) {
                    // New site + insurance type combination
                    insuranceRecordsFlat.push({
                        site_id: siteId,
                        start_date: insuranceReport.start_date,
                        end_date: insuranceReport.end_date,
                        insurance_type: insuranceType
                    });
                } else {
                    // Consolidate dates for the same site + insurance type
                    const existing = insuranceRecordsFlat[existingIndex];
                    const earliestStart = new Date(existing.start_date) < new Date(insuranceReport.start_date) 
                        ? existing.start_date 
                        : insuranceReport.start_date;
                        
                    const latestEnd = new Date(existing.end_date) > new Date(insuranceReport.end_date) 
                        ? existing.end_date 
                        : insuranceReport.end_date;
                    
                    insuranceRecordsFlat[existingIndex] = {
                        ...existing,
                        start_date: earliestStart,
                        end_date: latestEnd
                    };
                }
            });
        }
    });

    // 5. Create a Map for quick lookup of sites with insurance
    const sitesWithInsurance = new Set(insuranceRecordsFlat.map(record => record.site_id));

    // 6. Generate insurance records - one row per site per insurance type
    const insurance = [];
    
    // First, add all insurance records (sites with insurance)
    insuranceRecordsFlat.forEach(insuranceRecord => {
        const site = siteDetails.find(s => s.id === insuranceRecord.site_id);
        if (!site) return;
        
        insurance.push({
            site_id: String(site.id),
            standard_code: site.nd_site?.[0]?.standard_code || "",
            site_name: site.sitename || "",
            refId: site.nd_site?.[0]?.refid_tp || "",
            state: site.state_id?.name || "",
            status: true, // Has insurance
            start_date: insuranceRecord.start_date,
            end_date: insuranceRecord.end_date,
            insurance_type: insuranceRecord.insurance_type,
            attachments_path: []
        });
    });
    
    // Then, add sites without insurance (one row per site)
    siteDetails.forEach(site => {
        if (!sitesWithInsurance.has(site.id)) {
            insurance.push({
                site_id: String(site.id),
                standard_code: site.nd_site?.[0]?.standard_code || "",
                site_name: site.sitename || "",
                refId: site.nd_site?.[0]?.refid_tp || "",
                state: site.state_id?.name || "",
                status: false, // No insurance
                start_date: null,
                end_date: null,
                insurance_type: null,
                attachments_path: []
            });
        }
    });

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