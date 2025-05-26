import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NMSHeader } from "@/components/site/nms/NMSHeader";
import NMSDynamic from "@/components/site/nms/NMSDynamic";

const NMS = () => {
  return (
    <div>
      <NMSHeader />
      <NMSDynamic />
    </div>
  );
};

export default NMS;
