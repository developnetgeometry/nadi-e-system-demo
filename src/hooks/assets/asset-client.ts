import { supabase } from "@/lib/supabase";
import { Asset } from "@/types/asset";

export const assetClient = {
  fetchAssets: async (): Promise<Asset[]> => {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  fetchAssetById: async (id: string): Promise<Asset> => {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
