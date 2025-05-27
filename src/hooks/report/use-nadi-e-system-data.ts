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
  const [sites, setSites] = useState<NadiESystemSite[]>([]);
  const [totalSites, setTotalSites] = useState<number>(0);
  const [sitesWithCms, setSitesWithCms] = useState<number>(0);
  const [sitesWithWebsiteMigration, setSitesWithWebsiteMigration] = useState<number>(0);
  const [sitesWithEmailMigration, setSitesWithEmailMigration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSites([]);
    setTotalSites(0);
    setSitesWithCms(0);
    setSitesWithWebsiteMigration(0);
    setSitesWithEmailMigration(0);
    setLoading(false);
    setError(null);
  }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

  return {
    sites,
    totalSites,
    sitesWithCms,
    sitesWithWebsiteMigration,
    sitesWithEmailMigration,
    loading
  };
};
