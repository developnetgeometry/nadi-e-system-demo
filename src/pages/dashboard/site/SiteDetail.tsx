
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SiteDetail } from "@/components/site/SiteDetail";
import { SettingsLoading } from "@/components/settings/SettingsLoading";

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <SettingsLoading />;
  }
  return (
    <DashboardLayout>
      <SiteDetail siteId={id} />
    </DashboardLayout>
  );
};

export default SiteDetails;
