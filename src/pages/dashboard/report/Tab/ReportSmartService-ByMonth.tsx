import React from 'react'
import {useSmartServiceByMonthData} from "@/hooks/report/use-smartservice-bymonth-data";
import ProgrammeParticipantCard from '@/components/reports/component/smart-service/ProgrammeParticipantCard';

type ReportSmartServiceByMonthProps = {
    duspFilter?: (string | number)[];
    nadiFilter?: (string | number)[];
    tpFilter?: (string | number)[];
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;

}

const ReportSmartServiceByMonth = ({
    duspFilter = [],
    tpFilter = [],
    nadiFilter = [],
    monthFilter = null,
    yearFilter = null,
}:ReportSmartServiceByMonthProps) => {

    const {
        programParticipantData,
        loading,
        error
    } = useSmartServiceByMonthData(duspFilter, monthFilter, yearFilter, tpFilter, nadiFilter);
    
    return (
        <ProgrammeParticipantCard
            programParticipantData={programParticipantData}
            // loading={loading}
        />
    )
}

export default ReportSmartServiceByMonth