import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useSiteProfile = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("nd_site_profile")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteProfile();
  }, [id]);

  return { data, loading, error };
};