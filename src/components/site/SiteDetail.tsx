
// Update the SiteDetail component to use the correct userMetadata property
import { useUserMetadata } from "@/hooks/use-user-metadata";

// Replace the problematic line
const { userMetadata } = useUserMetadata();
const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
