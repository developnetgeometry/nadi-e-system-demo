import { useAssetQueries } from "./assets/use-asset-queries";

/**
 * Main hook for all asset-related functionality
 */
export const useAssets = () => {
  // Get all query hooks
  const { useAssetsQuery, useAssetQuery } = useAssetQueries();

  // Export everything together
  return {
    // Query hooks
    useAssetsQuery,
    useAssetQuery,
  };
};
