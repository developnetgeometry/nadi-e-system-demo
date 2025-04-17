
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardMap } from "@/components/dashboard/DashboardMap";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { LayoutDashboard } from "lucide-react";

export const SuperAdminDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardData();

  if (error) {
    console.error("Super Admin dashboard data error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
      </div>

      <DashboardStats stats={stats} isLoading={isLoading} />
      <DashboardMap />
      <DashboardCharts />
    </div>
  );
};
