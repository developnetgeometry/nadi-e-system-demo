import { useState, useEffect } from 'react';

// Type definitions for NADI e-System data
export interface NadiESystemSite {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  phase_id?: string | number;
  phase_name?: string;
  dusp_id?: string | number;
  dusp_name?: string;
  state?: string;
  has_cms?: boolean;
  pc_client_count?: number;
  date_install?: string;
  website_migrated?: boolean;
  url_portal?: string;
  email_migrated?: boolean;
  email_staff?: string[];
  provider?: string;
}

export interface NadiESystemData {
  sites: NadiESystemSite[];
  totalSites: number;
  sitesWithCms: number;
  sitesWithWebsiteMigration: number; 
  sitesWithEmailMigration: number;
  loading: boolean;
}

export const useNadiESystemData = (
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null, 
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter: (string | number)[] = []
): NadiESystemData => {
  const [data, setData] = useState<NadiESystemData>({
    sites: [],
    totalSites: 0,
    sitesWithCms: 0,
    sitesWithWebsiteMigration: 0,
    sitesWithEmailMigration: 0,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      // Set loading state
      setData(prev => ({ ...prev, loading: true }));

      try {
        // TODO: Replace with actual API call to fetch NADI e-System data
        // This is mock data for development purposes
        await new Promise(resolve => setTimeout(resolve, 1000));        // Mock data based on the PDF template        // Define real site names based on the PDF template
        const realSites = [
          { name: "BATU 1 SUNGAI PINGGAN", state: "JOHOR", code: "NAD1001" },
          { name: "KAMPUNG BERUAS", state: "PAHANG", code: "NAD1002" },
          { name: "SUNGAI RAMBAI", state: "MELAKA", code: "NAD1003" },
          { name: "BUKIT BERUANG", state: "MELAKA", code: "NAD1004" },
          { name: "ALOR GAJAH", state: "MELAKA", code: "NAD1005" },
          { name: "PENGKALAN BALAK", state: "MELAKA", code: "NAD1006" },
          { name: "AYER KEROH", state: "MELAKA", code: "NAD1007" },
          { name: "BUKIT KATIL", state: "MELAKA", code: "NAD1008" },
          { name: "TANJUNG BIDARA", state: "MELAKA", code: "NAD1009" },
          { name: "BATANG MELAKA", state: "MELAKA", code: "NAD1010" },
          { name: "KUALA LINGGI", state: "MELAKA", code: "NAD1011" },
          { name: "SIMPANG AMPAT", state: "MELAKA", code: "NAD1012" },
          { name: "JASIN", state: "MELAKA", code: "NAD1013" },
          { name: "BEMBAN", state: "MELAKA", code: "NAD1014" },
          { name: "TENGKERA", state: "MELAKA", code: "NAD1015" }
        ];        // Generate mock sites with detailed information
        const mockSites: NadiESystemSite[] = realSites.map((site, i) => {
          // Get site data from our predefined list
          const siteName = site.name;
          const state = site.state;
          const standardCode = site.code;
            // Phase ID - based on index to ensure distribution
          // First 5 sites are Phase 1, next 5 are Phase 2, next 5 are Phase 3
          const phaseId = Math.floor(i / 5) % 3 + 1;
          
          // DUSP ID - based on the site's state
          // Each state corresponds to a DUSP
          const stateTodusp = {
            "JOHOR": 1,
            "PAHANG": 2,
            "MELAKA": 3,
            "SELANGOR": 4,
            "KEDAH": 5
          };
          const duspId = stateTodusp[state as keyof typeof stateTodusp] || 1;
          
          // CMS status - specific sites have it
          // Based on the PDF template, most sites have CMS
          const hasCms = i < 10; // First 10 sites have CMS
          
          // PC client count (for sites with CMS)
          // The template shows values like 8 and 10
          const pcClientCount = hasCms ? [8, 10, 12, 7, 9, 8, 10, 8, 7, 10][i % 10] : 0;
          
          // Installation date - based on PDF template shows Oct 2024
          const dateInstall = hasCms ? "09 OCT 2024" : '';
          
          // Website migration status - based on index
          // In template, many sites have websites
          const websiteMigrated = i % 3 !== 2; // 2/3 of sites have website migration
          
          // URL portal format from template: sitename.nadi.my
          const urlPortal = websiteMigrated ? 
            `${siteName.toLowerCase().replace(/\s+/g, '').replace(/\d+/g, '')}.nadi.my` : '';
          
          // Email migration - same as website migration in template
          const emailMigrated = websiteMigrated;
          
          // Email staff accounts from template:
          // Format: m.sitename@nadi.my; am.sitename@nadi.my
          const siteNameForEmail = siteName.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\d+/g, '');
            
          const emailStaff = emailMigrated 
            ? [
                `m.${siteNameForEmail}@nadi.my`,
                `am.${siteNameForEmail}@nadi.my`
              ]
            : [];            // Create and return site object with all required fields          // Assign provider based on site index - distribute providers across sites
          // Use actual provider IDs that will match with what's returned from useReportFilters hook
          // These IDs should match the database IDs in the organizations table with type="tp"
          // For mock data, we'll use string IDs that will match the actual database IDs format
          const providerOptions = ["1", "2", "3", "4", "5", "6", "7"];
          const provider = providerOptions[i % providerOptions.length];

          return {
            id: i + 1,
            siteId: standardCode,
            standard_code: standardCode,
            sitename: siteName,
            state,
            phase_id: phaseId,
            phase_name: `Phase ${phaseId}`,
            dusp_id: duspId,
            dusp_name: `DUSP ${duspId}`,
            has_cms: hasCms,
            pc_client_count: pcClientCount,
            date_install: dateInstall,
            website_migrated: websiteMigrated,
            url_portal: urlPortal,
            email_migrated: emailMigrated,
            email_staff: emailStaff,
            provider: provider
          };
        });        // Add a few edge cases to demonstrate different scenarios
        
        // Site with many PC clients
        if (mockSites.length > 3) {
          mockSites[3].pc_client_count = 15;
        }
        
        // Site with more detailed email info
        if (mockSites.length > 5) {
          mockSites[5].email_staff = [
            'm.pengkalanbalak@nadi.my',
            'am.pengkalanbalak@nadi.my',
            'tech.pengkalanbalak@nadi.my',
            'admin.pengkalanbalak@nadi.my'
          ];
        }
        
        // Filter the mock data based on the filters
        let filteredSites = [...mockSites];

        // Apply DUSP filter if it exists
        if (duspFilter && duspFilter.length > 0) {
          filteredSites = filteredSites.filter(site => 
            duspFilter.includes(site.dusp_id!)
          );
        }

        // Apply Phase filter if it exists
        if (phaseFilter !== null) {
          filteredSites = filteredSites.filter(site => 
            site.phase_id === phaseFilter
          );
        }

        // Apply Month and Year filters to simulate time-based filtering
        // In real implementation, this would filter data based on when sites were added/updated
        if (monthFilter !== null || yearFilter !== null) {
          // For the mockup, we'll filter based on site ID
          // This simulates sites being added in different time periods
          const monthValue = monthFilter ? Number(monthFilter) : 1;
          const yearValue = yearFilter ? Number(yearFilter) : 2024;
          
          // Create a deterministic filter based on month/year combination
          const timeFilterValue = (yearValue - 2020) * 12 + monthValue;
              // Filter sites based on this value (higher value = more sites)
          filteredSites = filteredSites.filter(site => {
            const siteIndex = Number(site.id);
            return siteIndex <= timeFilterValue * 2;
          });
        }        // Apply TP filter if present
        if (tpFilter && tpFilter.length > 0) {
          filteredSites = filteredSites.filter(site => 
            site.provider && tpFilter.some(filter => String(site.provider) === String(filter))
          );
        }

        // Calculate summary statistics
        const totalSites = filteredSites.length;
        const sitesWithCms = filteredSites.filter(site => site.has_cms).length;
        const sitesWithWebsiteMigration = filteredSites.filter(site => site.website_migrated).length;
        const sitesWithEmailMigration = filteredSites.filter(site => site.email_migrated).length;

        // Update state with fetched data
        setData({
          sites: filteredSites,
          totalSites,
          sitesWithCms,
          sitesWithWebsiteMigration,
          sitesWithEmailMigration,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching NADI e-System data:", error);
        setData({
          sites: [],
          totalSites: 0,
          sitesWithCms: 0,
          sitesWithWebsiteMigration: 0,
          sitesWithEmailMigration: 0,
          loading: false
        });
      }
    };    fetchData();
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

  return data;
};
