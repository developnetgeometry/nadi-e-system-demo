import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteProfilesByIds = (siteIds: number[]) => {
  const { data: siteProfiles, isLoading, error } = useQuery({
    queryKey: ["siteProfiles", siteIds],
    queryFn: async () => {
      if (!siteIds || siteIds.length === 0) return [];

      const { data, error } = await supabase
        .from("nd_site_profile")
        .select("refid_mcmc, refid_tp, fullname, is_active")
        .in("id", siteIds); // Filter by the array of site_ids

      if (error) {
        console.error("Error fetching site profiles:", error);
        throw error;
      }

      return data;
    },
    enabled: siteIds.length > 0, // Only run the query if siteIds is not empty
  });

  return { siteProfiles, isLoading, error };
};