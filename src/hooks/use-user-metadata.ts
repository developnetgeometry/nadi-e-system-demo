
import { useState, useEffect } from "react";

export interface UserMetadata {
  user_type?: string;
  user_group_name?: string;
  organization_id?: string;
  site_id?: string;
  [key: string]: any;
}

export const useUserMetadata = () => {
  const [userMetadata, setUserMetadata] = useState<string | null>(null);
  const [parsedMetadata, setParsedMetadata] = useState<UserMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem("user_metadata");
      setUserMetadata(storedValue);
      
      if (storedValue) {
        try {
          const parsed = JSON.parse(storedValue);
          setParsedMetadata(parsed);
        } catch (parseError) {
          console.error("Error parsing user metadata:", parseError);
          setParsedMetadata(null);
        }
      }
      
      console.log("Retrieved user metadata:", storedValue ? "Found" : "Not found");
    } catch (error) {
      console.error("Error accessing user metadata:", error);
      setUserMetadata(null);
      setParsedMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userMetadata, parsedMetadata, isLoading };
};
