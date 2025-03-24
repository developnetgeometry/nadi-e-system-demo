import { useAssets } from "@/hooks/use-assets";
import { useNavigate, useParams } from "react-router-dom";

export function useAssetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { useAssetQuery } = useAssets();

  const { data: asset, isLoading, error } = useAssetQuery(id!);

  return {
    id,
    asset,
    isLoading,
    error,
    navigate,
  };
}
