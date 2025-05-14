import { useQuery } from "@tanstack/react-query";

import { assetClient } from "./asset-client";

import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useAssetQueries = () => {
  const userMetadata = useUserMetadata();
  const siteId = useSiteId();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.user_group_name === "TP" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  let site_id: string | null = null;
  if (isStaffUser) {
    site_id = siteId;
  }

  const useAssetsQuery = () =>
    useQuery({
      queryKey: ["assets", organizationId, site_id],
      queryFn: () => assetClient.fetchAssets(organizationId, site_id),
      enabled:
        (!!organizationId && !isStaffUser) ||
        parsedMetadata?.user_type === "super_admin" ||
        (isStaffUser && !!siteId),
    });

  const useAssetsByTypeQuery = (typeId: number) => 
    useQuery({
      queryKey: ["assets", typeId],
      queryFn: () => assetClient.fetchAssetsByType(typeId, Number(siteId)),
      enabled: 
        !!typeId || (!!organizationId && !isStaffUser) ||
        parsedMetadata?.user_type === "super_admin" ||
        (isStaffUser && !!siteId),
    });

  const useAssetQuery = (id: number) =>
    useQuery({
      queryKey: ["assets", id],
      queryFn: () => assetClient.fetchAssetById(id),
      enabled: !!id,
    });

  const useAssetsInTpsSites = (tps_sites_ids: number[], assetType: number) => 
    useQuery({
      queryKey: ["tpsAssets"],
      queryFn: () => assetClient.getAllPcInTpsSite(tps_sites_ids, assetType)
    });

  return {
    useAssetsQuery,
    useAssetQuery,
    useAssetsByTypeQuery,
    useAssetsInTpsSites
  };
};
