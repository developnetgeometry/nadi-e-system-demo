import { useEffect, useState } from "react";

export function useSiteManagementPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  nadiFilter: (string | number)[] | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) {
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
    setError(null);
  }, []); // Only run once on mount

  return { ...data, loading, error };
}
