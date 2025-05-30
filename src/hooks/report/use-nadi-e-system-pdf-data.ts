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
          standard_code: "S06N001",
          sitename: "NADI Batu Payung",
          state: "Sabah",
          pc_client_count: 10,
          date_install: "2023-01-01"
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "N11N002",
          sitename: "NADI Felda Pasoh 2",
          state: "Negeri Sembilan",
          pc_client_count: 5,
          date_install: "2023-02-01"
        },
        {
          id: "3",
          siteId: "site3",
          standard_code: "Q10N005",
          sitename: "NADI PPR Taman Dahlia",
          state: "Sarawak",
          pc_client_count: 8,
          date_install: "2023-03-01"
        }
      ],
      portalwebservice: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "S06N001",
          sitename: "NADI Batu Payung",
          state: "Sabah",
          url_portal: "https://portal.batupayung.com",
          email_staff: ["yap.jia.hui@batupayung.my","muhammad.luqman@batupayung.my"]
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "Q10N005",
          sitename: "NADI PPR Taman Dahlia",
          state: "Sarawak",
          url_portal: "https://portal.PPRTamanDahlia.com",
          email_staff: ["sim.mei.hui@PPRTamanDahlia.my","mazlan.shah@PPRTamanDahlia.my"]
        },

      ],

    });
  }, []); // Only run once on mount

  return data;
}
