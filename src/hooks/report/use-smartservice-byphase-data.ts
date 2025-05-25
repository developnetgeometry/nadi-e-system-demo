import { useState, useEffect } from "react";

export type ProgramsParticipantswithNADIInvolvementData = {
    category: string;
    programs: number;
    participants: number;
    nadiInvolved: number;
}

// Main hook for cm bynadi data
export const useSmartServiceByPhaseData = (
    duspFilter: (string | number)[] | null,
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter?: (string | number)[] | null
) => {
    const [ProgramsParticipantswithNADIInvolvementData, setProgramsParticipantswithNADIInvolvementData] = useState<ProgramsParticipantswithNADIInvolvementData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        // this is  dummy
        setProgramsParticipantswithNADIInvolvementData([
            { category: 'Entrepreneur', programs: 7, participants: 176, nadiInvolved: 43 },
            { category: 'Lifelong Learning', programs: 5, participants: 74, nadiInvolved: 17 },
            { category: 'Wellbeing', programs: 18, participants: 146, nadiInvolved: 41 },
            { category: 'Awareness', programs: 11, participants: 84, nadiInvolved: 30 },
            { category: 'Govt Initiative', programs: 7, participants: 144, nadiInvolved: 41 },
        ]);
        setLoading(false);
        setError(null);
    }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

    return {
        ProgramsParticipantswithNADIInvolvementData,
        loading,
        error
    };
};