import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useAssetCategory = () => {
  return useQuery({
    queryKey: ["asset-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_asset_categories");

      if (error) {
        console.error("Error fetching asset categories:", error);
        throw error;
      }

      return data.map((item: { category: string }) => item.category); // Return category names
    },
  });
};
