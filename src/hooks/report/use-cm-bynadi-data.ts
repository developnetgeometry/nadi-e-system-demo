import { useState, useEffect } from "react";

export type DocketData = {
    status: string;
    minor: number;
    major: number;
};

// Main hook for cm bynadi data
export const useDocketData = (
    duspFilter: (string | number)[] | null,
    nadiFilter: (string | number)[] | null,
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null
) => {
    const [docketStatusData, setDocketStatusData] = useState<DocketData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // this is  dummy
        setDocketStatusData([
            { status: 'Existing', minor: 21, major: 18 },
            { status: 'New', minor: 19, major: 33 },
            { status: 'Close', minor: 21, major: 19 },
            { status: 'Pending', minor: 14, major: 38 },
        ]);
        setLoading(false);
        setError(null);
    }, [duspFilter, nadiFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

    return {
        docketStatusData,
        loading,
        error
    };
};
