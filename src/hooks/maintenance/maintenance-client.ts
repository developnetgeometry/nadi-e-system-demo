import { supabase } from "@/lib/supabase";
import {
  MaintenanceRequest,
  MaintenanceStatus,
  SLACategories,
  TypeMaintenance,
} from "@/types/maintenance";

export const maintenanceClient = {
  fetchMaintenanceRequests: async (
    type?: string,
    statuses?: MaintenanceStatus[],
    organizationId?: string | null,
    siteId?: string | null,
    vendorId?: number | null
  ): Promise<MaintenanceRequest[]> => {
    let query = supabase
      .from("nd_maintenance_request")
      .select(
        `*,
        nd_type_maintenance ( id, name ),
        sla:nd_sla_categories ( id, name, min_day, max_day ),
        asset:nd_asset (
          *,
          site:nd_site_profile (
            *,
            dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*))
          )
        ),
        vendor:nd_vendor_profile ( id, business_name, registration_number, business_type, phone_number )`
      )
      .order("updated_at", { ascending: false });

    if (type) {
      query = query.like("docket_type", type);
    }

    if (statuses && statuses.length > 0) {
      query = query.in("status", statuses);
    }

    if (siteId) {
      query = query.eq("nd_asset.site_id", siteId);
    }

    if (vendorId) {
      query = query.eq("vendor_id", vendorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching maintenance requests:", error);
      throw error;
    }
    const filteredData = await Promise.all(
      data
        .filter((item) => item.asset && item.asset.site_id)
        .map(async (item) => {
          return {
            ...item,
            type: item.nd_type_maintenance,
            sla: item.sla,
            asset: item.asset,
          };
        })
    );

    return filteredData;
  },
  fetchMaintenanceRequestById: async (
    id: string
  ): Promise<MaintenanceRequest> => {
    const { data, error } = await supabase
      .from("nd_maintenance_request")
      .select(
        `*,
        nd_type_maintenance ( id, name ),
        sla:nd_sla_categories ( id, name ),
        asset:nd_asset (
          *,
          site:nd_site_profile (
            *,
            dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*))
          )
        ),
        vendor:nd_vendor_profile ( id, business_name, registration_number, business_type, phone_number )`
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching maintenance request:", error);
      throw error;
    }

    return {
      ...data,
      type: data.nd_type_maintenance,
      sla: data.sla,
      asset: data.asset,
    };
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
