import { useState, useEffect } from "react";

export type DocketData = {
    status: string;
    minor: number;
    major: number;
};

// Main hook for cm byphase data
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
            { status: 'Existing', minor: 30, major: 18 },
            { status: 'New', minor: 10, major: 33 },
            { status: 'Close', minor: 11, major: 19 },
            { status: 'Pending', minor: 24, major: 38 },
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