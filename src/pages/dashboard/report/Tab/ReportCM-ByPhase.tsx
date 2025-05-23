import { DocketBarGraph_byPhase } from '@/components/reports/component/comprehensive-maintainance/DocketBarGraph_byPhase';
import { DocketCard_byPhase } from '@/components/reports/component/comprehensive-maintainance/DocketCard_byPhase';

import { useDocketData } from '@/hooks/report/use-cm-byphase-data';

type ReportCMByPhaseProps = {
    duspFilter?: (string | number)[];
    phaseFilter?: string | number | null;
    nadiFilter?: (string | number)[];
    tpFilter?: (string | number)[];
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
}

const ReportCMByPhase = ({
    duspFilter = [],
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = [],
    monthFilter = null,
    yearFilter = null,
}: ReportCMByPhaseProps
) => {


    const {
        docketStatusData,
        loading,
        error
    } = useDocketData(duspFilter, nadiFilter, phaseFilter, monthFilter, yearFilter, tpFilter);
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Docket Status Chart */}
            <div className="col-span-8 lg:col-span-8">
                <DocketBarGraph_byPhase
                    docketStatusData={docketStatusData}
                />
            </div>

            {/* Total Docket Open Card */}
            <div className="col-span-4 lg:col-span-4">
                <DocketCard_byPhase />
            </div>
        </div>
    )
}

export default ReportCMByPhase;