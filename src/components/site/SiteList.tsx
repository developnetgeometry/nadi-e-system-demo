
// Update the SiteList component to use the correct userMetadata property
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const SiteList = () => {
  // Replace the problematic line
  const { userMetadata } = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  return (
    <div>
      <h2>Site List</h2>
      {parsedMetadata && (
        <pre>{JSON.stringify(parsedMetadata, null, 2)}</pre>
      )}
    </div>
  );
};

export default SiteList;
