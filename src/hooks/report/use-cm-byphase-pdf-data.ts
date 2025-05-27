import { useEffect, useState } from "react";

// Interface for maintenance data
export interface MaintenanceData {
    id: string;
    type?: string;
    issue?: string;
    SLA?: string;
    Duration?: string;
    Opened?: string;
    Closed?: string;
}

// Interface for docket status data
export interface DocketStatusData {
    status: string;
    minor: number;
    major: number;
}

export function useCMByPhasePdfData(
    duspFilter: (string | number)[] | null,
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter: (string | number)[] | null,
) {
    const [data, setData] = useState<{
        maintainanceData: MaintenanceData[];
        docketStatusData: DocketStatusData[];

    }
    >({
        maintainanceData: [],
        docketStatusData: [],
        
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // DUMMY data for demonstration purposes
        const maintenanceData = [
            {
                id: "M001",
                type: "Electrical",
                issue: "Power outage",
                SLA: "24 hours",
                Duration: "2 hours",
                Opened: "2023-10-01",
                Closed: "2023-10-01"
            },
            {
                id: "M002",
                type: "Plumbing",
                issue: "Leaking pipe",
                SLA: "48 hours",
                Duration: "1 hour",
                Opened: "2023-10-02",
                Closed: "2023-10-02"
            }
        ];
        
        // Sample data for the docket status chart
        const docketStatusData = [
            { status: "Existing", minor: 21, major: 18 },
            { status: "New", minor: 19, major: 33 },
            { status: "Close", minor: 21, major: 19 },
            { status: "Pending", minor: 14, major: 38 }
        ];
                               
        setData({
            maintainanceData: maintenanceData,
            docketStatusData: docketStatusData,
        });
        
        setLoading(false);
        setError(null);
    }, []);

    return { ...data, loading, error };
}
