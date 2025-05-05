import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPIHeader } from "@/components/site/kpi/KPIHeader";
import KPIDynamic from "@/components/site/kpi/KPIDynamic";

const KPI = () => {

    return (
        <DashboardLayout>
            <KPIHeader />
            <KPIDynamic />
        </DashboardLayout>
    );
};

export default KPI;