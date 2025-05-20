import { useState, useEffect } from "react";

// Define the types for internet access data
interface InternetAccessSite {
  id: string;
  standard_code: string;
  sitename: string;
  phase_name: string;
  has_internet: boolean;
  connection_type?: string;
  provider?: string;
  speed?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

// Interface for the hook's return value
interface UseInternetAccessDataReturn {
  sites: InternetAccessSite[];
  totalSites: number;
  sitesWithInternet: number;
  sitesWithoutInternet: number;
  loading: boolean;
  connectionTypes: { type: string; count: number }[];
  providers: { name: string; count: number }[];
}

// Mock data for demo purposes
// In a real implementation, you would fetch this from your API
const mockInternetData: InternetAccessSite[] = [
  {
    id: "site1",
    standard_code: "NADI-001",    sitename: "NADI Putrajaya",
    phase_name: "Phase 1",
    has_internet: true,
    connection_type: "Fiber",
    provider: "1", // TM
    speed: "100Mbps",
    status: 'active'
  },
  {
    id: "site2",
    standard_code: "NADI-002",    sitename: "NADI Cyberjaya",
    phase_name: "Phase 1",
    has_internet: true,
    connection_type: "Fiber",
    provider: "2", // Maxis
    speed: "50Mbps",
    status: 'active'
  },
  {
    id: "site3",
    standard_code: "NADI-003",    sitename: "NADI Shah Alam",
    phase_name: "Phase 1",
    has_internet: true,
    connection_type: "Wireless",
    provider: "3", // Celcom
    speed: "30Mbps",
    status: 'maintenance'
  },
  {
    id: "site4",
    standard_code: "NADI-004",
    sitename: "NADI Ipoh",
    phase_name: "Phase 2",
    has_internet: false,
    status: 'inactive'
  },
  {
    id: "site5",
    standard_code: "NADI-005",    sitename: "NADI Johor Bahru",
    phase_name: "Phase 2",
    has_internet: true,
    connection_type: "Fiber",
    provider: "5", // TIME
    speed: "100Mbps",
    status: 'active'
  },
  {
    id: "site6",
    standard_code: "NADI-006",    sitename: "NADI Kuantan",
    phase_name: "Phase 2",
    has_internet: true,
    connection_type: "DSL",
    provider: "1", // TM
    speed: "20Mbps",
    status: 'active'
  },
  {
    id: "site7",
    standard_code: "NADI-007",
    sitename: "NADI Kota Bharu",
    phase_name: "Phase 3",
    has_internet: false,
    status: 'inactive'
  },
  {
    id: "site8",
    standard_code: "NADI-008",    sitename: "NADI Kuala Terengganu",
    phase_name: "Phase 3",
    has_internet: true,
    connection_type: "Wireless",
    provider: "4", // Digi
    speed: "15Mbps",
    status: 'maintenance'
  }
];

export const useInternetAccessData = (
  duspFilter: (string | number)[],
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter: (string | number)[] = []
): UseInternetAccessDataReturn => {
  const [sites, setSites] = useState<InternetAccessSite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from API or use mock data
  useEffect(() => {
    setLoading(true);
    
      // Apply filters to the mock data
      let filteredSites = [...mockInternetData];
      
      // Apply DUSP filter (if implemented)
      if (duspFilter.length > 0) {
        // In a real implementation, you would filter by DUSP
        // For mock data, we'll just take some sites based on the filter length
        filteredSites = filteredSites.slice(0, 5 + duspFilter.length);
      }
        // Apply phase filter
      if (phaseFilter !== null) {
        const phaseStr = `Phase ${phaseFilter}`;
        filteredSites = filteredSites.filter(site => site.phase_name === phaseStr);
      }      // Apply TP (telecommunications provider) filter
      if (tpFilter && tpFilter.length > 0) {
        filteredSites = filteredSites.filter(site => 
          site.has_internet && site.provider && tpFilter.some(filter => String(site.provider) === String(filter))
        );
      }
      
      // Apply month/year filters if available
      // Note: Mock data doesn't have date fields, so we're not implementing this filtering
      
      setSites(filteredSites);
      setLoading(false);
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

  // Calculate statistics based on the filtered data
  const totalSites = sites.length;
  const sitesWithInternet = sites.filter(site => site.has_internet).length;
  const sitesWithoutInternet = totalSites - sitesWithInternet;

  // Calculate connection type distribution
  const connectionTypes = sites
    .filter(site => site.has_internet && site.connection_type)
    .reduce((acc, site) => {
      const existingType = acc.find(t => t.type === site.connection_type);
      if (existingType) {
        existingType.count += 1;
      } else if (site.connection_type) {
        acc.push({ type: site.connection_type, count: 1 });
      }
      return acc;
    }, [] as { type: string; count: number }[]);
  // Calculate provider distribution
  const providers = sites
    .filter(site => site.has_internet && site.provider)
    .reduce((acc, site) => {
      // Add a mapping to convert provider IDs to human readable names
      // This would be better fetched from the same place as tpProviders in useReportFilters
      const providerIdToName: Record<string, string> = {
        "1": "Telekom Malaysia",
        "2": "Maxis",
        "3": "Celcom",
        "4": "Digi",
        "5": "TIME",
        "6": "YES",
        "7": "U Mobile"
      };
      
      const providerName = providerIdToName[site.provider || ""] || site.provider;
      const existingProvider = acc.find(p => p.name === providerName);
      if (existingProvider) {
        existingProvider.count += 1;
      } else if (providerName) {
        acc.push({ name: providerName, count: 1 });
      }
      return acc;
    }, [] as { name: string; count: number }[]);

  return {
    sites,
    totalSites,
    sitesWithInternet,
    sitesWithoutInternet,
    loading,
    connectionTypes,
    providers
  };
};
