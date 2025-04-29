import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceList } from "@/components/maintenance/MaintenanceList";
import { MaintenanceRequestFormDialog } from "@/components/maintenance/MaintenanceRequestFormDialog";
import { Button } from "@/components/ui/button";
import { useMaintennance } from "@/hooks/use-maintenance";
import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { Plus } from "lucide-react";

import { useEffect, useState } from "react";

const MaintenanceDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const siteId = useSiteId();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  const { useMaintenanceRequestsQuery } = useMaintennance();

  const {
    data: maintenanceRequests,
    isLoading: isLoadingMaintenanceRequests,
    error: errorMaintenanceRequests,
    refetch: refetchMaintenanceRequests,
  } = useMaintenanceRequestsQuery();

  useEffect(() => {
    if (!isDialogOpen) {
      refetchMaintenanceRequests();
    }
  }, [isDialogOpen, refetchMaintenanceRequests]);

  if (errorMaintenanceRequests) {
    console.error(errorMaintenanceRequests);
    return <div>Error fetching maintenance requests</div>;
  }

  const displayAssets = isStaffUser && !siteId ? [] : maintenanceRequests;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Asset Maintenance</h1>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
        <MaintenanceList
          maintenanceRequests={displayAssets}
          isLoadingMaintenanceRequests={isLoadingMaintenanceRequests}
          refetch={refetchMaintenanceRequests}
        />
        <MaintenanceRequestFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceDashboard;
