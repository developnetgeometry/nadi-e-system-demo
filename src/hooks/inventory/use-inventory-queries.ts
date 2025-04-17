import { useQuery } from "@tanstack/react-query";

import { useSiteId } from "../use-site-id";
import { useUserMetadata } from "../use-user-metadata";
import { inventoryClient } from "./inventory-client";

export const useInventoryQueries = () => {
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
  const useInventoriesQuery = () =>
    useQuery({
      queryKey: ["inventories", organizationId, site_id],
      queryFn: () => inventoryClient.fetchInventories(organizationId, site_id),
      enabled:
        (!!organizationId && !isStaffUser) ||
        parsedMetadata?.user_type === "super_admin" ||
        (isStaffUser && !!siteId),
    });

  const useInventoryQuery = (id: string) =>
    useQuery({
      queryKey: ["inventories", id],
      queryFn: () => inventoryClient.fetchInventoryById(id),
      enabled: !!id,
    });

  return {
    useInventoriesQuery,
    useInventoryQuery,
  };
};
