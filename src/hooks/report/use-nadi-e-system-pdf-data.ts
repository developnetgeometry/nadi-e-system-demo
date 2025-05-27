import { useEffect, useState } from "react";
import { NadiESystemSite } from "./use-nadi-e-system-data";

export interface NadiESystemPdfData {
  sites: NadiESystemSite[];
  totalSites: number;
  sitesWithCms: number;
  sitesWithWebsiteMigration: number;
  sitesWithEmailMigration: number;
}

export function useNadiESystemPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
): NadiESystemPdfData {
  const [data, setData] = useState<NadiESystemPdfData>({
    sites: [],
    totalSites: 0,
    sitesWithCms: 0,
    sitesWithWebsiteMigration: 0,
    sitesWithEmailMigration: 0
  });

  useEffect(() => {
    setData({
      sites: [],
      totalSites: 0,
      sitesWithCms: 0,
      sitesWithWebsiteMigration: 0,
      sitesWithEmailMigration: 0
    });
  }, []); // Only run once on mount

  return data;
}
