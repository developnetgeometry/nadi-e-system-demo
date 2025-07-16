import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchSites } from "@/components/site/hook/site-utils";
import type { Site } from "@/types/site";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import DataTable, { Column } from "@/components/ui/datatable";

interface SiteDashboardProps {
  isBookingsEnabled?: boolean;
  setSelectedSiteId?: React.Dispatch<React.SetStateAction<number | null>>;
}

export const BookingSiteDashBoard = ({
  isBookingsEnabled = false,
  setSelectedSiteId
}: SiteDashboardProps) => {
  const { user } = useAuth();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isDUSPUser =
    parsedMetadata?.user_group_name === "DUSP" &&
    !!parsedMetadata?.organization_id;
  const isMCMCUser = parsedMetadata?.user_group_name === "MCMC" || parsedMetadata?.user_type?.startsWith('sso');
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
      (isTPUser || isDUSPUser) &&
      parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;

  // Fetch sites data
  const { data: sitesData, isLoading } = useQuery({
    queryKey: ["sites", organizationId],
    queryFn: async () => {
      const sites = await fetchSites(
        organizationId,
        isTPUser,
        isDUSPUser,
        isMCMCUser
      );
      return sites;
    },
    enabled: !!organizationId || isSuperAdmin || isMCMCUser,
  });

  // Get total PC for booking
  const getTotalPC = (site: Site) => {
    return site?.nd_site[0]?.nd_site_profile?.nd_asset?.filter(pc => pc?.type_id === 3).length || 0;
  };

  // DataTable columns configuration
  const columns: Column[] = [
    {
      key: (_, i) => `${i + 1}.`,
      header: "No",
      width: "5%",
      visible: true,
      align: "center" as const
    },
    {
      key: "nd_site.0.standard_code",
      header: "Site ID",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "sitename",
      header: "Site Name",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "left" as const,
      width: "20%",
      render: (value) => value || "-"
    },
    {
      key: "nd_phases.name",
      header: "Phase",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "nd_region.eng",
      header: "Region",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    {
      key: "nd_site_address.0.nd_state.name",
      header: "State",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value) => value || "-"
    },
    ...(isDUSPUser ? [{
      key: "dusp_tp.name",
      header: "TP",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value: any) => value || "N/A"
    }] : []),
    ...((isSuperAdmin || isMCMCUser) ? [{
      key: "dusp_tp_id_display",
      header: "TP (DUSP)",
      filterable: true,
      visible: true,
      filterType: "string" as const,
      align: "center" as const,
      width: "10%",
      render: (value: any) => value || "N/A"
    }] : []),
    {
      key: (row: any) => getTotalPC(row),
      header: "Total PC",
      filterable: true,
      visible: true,
      filterType: "number" as const,
      align: "center" as const,
      width: "10%",
      render: (value, row) => getTotalPC(row)
    },
    {
      key: (row) => (
        <div className="flex space-x-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            onClick={() => setSelectedSiteId?.(row.id)}
            title="Select site for booking"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Select</span>
          </Button>
        </div>
      ),
      header: "Actions",
      align: "center" as const,
      width: "10%",
      visible: true,
    }
  ];

  // Access control logic
  if (
    parsedMetadata?.user_type !== "super_admin" &&
    !organizationId &&
    !isMCMCUser
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You do not have access to this dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-gray-500 mt-1">
            Select sites and manage PC bookings
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          data={sitesData || []}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BookingSiteDashBoard;
