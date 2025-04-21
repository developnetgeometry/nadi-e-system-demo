import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
    return (
      <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    );
  }

  return (
    <DashboardLayout>
      <SiteDetail siteId={siteId} />
    </DashboardLayout>
  );
};

export default Site;
