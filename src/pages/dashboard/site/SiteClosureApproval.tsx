
// Update the SiteClosureApproval component to use the correct userMetadata property
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const SiteClosureApproval = () => {
  // Replace the problematic line
  const { userMetadata } = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  return (
    <DashboardLayout>
      <div>
        <h1>Site Closure Approval</h1>
        {parsedMetadata && (
          <pre>{JSON.stringify(parsedMetadata, null, 2)}</pre>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SiteClosureApproval;
