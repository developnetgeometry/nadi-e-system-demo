import { supabase } from "@/lib/supabase";
import {
  MaintenanceRequest,
  SLACategories,
  TypeMaintenance,
} from "@/types/maintenance";

export const maintenanceClient = {
  fetchMaintenanceRequests: async (): Promise<MaintenanceRequest[]> => {
    const { data, error } = await supabase
      .from("nd_maintenance_request")
      .select(
        `*,
        nd_type_maintenance ( id, name ),
        asset:nd_asset (
          id,
          name
        )`
      );

    if (error) {
      console.error("Error fetching maintenance requests:", error);
      throw error;
    }
    const filteredData = await Promise.all(
      data.map(async (item) => {
        return {
          ...item,
          type: item.nd_type_maintenance,
          asset: item.asset,
        };
      })
    );
    return filteredData;
  },
  fetchMaintenanceTypes: async (): Promise<TypeMaintenance[]> => {
    const { data, error } = await supabase
      .from("nd_type_maintenance")
      .select("*");

    if (error) {
      console.error("Error fetching maintenance types:", error);
      throw error;
    }
    return data as TypeMaintenance[];
  },
  fetchSLACategories: async (): Promise<SLACategories[]> => {
    const { data, error } = await supabase
      .from("nd_sla_categories")
      .select("*");

    if (error) {
      console.error("Error fetching SLA categories:", error);
      throw error;
    }
    return data as SLACategories[];
  },
};
