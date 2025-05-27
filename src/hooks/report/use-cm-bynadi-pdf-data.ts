import { useEffect, useState } from "react";

export interface MaintenanceData {
    id: string;
    type?: string;
    issue?: string;
    SLA?: string;
    Duration?: string;
    Opened?: string;
    Closed?: string;
}

export interface SiteInfo {
    siteName: string;
    refId: string;
    phase: string;
    region: string;
    state: string;
    parliament: string;
    dun: string;
}

export interface SupervisorInfo {
    manager: string;
    managerMobile: string;
    assistantManager: string;
    assistantManagerMobile: string;
}

// This hook fetches HR Salary data for PDF generation reactively based on filters
export function useCMByNadiPdfData(
    duspFilter: (string | number)[] | null,
    nadiFilter: (string | number)[] | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null,
) {
    const [data, setData] = useState<{
        maintainanceData: MaintenanceData[],
        siteInfo?: SiteInfo,
        supervisorInfo?: SupervisorInfo
    }
    >({
        maintainanceData: [],
        siteInfo: undefined,
        supervisorInfo: undefined
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        setData({
            // DUMMY data for demonstration purposes
            maintainanceData: [
                {
                    id: "M001",
                    type: "Electrical",
                    issue: "Power outage",
                    SLA: "4 hours",
                    Duration: "3 hours",
                    Opened: "2023-05-10 09:00",
                    Closed: "2023-05-10 12:00"
                },
                {
                    id: "M002",
                    type: "Plumbing",
                    issue: "Water leak",
                    SLA: "6 hours",
                    Duration: "5 hours",
                    Opened: "2023-05-12 11:30",
                    Closed: "2023-05-12 16:30"
                },
                {
                    id: "M003",
                    type: "HVAC",
                    issue: "AC not cooling",
                    SLA: "12 hours",
                    Duration: "8 hours",
                    Opened: "2023-05-15 08:00",
                    Closed: "2023-05-15 16:00"
                },
                {
                    id: "M004",
                    type: "IT",
                    issue: "Network down",
                    SLA: "2 hours",
                    Duration: "1.5 hours",
                    Opened: "2023-05-18 14:00",
                    Closed: "2023-05-18 15:30"
                },
                {
                    id: "M005",
                    type: "Structural",
                    issue: "Ceiling damage",
                    SLA: "24 hours",
                    Duration: "20 hours",
                    Opened: "2023-05-20 10:00",
                    Closed: "2023-05-21 06:00"
                },
                {
                    id: "M006",
                    type: "Electrical",
                    issue: "Broken outlet",
                    SLA: "8 hours",
                    Duration: "4 hours",
                    Opened: "2023-05-22 13:00",
                    Closed: "2023-05-22 17:00"
                },
                {
                    id: "M007",
                    type: "Security",
                    issue: "Door lock malfunction",
                    SLA: "3 hours",
                    Duration: "2 hours",
                    Opened: "2023-05-25 07:30",
                    Closed: "2023-05-25 09:30"
                }
            ]
            , siteInfo: {
                siteName: "NADI KOA KELINGKING",
                refId: "NADI_1098 (B13C001)",
                phase: "NADI 23",
                region: "CENTRAL",
                state: "SELANGOR",
                parliament: "SEPANG",
                dun: "DENGKIL"
            },
            supervisorInfo: {
                manager: "SITI HALIMAH HUSSIN",
                managerMobile: "013-2345674",
                assistantManager: "MOHD AIDIL ZAQUAN AMIR",
                assistantManagerMobile: "012-3244565"
            }
        });
        setLoading(false);
        setError(null);
    }, []); // Only run once on mount

    return { ...data, loading, error };
}
