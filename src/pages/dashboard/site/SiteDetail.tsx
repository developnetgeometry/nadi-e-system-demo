import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SiteDetail from "@/components/site/SiteDetail";

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <DashboardLayout>
      <SiteDetail siteId={id} />
    </DashboardLayout>
  );
};

export default SiteDetails;