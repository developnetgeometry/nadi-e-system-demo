import { useEffect, useState } from "react";

export interface InternetServiceSite{
  id: string | number;
  siteId?: string | number;
  standard_code?: string;
  sitename?: string;
  state?: string;
  technology?: string;
  bandwidth?: string;
}

export interface InternetAccessPdfData {
  internetSite: InternetServiceSite[];
}

// This hook fetches Internet Access data for PDF generation reactively based on filters
export function useInternetAccessPdfData(
  duspFilter: (string | number)[] | null,
  phaseFilter: string | number | null,
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter?: (string | number)[] | null,
) :InternetAccessPdfData {
  const [data, setData] = useState<any>({
    internetSite: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData({
      internetSite: [
        {
          id: "1",
          siteId: "site1",
          standard_code: "Q01N001",
          sitename: "NADI Tebedu",
          state: "Sarawak",
          technology: "Fiber",
          bandwidth: "100 Mbps"
        },
        {
          id: "2",
          siteId: "site2",
          standard_code: "S13N002",
          sitename: "NADI Sim Sim",
          state: "Sabah",
          technology: "DSL",
          bandwidth: "50 Mbps"
        },
        {
          id: "3",
          siteId: "site3",
          standard_code: "J13N003",
          sitename: "NADI Kem Makhota",
          state: "Johor",
          technology: "Satellite",
          bandwidth: "25 Mbps"
        },
        {
          id: "4",
          siteId: "site4",
          standard_code: "Q13N006",
          sitename: "NADI Kg Patimbun",
          state: "Sarawak",
          technology: "Cable",
          bandwidth: "200 Mbps"
        },
        {
          id: "5",
          siteId: "site5",
          standard_code: "J05N007",
          sitename: "NADI Taman Lautan Biru",
          state: "Johor",
          technology: "Wireless",
          bandwidth: "10 Mbps"
        },
      ],


    });
    setLoading(false);
    setError(null);
  }, []); // Only run once on mount

  return { ...data, loading, error };
}
