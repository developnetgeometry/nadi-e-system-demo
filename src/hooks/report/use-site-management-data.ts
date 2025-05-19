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
  amount?: number;
  provider?: string;
}

export interface SiteAuditData {
  id: string;
  site_id: string;
  sitename?: string;
  audit_date: string;
  findings: string;
  status: string;
  auditor?: string;
}

export interface SiteAgreementData {
  id: string;
  site_id: string;
  sitename?: string;
  start_date: string;
  end_date: string;
  agreement_type: string;
  status: string;
  renewal_date?: string;
}

export const useSiteManagementData = (
  duspFilter: string | number | null,
  phaseFilter: (string | number)[],
  nadiFilter: (string | number)[],
  monthFilter: string | number | null,
  yearFilter: string | number | null
) => {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [utilities, setUtilities] = useState<UtilityData[]>([]);
  const [insurance, setInsurance] = useState<SiteInsuranceData[]>([]);
  const [audits, setAudits] = useState<SiteAuditData[]>([]);
  const [agreements, setAgreements] = useState<SiteAgreementData[]>([]);
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
        if (duspFilter) {
          // Log the filter for debugging
          console.log('Applying DUSP filter via post-query filtering:', duspFilter);
        }
        
        // Apply phase filter if present
        if (phaseFilter && phaseFilter.length > 0) {
          query = query.in("phase_id", phaseFilter);
        }
        
        // Apply NADI filter (site filter) if present
        if (nadiFilter && nadiFilter.length > 0) {
          query = query.in("id", nadiFilter);
        }
          console.log('Query with filters:', { duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter });
        const { data, error } = await query;
        
        if (error) {
          console.error('Error in site query:', error);
          throw error;
        }
          console.log(`Fetched ${data?.length || 0} sites before post-filtering`);        // Apply DUSP filter here if needed
        let filteredData = data;
        if (duspFilter) {
          // Count sites with and without DUSP for debugging
          const sitesWithDusp = data.filter(site => Boolean(site.dusp_tp_id)).length;
          const sitesWithoutDusp = data.length - sitesWithDusp;
          console.log(`Sites with DUSP: ${sitesWithDusp}, Sites without DUSP: ${sitesWithoutDusp}`);
          
          // Special case for "unassigned" filter - show only sites without DUSP
          if (duspFilter === "unassigned") {
            console.log('Filtering for unassigned sites (no DUSP)');
            filteredData = data.filter(site => !site.dusp_tp_id);
            console.log(`Found ${filteredData.length} unassigned sites`);
          } else {
            // Normal DUSP filter with better type checking and data normalization
            filteredData = data.filter(site => {
              // First check if site has dusp_tp_id assigned
              if (!site.dusp_tp_id) {
                console.log(`Site ${site.sitename} has no dusp_tp_id assigned - excluded from DUSP filter`);
                return false;
              }
              
              // Handle different data structures that might be returned
              if (!site.dusp_tp) {
                console.log(`Site ${site.sitename} has no dusp_tp data`);
                return false;
              }
              
              // Normalize dusp_tp data which can be an array or object
              const duspData = Array.isArray(site.dusp_tp) ? site.dusp_tp[0] : site.dusp_tp;
              
              // Skip if no valid dusp data
              if (!duspData) {
                console.log(`Site ${site.sitename} has invalid dusp_tp data format`);
                return false;
              }
              
              // Normalize parent data which can also be an array or object
              const parentData = duspData.parent 
                ? (Array.isArray(duspData.parent) ? duspData.parent[0] : duspData.parent) 
                : null;
              
              // Get the parent ID for comparison
              const parentId = parentData?.id;
              
              const matches = String(parentId) === String(duspFilter);
              
              // Log every site for debugging purposes
              console.log('DUSP filter check:', {
                sitename: site.sitename,
                has_dusp_tp_id: Boolean(site.dusp_tp_id),
                duspName: duspData?.name || 'unknown',
                parentId: parentId || 'none',
                parentName: parentData?.name || 'unknown',
                filterValue: duspFilter,
                matches
              });
              
              return matches;
            });
          }
          
          console.log(`After DUSP filter: ${filteredData.length} sites remain out of ${data.length}`);
        }        // Log some info about the data structure
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
          const dusp_tp_id = hasDuspAssigned ? (site.dusp_tp_id || duspData?.id || "") : null;
          
          // Construct the complete parent-child hierarchy info
          const dusp_id = hasDuspAssigned ? (parentData?.id || dusp_tp_id) : null;
          const dusp_name = duspData?.name || "";
          const parent_dusp_name = parentData?.name || "";
          
          // Format the display name based on available data
          let formattedDuspName;
          if (!hasDuspAssigned) {
            formattedDuspName = "Not Assigned";
          } else if (parent_dusp_name) {
            formattedDuspName = `${dusp_name} (${parent_dusp_name})`;
          } else {
            formattedDuspName = dusp_name;
          }
            return {
            id: site.id,
            sitename: site.sitename,
            fullname: site.fullname || "",
            standard_code: site.nd_site?.[0]?.standard_code || "",
            is_active: site.is_active,
            phase_id: site.phase_id || phaseData?.id || "",
            phase_name: phaseData?.name || "",            dusp_id: dusp_id,
            dusp_name: formattedDuspName,
            hasDusp: hasDuspAssigned, // Flag to track if site has DUSP assigned
            // Store original IDs for debugging
            _debug: {
              hasDusp: hasDuspAssigned,
              dusp_tp_id: dusp_tp_id,
              parent_id: parentData?.id || ""
            }
          };
        });
        
        setSites(transformedSites);
        
        // Fetch additional data for the filtered sites
        if (transformedSites.length > 0) {
          const siteIds = transformedSites.map(site => site.id);
          await Promise.all([
            fetchUtilitiesData(siteIds),
            fetchInsuranceData(siteIds),
            fetchAuditsData(siteIds),
            fetchAgreementsData(siteIds)
          ]);
        } else {
          // Reset all datasets if no sites match
          setUtilities([]);
          setInsurance([]);
          setAudits([]);
          setAgreements([]);
        }
        
      } catch (error) {
        console.error("Error fetching site management data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUtilitiesData = async (siteIds: string[]) => {
      try {
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
          .in("site_id", siteIds);
          
        // Apply year filter if present
        if (yearFilter) {
          query = query.eq("year", yearFilter);
        }
        
        // Apply month filter if present
        if (monthFilter) {
          query = query.eq("month", monthFilter);
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
          const site = sites.find(site => site.id === utility.site_id);
          return {
            ...utility,
            sitename: site?.sitename || "Unknown",
            type_name: types.find(type => type.id === utility.type_id)?.name || "Unknown"
          };
        });
        
        setUtilities(utilitiesWithDetails);
      } catch (error) {
        console.error("Error fetching utilities data:", error);
      }
    };
    
    const fetchInsuranceData = async (siteIds: string[]) => {
      try {
        // For simplicity, using the site remarks and insurance report tables
        // Query to get site remarks first
        const { data: siteRemarks, error: remarksError } = await supabase
          .from("nd_site_remark")
          .select("id, site_id, type_id")
          .in("site_id", siteIds);
          
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
          const site = sites.find(site => site.id === remark?.site_id);
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
            site_id: remark?.site_id || "",
            sitename: site?.sitename || "Unknown",
            insurance_type_id: report.insurance_type_id,
            insurance_type_name: insuranceType?.name || "Unknown",
            start_date: report.start_date,
            end_date: report.end_date,
            status,
            // Mock data for demo
            amount: Math.floor(Math.random() * 10000) + 1000,
            provider: ["Insurance Co A", "Insurance Co B", "Insurance Co C"][Math.floor(Math.random() * 3)]
          };
        });
        
        setInsurance(mappedInsurance);
      } catch (error) {
        console.error("Error fetching insurance data:", error);
      }
    };
    
    const fetchAuditsData = async (siteIds: string[]) => {
      // Mock audit data for demo
      const mockAuditData: SiteAuditData[] = [];
      const statuses = ["Completed", "In Progress", "Pending"];
      
      // Generate mock data for each site
      siteIds.forEach(siteId => {
        const site = sites.find(site => site.id === siteId);
        
        // Add 1-3 random audits per site
        const auditCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < auditCount; i++) {
          const auditDate = new Date();
          // Set audit date to random past date in last 12 months
          auditDate.setMonth(auditDate.getMonth() - Math.floor(Math.random() * 12));
          
          mockAuditData.push({
            id: `audit-${siteId}-${i}`,
            site_id: siteId,
            sitename: site?.sitename || "Unknown",
            audit_date: auditDate.toISOString().split('T')[0],
            findings: ["No issues found", "Minor issues to address", "Critical issues requiring attention"][Math.floor(Math.random() * 3)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            auditor: ["Auditor A", "Auditor B", "Auditor C"][Math.floor(Math.random() * 3)]
          });
        }
      });
      
      setAudits(mockAuditData);
    };
    
    const fetchAgreementsData = async (siteIds: string[]) => {
      // Mock agreement data for demo
      const mockAgreementData: SiteAgreementData[] = [];
      const agreementTypes = ["Service", "Lease", "Maintenance"];
      const statuses = ["Active", "Expiring Soon", "Expired", "Pending Renewal"];
      
      // Generate mock data for each site
      siteIds.forEach(siteId => {
        const site = sites.find(site => site.id === siteId);
        
        // Generate start date (1-3 years ago)
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - (Math.floor(Math.random() * 3) + 1));
        
        // Generate end date (0-2 years from now)
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + Math.floor(Math.random() * 3));
        
        // Generate renewal date (3 months before end date)
        const renewalDate = new Date(endDate);
        renewalDate.setMonth(renewalDate.getMonth() - 3);
        
        mockAgreementData.push({
          id: `agreement-${siteId}`,
          site_id: siteId,
          sitename: site?.sitename || "Unknown",
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          agreement_type: agreementTypes[Math.floor(Math.random() * agreementTypes.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          renewal_date: renewalDate.toISOString().split('T')[0]
        });
      });
      
      setAgreements(mockAgreementData);
    };

    fetchSites();
  }, [duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter]);

  return {
    sites,
    utilities,
    insurance,
    audits,
    agreements,
    loading,
    error
  };
};
