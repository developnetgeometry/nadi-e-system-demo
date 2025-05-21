import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const useSiteIdFromSiteProfile = (siteProfileId: string) => {
  const [siteId, setSiteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteId = async () => {
      if (!siteProfileId) return;

      try {
        const { data: site, error: siteError } = await supabase
          .from("nd_site")
          .select("id")
          .eq("site_profile_id", Number(siteProfileId))
          .single();

        if (siteError) throw siteError;

        setSiteId(String(site.id));
      } catch (error) {
        console.error("Error fetching site ID:", error);
      }
    };

    fetchSiteId();
  }, [siteProfileId]);

  return siteId;
};
