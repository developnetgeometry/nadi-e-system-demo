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

export const useInternetAccessData = (
  duspFilter: (string | number)[],
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter: (string | number)[] = []
): UseInternetAccessDataReturn => {
  const [sites, setSites] = useState<InternetAccessSite[]>([]);
  const [totalSites, setTotalSites] = useState<number>(0);
  const [sitesWithInternet, setSitesWithInternet] = useState<number>(0);
  const [sitesWithoutInternet, setSitesWithoutInternet] = useState<number>(0);
  const [connectionTypes, setConnectionTypes] = useState<{ type: string; count: number }[]>([]);
  const [providers, setProviders] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSites([]);
    setTotalSites(0);
    setSitesWithInternet(0);
    setSitesWithoutInternet(0);
    setConnectionTypes([]);
    setProviders([]);
    setLoading(false);
    setError(null);
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

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
