import { supabase } from "@/lib/supabase";
import { Brand } from "@/types/brand";
import { useEffect, useState } from "react";

export function useLocation() {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("nd_location")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching locations:", error);
        setError(error);
      } else {
        setData(data as Brand[]);
      }

      setIsLoading(false);
    };

    fetchLocations();
  }, []);

  return { data, isLoading, error };
}
