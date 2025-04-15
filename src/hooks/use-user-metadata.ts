
import { useState, useEffect } from "react";

export const useUserMetadata = () => {
  const [userMetadata, setUserMetadata] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem("user_metadata");
      setUserMetadata(storedValue);
      console.log("Retrieved user metadata:", storedValue ? "Found" : "Not found");
    } catch (error) {
      console.error("Error accessing user metadata:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userMetadata, isLoading };
};
