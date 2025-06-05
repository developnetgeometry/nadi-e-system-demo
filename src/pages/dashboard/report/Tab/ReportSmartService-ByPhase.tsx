import ProgramsParticipantswithNADIInvolvementCard from "@/components/reports/component/smart-service/ProgramsParticipantswithNADIInvolvementCard"
import { useSmartServiceByPhaseData } from "@/hooks/report/use-smartservice-byphase-data";

type ReportCMByNadiProps = {
    duspFilter?: (string | number)[];
    phaseFilter?: string | number | null;
    tpFilter?: (string | number)[];
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
}


const ReportSmartServiceByPhase = ({
    duspFilter = [],
    phaseFilter = null,
    tpFilter = [],
    monthFilter = null,
    yearFilter = null,
}: ReportCMByNadiProps) => {

    const {
        ProgramsParticipantswithNADIInvolvementData,
        loading, error
    } = useSmartServiceByPhaseData(duspFilter,phaseFilter,monthFilter,yearFilter,tpFilter);
    
    return (
        <div className="w-full">
            <ProgramsParticipantswithNADIInvolvementCard
                programsAndParticipantsData={ProgramsParticipantswithNADIInvolvementData}
            // loading={loading}
            />
        </div>
    )
}

export default ReportSmartServiceByPhase