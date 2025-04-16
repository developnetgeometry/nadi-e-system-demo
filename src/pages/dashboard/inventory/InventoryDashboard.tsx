import { AssetStatsCard } from "@/components/dashboard/asset/AssetStatsCard";
import { InventoryFormDialog } from "@/components/inventory/InventoryFormDialog";
import { InventoryList } from "@/components/inventory/InventoryList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useSiteId } from "@/hooks/use-site-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { supabase } from "@/lib/supabase";
import { InventoryStatsCardProps } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useState } from "react";

const AssetDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const siteId = useSiteId();
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isStaffUser = parsedMetadata?.user_group_name === "Centre Staff";

  const {
    data: inventoryStats = { total: 0, active: 0, maintenance: 0, value: 0 },
    isLoading,
  } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      console.log("Fetching inventory statistics...");
      try {
        const { data: inventories, error } = await supabase
          .from("nd_inventory")
          .select("quantity, price");

        if (error) throw error;

        const stats = {
          total: inventories.length,
          active: inventories.filter((asset) => asset.quantity > 0).length,
          value: inventories.reduce(
            (sum, asset) =>
              sum + (Number(asset.quantity) || 0) * (Number(asset.price) || 0),
            0
          ),
        };

        return stats;
      } catch (error) {
        console.error("Error fetching asset stats:", error);
        throw error;
      }
    },
  });

  const items: InventoryStatsCardProps[] = [
    {
      title: "Total Inventories",
      value: isLoading ? "Loading..." : inventoryStats?.total.toString() || "0",
      description: "Inventory registered",
    },
    {
      title: "Active Inventories",
      value: isLoading
        ? "Loading..."
        : inventoryStats?.active.toString() || "0",
      color: "green-600",
      description: "Currently in use",
    },
    {
      title: "Value of Inventories",
      value: isLoading
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
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Inventory
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AssetStatsCard key={item.title} {...item} />
          ))}
        </div>

        <InventoryList />
        <InventoryFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default AssetDashboard;
