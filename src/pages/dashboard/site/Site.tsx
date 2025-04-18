import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import SiteDetail from "@/components/site/SiteDetail";
import { useSiteProfileId } from "@/hooks/use-site-profile-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const Site = () => {
  const siteId = useSiteProfileId();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const userGroup = parsedMetadata?.user_group;

  if (userGroup !== 6) {
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
