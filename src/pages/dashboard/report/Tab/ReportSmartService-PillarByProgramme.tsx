import NumberOfParticipantCard from '@/components/reports/component/smart-service/NumberOfParticipantCard'
import NumberOfProgramCard from '@/components/reports/component/smart-service/NumberOfProgramCard'
import ProgramTableCard from '@/components/reports/component/smart-service/ProgramTableCard'
import { useSmartServicePillarByProgrammeData } from '@/hooks/report/use-smartservice-pillarbyprogramme-data'

type ReportSmartServicePillarByProgrammeProps = {
    duspFilter?: (string | number)[];
    tpFilter?: (string | number)[];
    nadiFilter?: (string | number)[];
    pillarFilter?: (string | number)[];
    programFilter?: (string | number)[];
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
}

const ReportSmartServicePillarByProgramme = ({
    duspFilter = [],
    tpFilter = [],
    nadiFilter = [],
    pillarFilter = [],
    programFilter = [],
    monthFilter = null,
    yearFilter = null,
}: ReportSmartServicePillarByProgrammeProps) => {

    const {
        pillarByProgramTableData,
        loading
    } = useSmartServicePillarByProgrammeData(duspFilter, monthFilter, yearFilter, tpFilter, pillarFilter, programFilter, nadiFilter);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <NumberOfProgramCard />
                <NumberOfParticipantCard />
            </div>

            {/* Program Table */}
            <ProgramTableCard
                programTableData={pillarByProgramTableData}
            />

        </>
    )
}

export default ReportSmartServicePillarByProgramme