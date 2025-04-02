import { AssetDetailsList } from "@/components/assets/AssetDetailsList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";

const AdminAssetDashboard = () => {
  //   const navigate = useNavigate();
  //   const { user } = useAuth();
  //   const userMetadata = useUserMetadata();
  //   const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  //   const organizationId =
  //     parsedMetadata?.user_type !== "super_admin" &&
  //     parsedMetadata?.user_group_name === "TP" &&
  //     parsedMetadata?.organization_id
  //       ? parsedMetadata.organization_id
  //       : null;

  //   // Hooks must be called unconditionally
  //   const { data: siteStats, isLoading } = useQuery({
  //     queryKey: ["site-stats", organizationId],
  //     queryFn: () => fetchSites(organizationId),
  //     enabled: !!organizationId || parsedMetadata?.user_type === "super_admin", // Disable query if no access
  //   });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetailsClick = () => {
    throw new Error("Function not implemented.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Asset Management</h1>
          </div>
        </div>

        <AssetDetailsList />
        {/* <SiteFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} /> */}
      </div>
    </DashboardLayout>
  );
};

export default AdminAssetDashboard;
