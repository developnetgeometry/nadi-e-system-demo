import { useEffect, useState } from "react";

export interface UpscalingTrainingData {
    id: string;
    site_id?: string;
    sitename?: string;
    state?: string;
    phase_name?: string;
    fullname: string;
    position: string;
    programme_name?: string;
    programme_method?: string;
    programme_venue?: string;
    programme_date?: string;
}

export interface RefreshTrainingData {
    id: string;
    site_id?: string;
    sitename?: string;
    state?: string;
    phase_name?: string;
    fullname: string;
    position: string;
    programme_name?: string;
    programme_method?: string;
    programme_venue?: string;
    programme_date?: string;
}

// This hook fetches HR Salary data for PDF generation reactively based on filters
export function useTrainingPdfData(
    duspFilter: (string | number)[] | null,
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null,
) {
    const [data, setData] = useState<{
        upscalingTrainingData: UpscalingTrainingData[],
        refreshTrainingData: RefreshTrainingData[]
    }
    >({
        upscalingTrainingData: [],
        refreshTrainingData: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setData({
            // DUMMY data for demonstration purposes
            upscalingTrainingData: [
                {
                    id: "1",
                    site_id: "101",
                    sitename: "NADI Felda Kahang Timur",
                    state: "Johor",
                    phase_name: "Felda",
                    fullname: "Ahmad Bin Ali",
                    position: "Manager",
                    programme_name: "Upskilling 2025",
                    programme_method: "Online",
                    programme_venue: "Zoom",
                    programme_date: "2025-05-01"
                },
                {
                    id: "2",
                    site_id: "102",
                    sitename: "NADI Gurun",
                    state: "Kedah",
                    phase_name: "Clawback 2013",
                    fullname: "Siti Nurhaliza",
                    position: "Assistant Manager",
                    programme_name: "Upskilling 2025",
                    programme_method: "Physical",
                    programme_venue: "Johor Convention Centre",
                    programme_date: "2025-05-10"
                }
            ],
            refreshTrainingData: [
                {
                    id: "1",
                    site_id: "101",
                    sitename: "NADI Sungai Sireh Tanjung Karang",
                    state: "Selangor",
                    phase_name: "Phase 2",
                    fullname: "Abu Hassan",
                    position: "Manager",
                    programme_name: "Upskilling 2025",
                    programme_method: "Online",
                    programme_venue: "Zoom",
                    programme_date: "2025-05-01"
                },
                {
                    id: "2",
                    site_id: "101",
                    sitename: "NADI Pekan Kampung Lalang",
                    state: "Kedah",
                    phase_name: "Pilot",
                    fullname: "Siti Nurhaliza",
                    position: "Assistant Manager",
                    programme_name: "Upskilling 2025",
                    programme_method: "Physical",
                    programme_venue: "Johor Convention Centre",
                    programme_date: "2025-05-10"
                }

            ]
        });
        setLoading(false);
        setError(null);
    }, []); // Only run once on mount

    return { ...data, loading, error };
}
