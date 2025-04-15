import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SiteDetail from "@/components/site/SiteDetail";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const Site = () => {
  const siteId = useSiteId();
  const { userMetadata, isLoading } = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group_name;

  if (!userGroup?.startsWith("Centre Staff")) {
    return <div>You do not have access to this dashboard.</div>;
  }

  if (!siteId) {
    return <SettingsLoading />;
  }

  return (
    <DashboardLayout>
      <SiteDetail siteId={siteId} />
    </DashboardLayout>
  );
};

export default Site;
