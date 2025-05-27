import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types/brand";
import { useEffect, useState } from "react";
import { useUserMetadata } from "./use-user-metadata";

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
  const [logoUrl, setLogoUrl] = useState<string>("/logo-placeholder-image.png");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userMetadata = useUserMetadata();

  useEffect(() => {
    const fetchDuspLogo = async () => {
      try {
        setIsLoading(true);

        // Default to placeholder if no metadata is available
        if (!userMetadata) {
          setLogoUrl("/placeholder.svg");
          setIsLoading(false);
          return;
        }

        const parsedMetadata = JSON.parse(userMetadata);
        const organizationId = parsedMetadata?.organization_id;

        if (!organizationId) {
          setLogoUrl("/logo-placeholder-image.png");
          setIsLoading(false);
          return;
        }

        // First, get the user's organization
        const { data: userOrg, error: userOrgError } = await supabase
          .from("organizations")
          .select("id, type, logo_url, parent_id")
          .eq("id", organizationId)
          .single();

        if (userOrgError) {
          console.error("Error fetching organization:", userOrgError);
          setLogoUrl("/logo-placeholder-image.png");
          setIsLoading(false);
          return;
        }

        // If the user is from a TP organization (has parent_id), get the parent's logo (DUSP)
        if (userOrg.type === "tp" && userOrg.parent_id) {
          const { data: parentOrg, error: parentOrgError } = await supabase
            .from("organizations")
            .select("logo_url")
            .eq("id", userOrg.parent_id)
            .single();

          if (!parentOrgError && parentOrg?.logo_url) {
            setLogoUrl(parentOrg.logo_url);
          } else {
            // Fallback to placeholder if parent org has no logo
            setLogoUrl("/logo-placeholder-image.png");
          }
        } else if (userOrg.type === "dusp" && userOrg.logo_url) {
          // If user is from a DUSP, use their own organization logo
          setLogoUrl(userOrg.logo_url);
        } else {
          // Default case: use placeholder
          setLogoUrl("/logo-placeholder-image.png");
        }
      } catch (error) {
        console.error("Error in useDuspLogo hook:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDuspLogo();
  }, [userMetadata]);

  return logoUrl;
}
