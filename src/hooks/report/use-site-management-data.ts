import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteData {
  id: string;
  sitename: string;
  standard_code?: string;
  fullname?: string;
  is_active: boolean;
  phase_id?: string;
  phase_name?: string;
  dusp_id?: string | null;  // Can be null for unassigned sites
  dusp_name?: string;
  hasDusp: boolean;         // Flag to track if site has DUSP assigned
  _debug?: {
    hasDusp: boolean;
    dusp_tp_id?: string | null;
    parent_id?: string;
  };
}

export interface UtilityData {
  id: string;
  site_id: string;
  sitename?: string;
  year: number;
  month: number;
  type_id: number;
  type_name: string;
  reference_no?: string;
  amount_bill: number;
  remark?: string;
  file_path?: string;
  payment_date?: string;
}

export interface SiteInsuranceData {
  id: number;
  site_id: string;
  sitename?: string;
  insurance_type_id: number;
  insurance_type_name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

export interface SiteAuditData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface SiteAgreementData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface LocalAuthorityData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface AwarenessPromotionData {
  id: string;
  site_id: string;
  sitename?: string;
  programme_name?: string;
  date?: string;
  status?: string;
}

export const useSiteManagementData = (
  duspFilter: (string | number)[],
  phaseFilter: string | number | null,
  nadiFilter: (string | number)[],
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter: (string | number)[] = []
) => {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [utilities, setUtilities] = useState<UtilityData[]>([]);
  const [insurance, setInsurance] = useState<SiteInsuranceData[]>([]);
  const [audits, setAudits] = useState<SiteAuditData[]>([]);
  const [agreements, setAgreements] = useState<SiteAgreementData[]>([]);
  const [localAuthority, setLocalAuthority] = useState<LocalAuthorityData[]>([]);
  const [awarenessPromotion, setAwarenessPromotion] = useState<AwarenessPromotionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        console.log('Starting site data fetch with filters:', { duspFilter, phaseFilter, nadiFilter });

        // Base query to fetch sites
        let query = supabase
          .from("nd_site_profile")
          .select(`
            id, 
            sitename,
            fullname,
            is_active,
            phase_id,
            dusp_tp_id,
            nd_phases!phase_id (id, name), 
            dusp_tp:organizations!dusp_tp_id (id, name, parent:parent_id(id, name)),
            nd_site (id, standard_code)
          `);

        // We'll get the DUSP filter data through a join
        if (duspFilter && duspFilter.length > 0) {
          // Log the filter for debugging
          console.log('Applying DUSP filter via post-query filtering:', duspFilter);
        }

        // Apply phase filter if present
        if (phaseFilter !== null) {
          query = query.eq("phase_id", Number(phaseFilter));
        }

        // Apply NADI filter (site filter) if present
        if (nadiFilter && nadiFilter.length > 0) {
          const numericIds = nadiFilter.map(id => Number(id));
          query = query.in("id", numericIds);
        }

        console.log('Query with filters:', { duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter, tpFilter });
        const { data, error } = await query;

        if (error) {
          console.error('Error in site query:', error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} sites before post-filtering`);        // Apply DUSP filter here if needed
        let filteredData = data;
        if (duspFilter && duspFilter.length > 0) {
          // Count sites with and without DUSP for debugging
          const sitesWithDusp = data.filter(site => Boolean(site.dusp_tp_id)).length;
          const sitesWithoutDusp = data.length - sitesWithDusp;
          console.log(`Sites with DUSP: ${sitesWithDusp}, Sites without DUSP: ${sitesWithoutDusp}`);
          
        // Apply TP filter if present (telecommunications provider filter)
        if (tpFilter && tpFilter.length > 0) {
          console.log('Applying TP filter:', tpFilter);
          filteredData = filteredData.filter(site => {
            // Skip sites with no TP (dusp_tp) data
            if (!site.dusp_tp_id || !site.dusp_tp) {
              return false;
            }
            
            // Normalize dusp_tp data which can be an array or object
            const tpData = Array.isArray(site.dusp_tp) ? site.dusp_tp[0] : site.dusp_tp;
            
            // Check if the TP ID matches any of the selected TP filters
            return tpFilter.some(filter => String(tpData.id) === String(filter));
          });
          console.log(`After TP filter: ${filteredData.length} sites remain`);
        }
          // Simple DUSP filter application
          filteredData = data.filter(site => {
            // Skip sites with no DUSP data
            if (!site.dusp_tp_id || !site.dusp_tp) {
              return false;
            }

            // Normalize dusp_tp data which can be an array or object
            const duspData = Array.isArray(site.dusp_tp) ? site.dusp_tp[0] : site.dusp_tp;

            // Skip if no valid dusp data
            if (!duspData) {
              return false;
            }

            // Normalize parent data which can also be an array or object
            const parentData = duspData.parent
              ? (Array.isArray(duspData.parent) ? duspData.parent[0] : duspData.parent)
              : null;

            // Get the parent ID for comparison
            const parentId = parentData?.id;

            // Check if the parentId matches any of the selected DUSP filters
            return duspFilter.some(filter => String(parentId) === String(filter));
          });
        }

        console.log(`After DUSP filter: ${filteredData.length} sites remain out of ${data.length}`);

        // Log some info about the data structure
        if (filteredData.length > 0) {
          console.log('Sample site data structure:', {
            sampleSite: filteredData[0],
            hasDuspTpId: Boolean(filteredData[0].dusp_tp_id),
            duspTpType: typeof filteredData[0].dusp_tp,
            duspTp: filteredData[0].dusp_tp,
          });
        }

        // Transform data for easier use, with improved relationship handling
        const transformedSites = filteredData.map(site => {
          // First check if the site has a dusp_tp_id assigned
          const hasDuspAssigned = Boolean(site.dusp_tp_id);

          // Handle array or object responses correctly with more detailed error checking
          const phaseData = site.nd_phases ? (Array.isArray(site.nd_phases) ? site.nd_phases[0] : site.nd_phases) : null;

          // Only process DUSP data if the site has it assigned
          const duspData = hasDuspAssigned && site.dusp_tp ? (Array.isArray(site.dusp_tp) ? site.dusp_tp[0] : site.dusp_tp) : null;
          const parentData = duspData?.parent ? (Array.isArray(duspData.parent) ? duspData.parent[0] : duspData.parent) : null;

          // Check for dusp_tp_id directly from the site record if relationship data is missing
          const dusp_tp_id = hasDuspAssigned ? (site.dusp_tp_id || (duspData?.id ? String(duspData.id) : "")) : null;

          // Construct the complete parent-child hierarchy info
          const dusp_id = hasDuspAssigned ? (parentData?.id ? String(parentData.id) : dusp_tp_id) : null;
          const dusp_name = duspData?.name || "";
          const parent_dusp_name = parentData?.name || "";
          // Format the display name based on available data
          let formattedDuspName;
          if (parent_dusp_name) {
            formattedDuspName = `${dusp_name} (${parent_dusp_name})`;
          } else {
            formattedDuspName = dusp_name;
          }

          return {
            id: String(site.id),
            sitename: site.sitename,
            fullname: site.fullname || "",
            standard_code: site.nd_site?.[0]?.standard_code || "",
            is_active: site.is_active,
            phase_id: site.phase_id ? String(site.phase_id) : (phaseData?.id ? String(phaseData.id) : ""),
            phase_name: phaseData?.name || "",
            dusp_id: dusp_id,
            dusp_name: formattedDuspName,
            hasDusp: hasDuspAssigned,
            // Store original IDs for debugging
            _debug: {
              hasDusp: hasDuspAssigned,
              dusp_tp_id: dusp_tp_id,
              parent_id: parentData?.id ? String(parentData.id) : ""
            }
          };
        });

        setSites(transformedSites);

        // Fetch additional data for the filtered sites
        if (transformedSites.length > 0) {
          const siteIds = transformedSites.map(site => site.id);
          // Only fetch from tables that actually exist
          await Promise.all([
            fetchUtilitiesData(siteIds),
            fetchInsuranceData(siteIds),
            fetchLocalAuthorityData(siteIds),
            fetchAwarenessPromotionData(siteIds)
          ]);

          // Initialize empty arrays for tables that don't exist yet
          setAudits([]);
          setAgreements([]);
        } else {
          // Reset all datasets if no sites match
          setUtilities([]);
          setInsurance([]);
          setLocalAuthority([]);
          setAudits([]);
          setAgreements([]);
          setAwarenessPromotion([]);
        }

      } catch (error: any) {
        console.error("Error fetching site management data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUtilitiesData = async (siteIds: string[]) => {
      try {
        // Convert string IDs to numbers for the query
        const numericSiteIds = siteIds.map(id => Number(id));

        // Build query for utilities
        let query = supabase
          .from("nd_utilities")
          .select(`
            id, 
            site_id,
            year, 
            month, 
            type_id, 
            reference_no, 
            amount_bill, 
            remark
          `)
          .in("site_id", numericSiteIds);

        // Apply year filter if present
        if (yearFilter) {
          query = query.eq("year", Number(yearFilter));
        }

        // Apply month filter if present
        if (monthFilter) {
          query = query.eq("month", Number(monthFilter));
        }

        const { data: utilities, error: utilitiesError } = await query;

        if (utilitiesError) throw utilitiesError;

        // Get utility types to map names
        const typeIds = [...new Set(utilities.map(utility => utility.type_id))];
        const { data: types, error: typesError } = await supabase
          .from("nd_type_utilities")
          .select("id, name")
          .in("id", typeIds);

        if (typesError) throw typesError;

        // Map type names and site names to utilities
        const utilitiesWithDetails = utilities.map(utility => {
          const site = sites.find(site => String(site.id) === String(utility.site_id));
          return {
            id: String(utility.id),
            site_id: String(utility.site_id),
            sitename: site?.sitename || "Unknown",
            year: utility.year,
            month: utility.month,
            type_id: utility.type_id,
            type_name: types.find(type => type.id === utility.type_id)?.name || "Unknown",
            reference_no: utility.reference_no,
            amount_bill: utility.amount_bill,
            remark: utility.remark
          };
        });

        setUtilities(utilitiesWithDetails);
      } catch (error: any) {
        console.error("Error fetching utilities data:", error);
      }
    };

    const fetchInsuranceData = async (siteIds: string[]) => {
      try {
        // Convert string IDs to numbers for the query
        const numericSiteIds = siteIds.map(id => Number(id));

        // For simplicity, using the site remarks and insurance report tables
        // Query to get site remarks first
        const { data: siteRemarks, error: remarksError } = await supabase
          .from("nd_site_remark")
          .select("id, site_id, type_id")
          .in("site_id", numericSiteIds);

        if (remarksError) throw remarksError;

        if (!siteRemarks || siteRemarks.length === 0) {
          setInsurance([]);
          return;
        }

        // Get insurance reports linked to these remarks
        const remarkIds = siteRemarks.map(remark => remark.id);
        const { data: insuranceReports, error: reportsError } = await supabase
          .from("nd_insurance_report")
          .select("site_remark_id, insurance_type_id, report_detail, start_date, end_date")
          .in("site_remark_id", remarkIds);

        if (reportsError) throw reportsError;

        // Get insurance types
        const insuranceTypeIds = [...new Set(insuranceReports.map(report => report.insurance_type_id))];
        const { data: insuranceTypes, error: typesError } = await supabase
          .from("nd_insurance_coverage_type")
          .select("id, name")
          .in("id", insuranceTypeIds);

        if (typesError) throw typesError;

        // Map insurance data
        const mappedInsurance = insuranceReports.map(report => {
          const remark = siteRemarks.find(r => r.id === report.site_remark_id);
          const site = sites.find(site => String(site.id) === String(remark?.site_id));
          const insuranceType = insuranceTypes.find(type => type.id === report.insurance_type_id);

          // Calculate status based on end_date
          const today = new Date();
          const endDate = report.end_date ? new Date(report.end_date) : null;
          let status = "Unknown";

          if (endDate) {
            if (endDate < today) {
              status = "Expired";
            } else {
              const threeMonthsFromNow = new Date();
              threeMonthsFromNow.setMonth(today.getMonth() + 3);
              status = endDate <= threeMonthsFromNow ? "Expiring Soon" : "Active";
            }
          }

          return {
            id: report.site_remark_id,
            site_id: remark?.site_id ? String(remark.site_id) : "",
            sitename: site?.sitename || "Unknown",
            insurance_type_id: report.insurance_type_id,
            insurance_type_name: insuranceType?.name || "Unknown",
            start_date: report.start_date,
            end_date: report.end_date,
            status
          };
        });

        setInsurance(mappedInsurance);
      } catch (error: any) {
        console.error("Error fetching insurance data:", error);
      }
    };

    // Placeholder function - no local authority table exists yet
    const fetchLocalAuthorityData = async (siteIds: string[]) => {
      console.log('Local authority data table not implemented yet');
      setLocalAuthority([]);
    };
    // These functions are placeholders for future implementation
    // when the corresponding database tables are created

    // Placeholder function - no audit table exists yet
    const fetchAuditsData = async () => {
      console.log('Audit data table not implemented yet');
      setAudits([]);
    };

    // Placeholder function - no agreement table exists yet
    const fetchAgreementsData = async () => {
      console.log('Agreement data table not implemented yet');
      setAgreements([]);
    };
    // Placeholder function - no awareness & promotion programme table exists yet
    const fetchAwarenessPromotionData = async (siteIds: string[]) => {
      try {
        console.log('Awareness & Promotion Programme data table not implemented yet');
        setAwarenessPromotion([]);
      } catch (error: any) {
        console.error("Error fetching awareness promotion data:", error);
      }
    };

    fetchSites();
  }, [duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter, tpFilter]);
  return {
    sites,
    utilities,
    insurance,
    localAuthority,
    audits,
    agreements,
    awarenessPromotion,
    loading,
    error
  };
};
