import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetCategory, AssetType } from "@/types/asset";
import { Site } from "@/types/site";

export const assetClient = {
  fetchAssets: async (
    organizationId: string | null,
    siteId: string | null
  ): Promise<Asset[]> => {
    let query = supabase
      .from("nd_asset")
      .select(
        `*,
        nd_asset_type ( id, name ),
        nd_brand!nd_asset_nd_brand_fk  ( id, name ),
        site:nd_site_profile (
          *,
          dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*))
        )`
      )
      .is("deleted_at", null);

    if (siteId) {
      query = query.eq("site_id", Number(siteId));
    }

    query = query.order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }

    const formatProfile = (profile: Site) => ({
      ...profile,
      dusp_tp_id_display: profile?.dusp_tp?.parent
        ? `${profile?.dusp_tp?.name} (${profile.dusp_tp?.parent.name})`
        : profile?.dusp_tp?.name ?? "N/A",
    });

    const filteredData = await Promise.all(
      data.map(async (item) => {
        const profile = formatProfile(item.site);

        return {
          ...item,
          type: item.nd_asset_type,
          brand: item.nd_brand,
          site: profile ? { ...profile } : null,
        };
      })
    );

    return filteredData;
  },
  fetchAssetsByName: async (
    organizationId: string | null,
    siteId: string | null,
    name: string | null,
    isActive?: boolean | null,
    selectedSiteId?: string | null
  ): Promise<Asset[]> => {
    if (!name) return [];

    let query = supabase
      .from("nd_asset")
      .select(
        `*,
        nd_asset_type ( id, name ),
        nd_brand!nd_asset_nd_brand_fk  ( id, name ),
        site:nd_site_profile (
          *,
          dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*))
        )`
      )
      .is("deleted_at", null);

    if (siteId || selectedSiteId) {
      query = query.eq("site_id", Number(siteId || selectedSiteId));
    }

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    if (isActive) {
      query = query.eq("is_active", isActive);
    }

    query = query.limit(5).order("id");

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching assets by name:", error);
      throw error;
    }

    const formatProfile = (profile) => ({
      ...profile,
      dusp_tp_id_display: profile?.dusp_tp?.parent
        ? `${profile.dusp_tp.name} (${profile.dusp_tp.parent.name})`
        : profile?.dusp_tp?.name ?? "N/A",
    });

    const filteredData = await Promise.all(
      data.map(async (item) => {
        const profile = formatProfile(item.site);

        return {
          ...item,
          type: item.nd_asset_type,
          brand: item.nd_brand,
          site: profile ? { ...profile } : null,
        };
      })
    );

    return filteredData;
  },

  fetchAssetById: async (id: number): Promise<Asset> => {
    const { data, error } = await supabase
      .from("nd_asset")
      .select(
        `*,
        nd_asset_type ( id, name ),
        nd_brand!nd_asset_nd_brand_fk  ( id, name, brand_type ),
        site:nd_site_profile (
          *,
          dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*))
        )`
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching asset:", error);
      throw error;
    }

    return {
      ...data,
      type: data.nd_asset_type,
      brand: data.nd_brand,
      site: data.site,
    };
  },

  fetchSuperAdminAsset: async (isSuperAdmin: boolean) => {
    if (!isSuperAdmin) {
      throw new Error(
        "Error dannied: you don't have permission to get all asset"
      );
    }

    const assetTypePcsName = "PC";
    const { data: assetTypeData, error: errorAssetType } = await supabase
      .from("nd_asset_type")
      .select("id")
      .eq("name", assetTypePcsName)
      .single();
    if (errorAssetType) throw errorAssetType;
    const assetTypePcsId = assetTypeData.id;

    const { data, error } = await supabase
      .from("nd_asset")
      .select(
        `
        *,
        nd_brand (
            id,
            name,
            nd_brand_type (
              id,
              name
            )
          ),
        nd_site_profile (*),
        nd_booking (*, nd_site_space (*, nd_space (*))),
        nd_space (*),
        nd_asset_type!inner (
            category_id
          )  
      `
      )
      .eq("type_id", assetTypePcsId);

    if (error) throw error;

    return data;
  },

  fetchAssetByName: async (assetName: string, siteId: number) => {
    const { data, error } = await supabase
      .from("nd_asset")
      .select(`*, nd_site_profile(*, nd_site_space(*, nd_space(*)))`)
      .eq("name", assetName);

    if (error) {
      console.error("Error fetching asset by name", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { id: null, site_space_id: null };
    }

    const matched = data.find((item) => {
      const siteProfile = item?.nd_site_profile;
      if (!siteProfile || siteProfile.id !== siteId) return false;

      return siteProfile.nd_site_space?.some(
        (space) => space.nd_space?.id === item.location_id
      );
    });

    if (!matched) {
      return { id: null, site_space_id: null };
    }

    const matchedSiteSpace = matched.nd_site_profile?.nd_site_space?.find(
      (space) => space.nd_space?.id === matched.location_id
    );

    return {
      id: matched.id ?? null,
      site_space_id: matchedSiteSpace?.id ?? null,
    };
  },

  fetchAssetCategories: async (): Promise<AssetCategory[]> => {
    const { data, error } = await supabase
      .from("nd_asset_categories")
      .select("*");

    if (error) {
      console.error("Error fetching asset categories:", error);
      throw error;
    }
    return data;
  },

  fetchAssetTypes: async (): Promise<AssetType[]> => {
    const { data, error } = await supabase.from("nd_asset_type").select("*");

    if (error) {
      console.error("Error fetching asset types:", error);
      throw error;
    }
    return data;
  },

  fetchAssetTypesWithCategory: async (): Promise<AssetType[]> => {
    const { data, error } = await supabase.from("nd_asset_type").select(`
      *,
      nd_asset_categories ( id, name )
    `);

    if (error) {
      console.error("Error fetching asset types:", error);
      throw error;
    }

    return data.map((item) => ({
      ...item,
      category: item.nd_asset_categories,
    }));
  },

  fetchAssetsByType: async (siteProfileId: number) => {
    if (siteProfileId) {
      const assetTypePcsName = "PC";
      const { data: assetTypeData, error: errorAssetType } = await supabase
        .from("nd_asset_type")
        .select("id")
        .eq("name", assetTypePcsName)
        .single();
      if (errorAssetType) throw errorAssetType;
      const assetTypePcsId = assetTypeData.id;

      const { data, error } = await supabase
        .from("nd_asset")
        .select(
          `
          *,
          nd_brand (
            id,
            name,
            nd_brand_type (
              id,
              name
            )
          ),
          nd_site_profile (*),
          nd_space (*),
          nd_booking (
            *,
            nd_site_space (*, nd_space (*))
          )
        `
        )
        .eq("site_id", siteProfileId)
        .eq("type_id", assetTypePcsId);

      if (error) throw error;

      return data;
    }
  },

  fetchAssetsBySiteId: async (
    siteProfileId: number | null,
    siteId?: number
  ) => {
    let site_id = siteProfileId;
    const assetTypePcsName = "PC";
    const { data: assetTypeData, error: errorAssetType } = await supabase
      .from("nd_asset_type")
      .select("id")
      .eq("name", assetTypePcsName)
      .single();
    if (errorAssetType) throw errorAssetType;
    const assetTypePcsId = assetTypeData.id;

    if (!site_id) {
      const { data: siteProfile, error: errorSiteProfile } = await supabase
        .from("nd_site")
        .select("site_profile_id")
        .eq("id", siteId)
        .single();

      if (errorSiteProfile) throw errorSiteProfile;

      site_id = siteProfile?.site_profile_id;
    }

    const { data, error } = await supabase
      .from("nd_asset")
      .select(
        `
        *, 
        nd_brand (
          id,
          name,
          nd_brand_type (
            id,
            name
          )
        ),
        nd_site_profile (*),
        nd_space (*),
        nd_booking (
          *,
          nd_site_space (*, nd_space (*))
        )
      `
      )
      .eq("site_id", site_id)
      .eq("type_id", assetTypePcsId);

    if (error) throw error;
    console.log("data assets", data);
    return data;
  },

  fetchAssetsInTpsSites: async (tpOrgId: string) => {
    // Fetch all profile eq tpOrgId and join site table, inside site join asset

    const { data, error } = await supabase
      .from("nd_site_profile")
      .select(
        `
          nd_asset (
              *,
              nd_booking(*, nd_site_space (*, nd_space (*))),
              nd_site_profile (*)
            )
      `
      )
      .eq("dusp_tp_id", tpOrgId);

    if (error) throw error;

    const assetsOnly = data.flatMap((siteItem) => siteItem.nd_asset);

    return assetsOnly;
  },

  toggleAssetActiveStatus: async (
    assetId: string,
    currentStatus: boolean
  ): Promise<void> => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      const { error } = await supabase
        .from("nd_asset")
        .update({ is_active: !!newStatus })
        .eq("id", assetId);

      if (error) throw error;
    } catch (error) {
      console.error("Error toggling site active status:", error);
      throw error;
    }
  },
};
