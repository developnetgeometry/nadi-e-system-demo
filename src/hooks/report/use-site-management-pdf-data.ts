import { useEffect, useState } from "react";

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
};

export interface Insurance{
    site_id: string;
    standard_code: string; 
    site_name: string;
    state: string;
    duration: string;
};

export interface Audit {
    site_id: string;
    standard_code: string;
    site_name: string;
    state: string;
};

export interface Agreement{
    site_id: string;
    standard_code: string; 
    site_name: string;
    state: string;
};

export interface AwarenessProgram{
    site_id: string;
    standard_code: string;
    site_name: string;
    state: string;
    program_name: string;
    program_date: string;
    status: string;
};

export  interface LocalAuthority{
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
  }, [duspFilter,phaseFilter,nadiFilter,monthFilter,yearFilter,tpFilter]);

  return { ...data, loading, error };
}
