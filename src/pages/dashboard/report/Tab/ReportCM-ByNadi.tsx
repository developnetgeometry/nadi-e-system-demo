import { DocketBarGraph_byNADI } from '@/components/reports/component/comprehensive-maintainance/DocketBarGraph_byNADI';
import { DocketCard_byNADI } from '@/components/reports/component/comprehensive-maintainance/DocketCard_byNADI';

import { useDocketData } from '@/hooks/report/use-cm-bynadi-data';


type ReportCMByNadiProps = {
    duspFilter?: (string | number)[];
    phaseFilter?: string | number | null;
    nadiFilter?: (string | number)[];
    tpFilter?: (string | number)[];
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
}

const ReportCMByNadi = ({
    duspFilter = [],
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = [],
    monthFilter = null,
    yearFilter = null,
}: ReportCMByNadiProps) => {

    const {
        docketStatusData,
        loading,
        error
    } = useDocketData(duspFilter,nadiFilter, phaseFilter, monthFilter, yearFilter, tpFilter);

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 lg:col-span-8">
                <DocketBarGraph_byNADI
                    docketStatusData={docketStatusData}
                />
            </div>
            <div className="col-span-4 lg:col-span-4">
                <DocketCard_byNADI />
            </div>
        </div>

    )
}

export default ReportCMByNadi;