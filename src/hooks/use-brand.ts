import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types/brand";
import { useEffect, useState } from "react";

export function useBrand() {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("nd_brand")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching brands:", error);
        setError(error);
      } else {
        setData(data as Brand[]);
      }

      setIsLoading(false);
    };

    fetchBrands();
  }, []);

  return { data, isLoading, error };
}

// MCMC Logo fetcher hook
export function useMcmcLogo() {
  // Using a static path for MCMC logo
  return "/MCMC_Logo.png";
}

// DUSP Logo fetcher hook
export function useDuspLogo() {
  // Using a placeholder or default DUSP logo path
  // This should be updated with the actual path to the DUSP logo
  return "/placeholder.svg";
}
