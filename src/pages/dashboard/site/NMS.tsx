import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NMSHeader } from "@/components/site/nms/NMSHeader";
import NMSDynamic from "@/components/site/nms/NMSDynamic";

const NMS = () => {

    return (
        <DashboardLayout>
            <NMSHeader />
            <NMSDynamic />
        </DashboardLayout>
    );
};

export default NMS;