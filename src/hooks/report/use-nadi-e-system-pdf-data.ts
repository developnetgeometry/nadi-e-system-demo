import { useEffect, useState } from "react";
export interface CMSSite {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  pc_client_count?: number;
  date_install?: string;
}
export interface PortalWebServiceSite {
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  url_portal?: string;
  email_staff?: string[];
}

export interface NadiESystemPdfData {
  cms: CMSSite[];
  portalwebservice: PortalWebServiceSite[];
}

export function useNadiESystemPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
): NadiESystemPdfData {
  const [data, setData] = useState<NadiESystemPdfData>({
    cms: [],
    portalwebservice: [],
  });

  useEffect(() => {
    setData({
      cms: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "SC001",
          sitename: "Site One",
          state: "State A",
          pc_client_count: 10,
          date_install: "2023-01-01"
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "SC002",
          sitename: "Site Two",
          state: "State B",
          pc_client_count: 5,
          date_install: "2023-02-01"
        },
        {
          id: "3",
          siteId: "site3",
          standard_code: "SC003",
          sitename: "Site Three",
          state: "State C",
          pc_client_count: 8,
          date_install: "2023-03-01"
        }
      ],
      portalwebservice: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "SC001",
          sitename: "Site One",
          state: "State A",
          url_portal: "https://portal.siteone.com",
          email_staff: ["m.puncak@nadi.my","am.puncak@nadi.my"]
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "SC002",
          sitename: "Site Two",
          state: "State B",
          url_portal: "https://portal.sitetwo.com",
          email_staff: ["m.puncak@nadi.my","am.puncak@nadi.my"]
        },

      ],
    });
  }, []); // Only run once on mount

  return data;
}
