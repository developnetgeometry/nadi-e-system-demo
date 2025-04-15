
// Update the SiteDetail component to use the correct userMetadata property
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const SiteDetail = ({ siteId }: { siteId: string }) => {
  // Replace the problematic line
  const { userMetadata } = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  // Add component implementation here
  return (
    <div>
      <h1>Site Details for ID: {siteId}</h1>
      {parsedMetadata && (
        <pre>{JSON.stringify(parsedMetadata, null, 2)}</pre>
      )}
    </div>
  );
};

export default SiteDetail;
