
import { useState, useEffect } from "react";

export const useUserMetadata = () => {
  const [userMetadata, setUserMetadata] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("user_metadata");
    setUserMetadata(storedValue);
  }, []);

  return userMetadata;
};
