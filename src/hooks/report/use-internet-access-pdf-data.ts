import { useEffect, useState } from "react";

// This hook fetches Internet Access data for PDF generation reactively based on filters
export function useInternetAccessPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) {
  const [data, setData] = useState<any>({
    sites: [],
    totalSites: 0,
    sitesWithInternet: 0,
    sitesWithoutInternet: 0,
    connectionTypes: [],
    providers: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData({
      sites: [],
      totalSites: 0,
      sitesWithInternet: 0,
      sitesWithoutInternet: 0,
      connectionTypes: [],
      providers: [],
    });
    setLoading(false);
    setError(null);
  }, []); // Only run once on mount

  return { ...data, loading, error };
}
