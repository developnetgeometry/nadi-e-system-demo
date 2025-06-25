import { supabase } from "@/integrations/supabase/client";
import { MaintenanceRequest, MaintenanceStatus } from "@/types/maintenance";
import { format, formatDuration, intervalToDuration } from "date-fns";

export interface MaintenanceData {
  status: string;
  site_id: string;
  standard_code: string;
  site_name: string;
  refId: string;
  state: string;
  docket_type: string;
  docket_issue: string;
  docket_SLA: string;
  docket_duration: string;
  docket_open: string;
  docket_close: string;
  docket_status: MaintenanceStatus;
  // attachments_path: string[];
}

/**
 * Data fetching function (non-hook) for Maintenance data
 * This function is used by Maintenance.tsx to fetch Maintenance data directly without React hooks
 */
export const fetchMaintenanceData = async ({
  startDate = null,
  endDate = null,
  duspFilter = null,
  phaseFilter = null,
  nadiFilter = [],
  tpFilter = null,
}) => {
  console.log("Fetching  Maintenance data with filters:", {
    startDate,
    endDate,
    duspFilter,
    phaseFilter,
    nadiFilter,
    tpFilter,
  });

  let query = supabase.from("nd_maintenance_request").select(
    `*,
    type:nd_type_maintenance ( id, name ),
    sla:nd_sla_categories ( id, name, min_day, max_day ),
    asset:nd_asset (
        *,
        site:nd_site_profile (
            *,
            state:nd_state ( id, name ),
            dusp_tp:organizations!dusp_tp_id(id, name, parent:parent_id(*)),
            nd_site:nd_site ( id, standard_code, refid_tp )
        )
    )`
  );

  query = query.not("asset_id", "is", null);
  query = query.not("asset.site_id", "is", null);
  query = query.not("sla_id", "is", null);

  if (startDate && endDate) {
    query = query.gte("created_at", startDate).lte("created_at", endDate);
  }

  if (tpFilter) {
    query = query.eq("asset.site.dusp_tp_id", tpFilter);
  }

  // if (phaseFilter) {
  //   query = query.eq("asset.site.phase_id", phaseFilter);
  // }

  // if (duspFilter) {
  //   query = query.eq("asset.site.dusp_tp.parent_id", duspFilter);
  // }

  // if (nadiFilter && nadiFilter.length > 0) {
  //   query = query.in("asset.site_id", nadiFilter);
  // }

  const { data, error } = await query;
  const typedData = data as MaintenanceRequest[];

  console.log("typedData", data);

  if (error) {
    console.error("Error fetching maintenance requests for claim data:", error);
    throw error;
  }
  const maintenanceDatas: MaintenanceData[] = await Promise.all(
    typedData.map(async (item): Promise<MaintenanceData> => {
      function formatTimeDifference(start: string, end: string): string {
        const duration = intervalToDuration({
          start: new Date(start),
          end: new Date(end),
        });

        return formatDuration(duration, {
          format: ["days", "hours", "minutes"],
        });
      }

      const duration = formatTimeDifference(item.created_at, item.updated_at);

      return {
        status: item.status,
        site_id: String(item.asset?.site_id),
        standard_code: item.asset?.site?.nd_site[0]?.standard_code,
        site_name: item.asset?.site?.sitename,
        refId: item.asset?.site?.nd_site[0]?.refid_tp,
        state: item.asset?.site?.state.name,
        docket_type: item.type?.name,
        docket_issue: item.description ? item.description : "N/A",
        docket_SLA: item.sla?.name,
        docket_duration: duration,
        docket_open: format(item.created_at, "yyyy-MM-dd"),
        docket_close: format(item.updated_at, "yyyy-MM-dd"),
        docket_status: item.status,
      };
    })
  );

  // Return the data in the same format as the hook
  return {
    maintenance: maintenanceDatas as MaintenanceData[],
  };
};

// For backward compatibility
export default fetchMaintenanceData;
