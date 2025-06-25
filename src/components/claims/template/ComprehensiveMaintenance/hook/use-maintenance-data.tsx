import { getSiteManager } from "@/components/site/hook/use-site-staff";
import { supabase } from "@/integrations/supabase/client";
import {
  ClaimMaintenanceReportStatus,
  getClaimMaintenanceReportStatus,
  MaintenanceRequest,
  MaintenanceStatus,
} from "@/types/maintenance";
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
  docket_status: ClaimMaintenanceReportStatus;
  endorsed_by: string;
  // attachments_path: string[];
}

interface MaintenanceFilterOptions {
  startDate?: string | null;
  endDate?: string | null;
  duspFilter?: string | null;
  phaseFilter?: number | null;
  nadiFilter?: number[];
  tpFilter?: string | null;
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
}: MaintenanceFilterOptions) => {
  console.log("Fetching  Maintenance data with filters:", {
    startDate,
    endDate,
    duspFilter,
    phaseFilter,
    nadiFilter,
    tpFilter,
  });

  let query = supabase
    .from("nd_maintenance_request")
    .select(
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
    )
    .not("asset_id", "is", null);

  if (startDate && endDate) {
    query = query.gte("created_at", startDate).lte("created_at", endDate);
  }

  const { data, error } = await query;
  const typedData = data as MaintenanceRequest[];

  if (error) {
    console.error("Error fetching maintenance requests for claim data:", error);
    throw error;
  }

  let validData = typedData.filter((item) => item.asset && item.asset.site);

  if (tpFilter) {
    validData = validData.filter(
      (item) => item.asset.site.dusp_tp_id === tpFilter
    );
  }

  if (duspFilter) {
    validData = validData.filter(
      (item) => item.asset.site.dusp_tp.parent.id === duspFilter
    );
  }

  if (phaseFilter) {
    validData = validData.filter(
      (item) => Number(item.asset.site.phase_id) === phaseFilter
    );
  }

  if (nadiFilter && nadiFilter.length > 0) {
    validData = validData.filter((item) =>
      nadiFilter.includes(item.asset.site_id)
    );
  }

  const maintenanceDatas: MaintenanceData[] = await Promise.all(
    validData.map(async (item): Promise<MaintenanceData> => {
      function formatTimeDifference(start: string, end: string): string {
        const duration = intervalToDuration({
          start: new Date(start),
          end: new Date(end),
        });

        return formatDuration(duration, {
          format: ["days", "hours", "minutes"],
        });
      }

      let duration = "N/A";
      let docket_close = "N/A";

      if (item.status === MaintenanceStatus.Completed) {
        duration = formatTimeDifference(item.created_at, item.updated_at);
        docket_close = format(item.updated_at, "yyyy-MM-dd");
      }

      const siteManager = await getSiteManager(item.asset?.site_id);

      return {
        status: item.status,
        site_id: String(item.asset?.site_id),
        standard_code: item.asset?.site?.nd_site[0]?.standard_code,
        site_name: item.asset?.site?.sitename,
        refId: item.asset?.site?.nd_site[0]?.refid_tp,
        state: item.asset?.site?.state.name,
        docket_type: item.type?.name,
        docket_issue: item.description ? item.description : "N/A",
        docket_SLA: item.sla?.name ? item.sla?.name : "N/A",
        docket_duration: duration,
        docket_open: format(item.created_at, "yyyy-MM-dd"),
        docket_close: docket_close,
        docket_status: getClaimMaintenanceReportStatus(item.status),
        endorsed_by:
          siteManager?.nd_staff_profile?.fullname?.toUpperCase() ?? "N/A",
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
