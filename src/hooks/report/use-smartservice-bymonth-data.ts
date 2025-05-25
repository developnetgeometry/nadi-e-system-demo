
import { useState, useEffect } from "react";

export type programParticipantDataType = {
    category: string;
    programs: number;
    participants: number;
};

// Main hook for cm bynadi data
export const useSmartServiceByMonthData = (
    duspFilter: (string | number)[] | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null,
    nadiFilter?: (string | number)[] | null
) => {
    const [programParticipantData, setProgramParticipantData] = useState<programParticipantDataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // dummydata
        setProgramParticipantData([
            { category: 'Entrepreneur', programs: 6, participants: 94 },
            { category: 'Lifelong Learning', programs: 8, participants: 31 },
            { category: 'Wellbeing', programs: 6, participants: 61 },
            { category: 'Awareness', programs: 3, participants: 76 },
            { category: 'Govt Initiative', programs: 9, participants: 57 },
        ])
        setLoading(false);
        setError(null);
    }, [duspFilter, monthFilter, yearFilter, tpFilter, nadiFilter]);

    return {
        programParticipantData,
        loading,
        error
    };
};