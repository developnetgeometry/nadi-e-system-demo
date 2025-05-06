import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsageHeader } from "@/components/site/usage/UsageHeader";
import UsageDynamic from "@/components/site/usage/UsageDynamic";

const Usage = () => {
    return (
        <DashboardLayout>
            <UsageHeader />
            <UsageDynamic />
        </DashboardLayout>
    );
};

export default Usage;