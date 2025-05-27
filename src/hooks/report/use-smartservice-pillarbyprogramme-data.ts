
import { useState, useEffect } from "react";

export type PillarByProgrammeData = {
    id: number;
    name: string;
    date: string;
    channel: string;
    format: string;
    participants: number;
}

// Main hook for cm bynadi data
export const useSmartServicePillarByProgrammeData = (
    duspFilter: (string | number)[] | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null,
    pillarFilter?: (string | number)[] | null,
    programmeFilter?: (string | number)[] | null,
    nadiFilter?: (string | number)[] | null
) => {

    const [pillarByProgramTableData, setPillarByProgrammeTableData] = useState<PillarByProgrammeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // dummydata
        setPillarByProgrammeTableData([
            { id: 1, name: 'Entrepreneur Workshop Series 1', date: '15 Apr 2025', channel: 'In-person Workshop', format: 'Physical', participants: 35 },
            { id: 2, name: 'Digital Skills Development', date: '20 Apr 2025', channel: 'Online Course', format: 'Online', participants: 57 },
            { id: 3, name: 'Community Business Forum', date: '28 Apr 2025', channel: 'Seminar', format: 'Physical', participants: 42 },
            { id: 4, name: 'Youth Leadership Program', date: '05 May 2025', channel: 'Hybrid Workshop', format: 'Hybrid', participants: 28 },
            { id: 5, name: 'Financial Literacy Webinar', date: '12 May 2025', channel: 'Webinar', format: 'Online', participants: 63 },
        ])
        setLoading(false);
        setError(null);
    }, [duspFilter, monthFilter, yearFilter, tpFilter, pillarFilter, programmeFilter, nadiFilter]);

    return {
        pillarByProgramTableData,
        loading,
        error
    };
};