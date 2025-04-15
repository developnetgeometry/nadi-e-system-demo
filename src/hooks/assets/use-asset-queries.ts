import { useQuery } from "@tanstack/react-query";

import { assetClient } from "./asset-client";

import { useSiteId } from "@/hooks/use-site-id";
import { useSiteProfileId } from "@/hooks/use-site-profile-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useAssetQueries = () => {
  const userMetadata = useUserMetadata();
  const siteId = useSiteId();
  const siteProfileId = useSiteProfileId();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.user_group_name === "TP" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  let site_id: string | null = null;
  let siteProfile_id: string | null = null;
  if (isStaffUser) {
    site_id = siteId;
    siteProfile_id = siteProfileId;
  }

  const useAssetsQuery = () =>
    useQuery({
      queryKey: ["assets", organizationId, site_id, siteProfile_id],
      queryFn: () =>
        assetClient.fetchAssets(organizationId, site_id, siteProfile_id),
      enabled:
        (!!organizationId && !isStaffUser) ||
        parsedMetadata?.user_type === "super_admin" ||
        (isStaffUser && !!siteId && !!siteProfileId),
    });

  const useAssetQuery = (id: string) =>
    useQuery({
      queryKey: ["assets", id],
      queryFn: () => assetClient.fetchAssetById(id),
      enabled: !!id,
    });

  return {
    useAssetsQuery,
    useAssetQuery,
  };
};
