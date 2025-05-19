import { useQuery } from "@tanstack/react-query";

import { assetClient } from "./asset-client";

import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const useAssetQueries = () => {
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.user_group_name === "TP" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  const site_id = useSiteId(isStaffUser);

  const useAssetsQuery = () =>
    useQuery({
      queryKey: ["assets", organizationId, site_id],
      queryFn: () => assetClient.fetchAssets(organizationId, site_id),
      enabled:
        (!!organizationId && !isStaffUser) ||
        parsedMetadata?.user_type === "super_admin" ||
        (isStaffUser && !!site_id),
    });

  const useAssetsByNameQuery = (name: string, isActive?: boolean) =>
    useQuery({
      queryKey: ["assets", organizationId, site_id, name],
      queryFn: () =>
        assetClient.fetchAssetsByName(organizationId, site_id, name, isActive),
      enabled:
        !!name &&
        (!!organizationId || parsedMetadata?.user_type === "super_admin") &&
        (!isStaffUser || !!site_id),
    });

  const useAssetsByTypeQuery = (siteId: number) => 
    useQuery({
      queryKey: ["assets", siteId],
      queryFn: () => assetClient.fetchAssetsByType(siteId),
      enabled: !!siteId
    });

  const useAssetQuery = (id: number) =>
    useQuery({
      queryKey: ["assets", id],
      queryFn: () => assetClient.fetchAssetById(id),
      enabled: !!id,
    });

  const useAllAssets = (isSuperAdmin: boolean) =>
    useQuery({
      queryKey: ["allAssets"],
      queryFn: () => assetClient.fetchSuperAdminAsset(isSuperAdmin),
      enabled: isSuperAdmin
    })

  const useAssetBySite = (tps_sites_id: number) => 
    useQuery({
      queryKey: ["tpsAssets", tps_sites_id],
      queryFn: () => assetClient.fetchAssetsBySiteId(tps_sites_id),
      enabled: !!tps_sites_id
    });

  return {
    useAssetsQuery,
    useAssetsByNameQuery,
    useAssetQuery,
    useAssetsByTypeQuery,
    useAssetBySite,
    useAllAssets
  };
};
