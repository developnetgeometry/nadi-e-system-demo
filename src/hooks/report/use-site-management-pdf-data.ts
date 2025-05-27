import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFormatDuration } from "@/hooks/use-format-duration";

export type Site = {
  standard_code: string;
  name: string;  // Site Name
  state: string; // State where site is located
};

export interface Utility {
  site_id: string;
  site_name: string;
  state: string;
  has_water?: boolean;
  has_electricity?: boolean;
  has_sewerage?: boolean;
  type_name?: string;
  amount_bill?: number;
  bills?: Array<{id: string, amount: number, type: string}>;  // Array of individual bills
  total_bills?: number;  // Count of total bills for this site
  total_amount?: number; // Sum of all bill amounts for this site
};

export interface Insurance {
  site_id: string;
  standard_code: string;
  site_name: string;
  state: string;
  duration: string;
  attachments?: string[]; // URLs to PDF or image attachments
};

export interface Audit {
  site_id: string;
  standard_code: string;
  site_name: string;
  state: string;
};

export interface Agreement {
  site_id: string;
  standard_code: string;
  site_name: string;
  state: string;
};

export interface AwarenessProgram {
  standard_code: string; // Site code column
  site_name: string;     // NADI column
  state: string;         // STATE column
  program_name: string;  // PROGRAM NAME column
  program_date: string;  // DATE column
};

export interface LocalAuthority {
  site_id: string;
  standard_code: string;
  site_name: string;
  state: string;
};

