
import { useState, useEffect } from "react";

export const useUserMetadata = () => {
  const [userMetadata, setUserMetadata] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserMetadata = async () => {
      try {
        setIsLoading(true);
        const storedValue = localStorage.getItem("user_metadata");
        setUserMetadata(storedValue);
      } catch (error) {
        console.error("Error fetching user metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserMetadata();
  }, []);

  return { userMetadata, isLoading };
};
