import { InventoryStatsCard } from "@/components/dashboard/inventory/InventoryStatsCard";
import { InventoryFormDialog } from "@/components/inventory/InventoryFormDialog";
import { InventoryList } from "@/components/inventory/InventoryList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useInventories } from "@/hooks/use-inventories";
import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { InventoryStatsCardProps, InventoryStatsData } from "@/types/inventory";
import { Plus, Settings } from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const InventoryDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const siteId = useSiteId();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  let inventoryStats: InventoryStatsData = {
    total: 0,
    active: 0,
    maintenance: 0,
    value: 0,
  };

  const { useInventoriesQuery } = useInventories();

  const {
    data: inventories,
    isLoading: isLoadingInventories,
    error: errorInventories,
    refetch,
  } = useInventoriesQuery();

  useEffect(() => {
    if (!isDialogOpen) {
      refetch();
    }
  }, [isDialogOpen, refetch]);

  if (errorInventories) {
    console.error("Error fetching inventories:", errorInventories);
    return <div>Error fetching inventories</div>;
  }

  const displayInventories = isStaffUser && !siteId ? [] : inventories;

  if (!isLoadingInventories && inventories) {
    if (displayInventories.length > 0) {
      inventoryStats = {
        total: displayInventories.length,
        active: displayInventories.filter((a) => a?.quantity > 0).length,
        maintenance: displayInventories.filter((a) => a?.quantity === 0).length,
        value: displayInventories.reduce(
          (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.price) || 0),
          0
        ),
      };
    }
  }

  const items: InventoryStatsCardProps[] = [
    {
      title: "Total Inventories",
      value: isLoadingInventories
        ? "Loading..."
        : inventoryStats?.total.toString() || "0",
      description: "Inventory registered",
    },
    {
      title: "Active Inventories",
      value: isLoadingInventories
        ? "Loading..."
        : inventoryStats?.active.toString() || "0",
      color: "green-600",
      description: "Currently in use",
    },
    {
      title: "Value of Inventories",
      value: isLoadingInventories
        ? "Loading..."
        : "RM " + inventoryStats?.value.toString() || "0",
      color: "red-600",
      description: "Total value of all inventories",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/site-management/inventory-management/settings">
              <Button onClick={() => {}}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Inventory
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <InventoryStatsCard key={item.title} {...item} />
          ))}
        </div>

        <InventoryList
          inventories={displayInventories}
          isLoadingInventories={isLoadingInventories}
          refetch={refetch}
        />
        <InventoryFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default InventoryDashboard;
