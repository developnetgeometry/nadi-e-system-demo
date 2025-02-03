import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardMap } from "@/components/dashboard/DashboardMap";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-8">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardStats stats={stats} isLoading={isLoading} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardMap />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardCharts />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Dashboard;