export function useSiteManagementPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  nadiFilter: (string | number)[] | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) {
  const { formatDuration } = useFormatDuration();
  const [data, setData] = useState<any>({
    sites: [],
    utilities: [],
    insurance: [],
    localAuthority: [],
    audits: [],
    agreements: [],
    awarenessPromotion: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);        // Step 1: Get filtered site IDs based on criteria
        let siteIds: (string | number)[] = [];
        let query = supabase.from("nd_site_profile").select("id, sitename");        // Apply filters
        if (phaseFilter) {
          query = query.eq("phase_id", Number(phaseFilter));
        }

        // First handle TP filter - direct organization relationship
        if (tpFilter && tpFilter.length > 0) {
          // Convert all values to strings for consistency
          const stringTpFilter = tpFilter.map(val => String(val));
          query = query.in("dusp_tp_id", stringTpFilter);
        }

        // Then handle DUSP filter - need to get all child TPs first
        if (duspFilter && duspFilter.length > 0) {
          // Convert all values to strings for consistency
          const stringDuspFilter = duspFilter.map(val => String(val));
          // Get all TPs that are children of selected DUSPs
          const { data: childTPs, error: childTPsError } = await supabase
            .from("organizations")
            .select("id")
            .in("parent_id", stringDuspFilter);

          if (childTPsError) throw childTPsError;

          // Get IDs of all child TPs
          const childTPIds = childTPs.map(tp => tp.id);

          // If we already have TP filter, use the intersection
          if (tpFilter && tpFilter.length > 0) {
            const tpIntersection = childTPIds.filter(id =>
              tpFilter.includes(id) || tpFilter.includes(String(id))
            );

            if (tpIntersection.length > 0) {
              query = query.in("dusp_tp_id", tpIntersection);
            } else {
              // No intersection, return empty results
              setData({
                sites: [],
                utilities: [],
                insurance: [],
                localAuthority: [],
                audits: [],
                agreements: [],
                awarenessPromotion: [],
              });
              setLoading(false);
              return;
            }
          } else {
            // No TP filter, use all child TPs
            if (childTPIds.length > 0) {
              query = query.in("dusp_tp_id", childTPIds);
            }
          }
        }        // Direct filter by NADI site IDs
        if (nadiFilter && nadiFilter.length > 0) {
          // Convert all values to numbers for consistency
          const numericNadiFilter = nadiFilter.map(val => Number(val));
          query = query.in("id", numericNadiFilter);
        }

        // Execute query to get site IDs
        const { data: sitesData, error: sitesError } = await query;
        if (sitesError) throw sitesError;

        // Extract site IDs
        if (sitesData && sitesData.length > 0) {
          siteIds = sitesData.map(site => Number(site.id));
        } else {
          // No sites found, set empty data and return
          setData({
            sites: [],
            utilities: [],
            insurance: [],
            localAuthority: [],
            audits: [],
            agreements: [],
            awarenessPromotion: [],
          });
          setLoading(false);
          return;
        }        // Step 2: Fetch site details with related info
        // Ensure siteIds are all numbers
        const numericSiteIds = siteIds.map(id => Number(id));
        
        const { data: sitesWithDetails, error: siteDetailsError } = await supabase
          .from("nd_site_profile")
          .select(`
            id, 
            sitename, 
            nd_site:nd_site(standard_code), 
            state_id:nd_state(name)
          `)
          .in("id", numericSiteIds);

        if (siteDetailsError) throw siteDetailsError;

        // Transform site data to expected format
        const formattedSites = sitesWithDetails.map(site => ({
          standard_code: site.nd_site?.[0]?.standard_code || "N/A",
          name: site.sitename || "N/A",
          state: site.state_id?.name || "N/A"
        }));
        // console.log("Formatted Sites:", formattedSites);        // Step 3: Fetch utilities data
        let utilitiesQuery = supabase
          .from("nd_utilities")
          .select(`
            id,
            site_id,
            type_id,
            amount_bill,
            month,
            year,
            nd_type_utilities:nd_type_utilities(name)
          `)
          .in("site_id", numericSiteIds)
          .in("type_id", [1, 2, 3]);  // Include only type_id values 1, 2, and 3
        if (monthFilter) {
          utilitiesQuery = utilitiesQuery.eq("month", Number(monthFilter));
        }

        if (yearFilter) {
          utilitiesQuery = utilitiesQuery.eq("year", Number(yearFilter));
        }

        const { data: utilitiesData, error: utilitiesError } = await utilitiesQuery;
        if (utilitiesError) throw utilitiesError;        
        
        // Group utilities by site_id to combine water, electricity, and sewerage for each site
        const utilitiesBySiteId = new Map();
        // Store raw utility bills to calculate totals
        const allBills = [];
        
        for (const utility of utilitiesData) {
          // Add to all bills collection
          allBills.push({
            id: utility.id,
            site_id: utility.site_id,
            amount: utility.amount_bill || 0,
            type: utility.nd_type_utilities?.name || 'Unknown'
          });
          
          if (!utilitiesBySiteId.has(utility.site_id)) {
            const site = sitesWithDetails.find(site => site.id === utility.site_id);
            utilitiesBySiteId.set(utility.site_id, {
              site_id: utility.site_id,
              site_name: site?.sitename || "N/A",
              standard_code: site?.nd_site?.[0]?.standard_code || "N/A",
              state: site?.state_id?.name || "N/A",
              has_water: false,
              has_electricity: false,
              has_sewerage: false,
              bills: [],
              total_bills: 0,
              total_amount: 0
            });
          }

          const siteUtility = utilitiesBySiteId.get(utility.site_id);
          
          // Add bill to site's bills collection
          siteUtility.bills.push({
            id: utility.id,
            amount: utility.amount_bill || 0,
            type: utility.nd_type_utilities?.name || 'Unknown'
          });
          
          // Increment bill count
          siteUtility.total_bills = (siteUtility.total_bills || 0) + 1;
          
          // Add to total amount
          siteUtility.total_amount = (siteUtility.total_amount || 0) + (utility.amount_bill || 0);

          // Set utility type flags based on utility type name (case insensitive)
          const utilityType = utility.nd_type_utilities?.name?.toLowerCase() || "";

          if (utilityType.includes('water')) {
            siteUtility.has_water = true;
          } else if (utilityType.includes('electric')) {
            siteUtility.has_electricity = true;
          } else if (utilityType.includes('sewerage') || utilityType.includes('sewage')) {
            siteUtility.has_sewerage = true;
          }
        }

        // Convert map to array
        const formattedUtilities = Array.from(utilitiesBySiteId.values());
        // console.log("Formatted Utilities:", formattedUtilities);          // Step 4: Fetch insurance data
        const { data: insuranceRemarksData, error: insuranceRemarksError } = await supabase
          .from("nd_site_remark")
          .select(`
            id,
            site_id,
            type_id,
            nd_insurance_report:nd_insurance_report(
              id,
              insurance_type_id,
              start_date,
              end_date
            )
          `)
          .in("site_id", numericSiteIds);

        if (insuranceRemarksError) throw insuranceRemarksError;

        // Filter for remarks that have insurance reports
        const insuranceRemarks = insuranceRemarksData.filter(
          remark => remark.nd_insurance_report && remark.nd_insurance_report.length > 0
        );        // Transform insurance data and fetch attachments
        const formattedInsurance = await Promise.all(insuranceRemarks.map(async (remark) => {
          const site = sitesWithDetails.find(site => site.id === remark.site_id);
          const report = remark.nd_insurance_report && remark.nd_insurance_report[0];
          let duration = "N/A";
          let attachments: string[] = [];          if (report && report.start_date && report.end_date) {
            const startDate = new Date(report.start_date);
            const endDate = new Date(report.end_date);
            
            // Calculate the difference between dates in milliseconds
            const diffInMs = endDate.getTime() - startDate.getTime();
            
            // Convert to days for use with formatDuration
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
            // Handle same day case (when diffInDays is 0) - should show as "1 day"
            if (diffInDays === 0 || 
                (startDate.getFullYear() === endDate.getFullYear() && 
                 startDate.getMonth() === endDate.getMonth() && 
                 startDate.getDate() === endDate.getDate())) {
              duration = "1 day";
            } else {
              // Use the formatDuration hook to format the duration into a human-readable string
              duration = formatDuration(diffInDays) || "1 day";
            }
              // Fetch attachments from nd_site_attachment table that are linked to this remark
            const { data: attachmentData, error: attachmentError } = await supabase
              .from("nd_site_attachment")
              .select("file_path")
              .eq("site_remark_id", remark.id);
            
            if (!attachmentError && attachmentData && attachmentData.length > 0) {
              // Filter only PDF and image attachments
              attachments = attachmentData
                .filter(att => 
                  att.file_path?.toLowerCase().endsWith('.pdf') ||
                  att.file_path?.toLowerCase().endsWith('.jpg') ||
                  att.file_path?.toLowerCase().endsWith('.jpeg') ||
                  att.file_path?.toLowerCase().endsWith('.png')
                )
                .map(att => att.file_path);
            }
          }

          return {
            site_id: remark.site_id,
            standard_code: site?.nd_site?.[0]?.standard_code || "N/A",
            site_name: site?.sitename || "N/A",
            state: site?.state_id?.name || "N/A",
            duration,
            attachments
          };
        }));
        
        // console.log("Formatted Insurance:", formattedInsurance);
          // Step 5: Fetch local authority data (placeholder - implement actual fetching when available)
        // No table for local authority data yet, returning empty array
        const formattedLocalAuthority = [];
        // console.log("Formatted Local Authority: No data available");
        // Step 6: Fetch audits data (placeholder - implement actual fetching when available)
        // No table for audit data yet, returning empty array
        const formattedAudits = [];
        // console.log("Formatted Audits: No data available");
        // Step 7: Fetch agreements data (placeholder - implement actual fetching when available)
        // No table for agreement data yet, returning empty array
        const formattedAgreements = [];
        // console.log("Formatted Agreements: No data available");        // Step 8: Fetch awareness promotion data from nd_event table
        const { data: eventAwarenessData, error: eventAwarenessError } = await supabase
          .from("nd_event")
          .select(`
            id,
            program_name,
            description,
            start_datetime,
            end_datetime,
            site_id,
            status_id,
            nd_event_status:status_id(name),
            nd_event_program:program_id(name),
            nd_event_subcategory:subcategory_id(name)
          `)
          .in("site_id", numericSiteIds);
          // .eq("program_name", "Awareness & Promotion (A&P)");

        if (eventAwarenessError) throw eventAwarenessError;        // Transform awareness promotion data
        let formattedAwarenessPromotion: any[] = [];
        // Keep track of unique sites with programs
        const sitesWithPrograms = new Set();

        if (eventAwarenessData && eventAwarenessData.length > 0) {
          formattedAwarenessPromotion = eventAwarenessData.map(event => {
            const site = sitesWithDetails.find(site => site.id === event.site_id);
            
            // Add site to set of sites with programs
            if (site && site.id) {
              sitesWithPrograms.add(site.id);
            }

            // Format program date in "DD MMM YYYY" format (e.g. "23 DEC 2025")
            let programDate = "N/A";
            if (event.start_datetime) {
              const date = new Date(event.start_datetime);
              const day = date.getDate();
              const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              const year = date.getFullYear();
              programDate = `${day} ${month} ${year}`;

              // Add end date if different from start date
              if (event.end_datetime && event.end_datetime !== event.start_datetime) {
                const endDate = new Date(event.end_datetime);
                const endDay = endDate.getDate();
                const endMonth = endDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const endYear = endDate.getFullYear();
                programDate += ` - ${endDay} ${endMonth} ${endYear}`;
              }
            }
            return {
              site_id: event.site_id,
              standard_code: site?.nd_site?.[0]?.standard_code || "N/A", // Site code column
              site_name: site?.sitename || "N/A", // NADI column
              state: site?.state_id?.name || "N/A", // STATE column
              program_name: event.program_name || event.nd_event_program?.name || "N/A", // PROGRAM NAME column
              program_date: programDate // DATE column
            };
          });
            // We'll track the count separately instead of adding it to the array
          // This data will be available in the UI via the map(ap => ap.site_id) count
        } else {
          // No "Awareness & Promotion (A&P)" events found, return empty array
          // as these must be specifically "Awareness & Promotion (A&P)" programs
          formattedAwarenessPromotion = [];
        }
        // console.log("Formatted Awareness Promotion:", formattedAwarenessPromotion);

        // Update state with all fetched data
        setData({
          sites: formattedSites,
          utilities: formattedUtilities,
          insurance: formattedInsurance,
          localAuthority: formattedLocalAuthority,
          audits: formattedAudits,
          agreements: formattedAgreements,
          awarenessPromotion: formattedAwarenessPromotion,
        });

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching site management data:", err);
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter, tpFilter]);

  return { ...data, loading, error };
}
