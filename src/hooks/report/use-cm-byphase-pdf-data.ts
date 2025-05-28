import { useEffect, useState } from "react";

// Interface for maintenance data
export interface MaintenanceData {
    id: string;
    type?: string;
    issue?: string;
    SLA?: string;
    status?: string; // Added to match the example data
    Duration?: string;
    Opened?: string;
    Closed?: string;
}
export interface docketStatusData {
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

    }
    >({
        maintainanceData: [],
        
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
                SLA: "minor",
                Duration: "2 hours",
                Opened: "2023-10-01",
                Closed: "2023-10-01",
                status: "Existing"
            },
            {
                id: "M002",
                type: "Plumbing",
                issue: "Leaking pipe",
                SLA: "major",
                Duration: "1 hour",
                Opened: "2023-10-02",
                Closed: "2023-10-02",
                status: "New"
            }
            ,
            {
                id: "M003",
                type: "HVAC",
                issue: "AC not cooling",
                SLA: "minor",
                Duration: "3 hours",
                Opened: "2023-10-03",
                Closed: "2023-10-03",
                status: "New"
            },
            {
                id: "M004",
                type: "IT",
                issue: "Network down",
                SLA: "major",
                Duration: "4 hours",
                Opened: "2023-10-04",
                Closed: "2023-10-04",
                status: "Existing"
            }
            ,
            {
                id: "M005",
                type: "Security",
                issue: "Alarm malfunction",
                SLA: "minor",
                Duration: "30 minutes",
                Opened: "2023-10-05",
                Closed: "2023-10-05",
                status: "Pending"
            },
            {
                id: "M006",
                type: "Cleaning",
                issue: "Floor cleaning",
                SLA: "minor",
                Duration: "1 hour",
                Opened: "2023-10-06",
                Closed: "2023-10-06",
                status: "Close"
            },
            {
                id: "M007",
                type: "Electrical",
                issue: "Light bulb replacement",
                SLA: "minor",
                Duration: "15 minutes",
                Opened: "2023-10-07",
                Closed: "2023-10-07",
                status: "Pending"
            },
            {
                id: "M008",
                type: "Plumbing",
                issue: "Clogged drain",
                SLA: "major",
                Duration: "2 hours",
                Opened: "2023-10-08",
                Closed: "2023-10-08",
                status: "Close"
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
        });
        
        setLoading(false);
        setError(null);
    }, []);

    return { ...data, loading, error };
}
