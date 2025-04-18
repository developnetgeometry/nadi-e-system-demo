import { DashboardMap } from "@/components/dashboard/DashboardMap";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import ChartCard from "@/components/dashboard/ChartCard";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import DailyActivityChart from "@/components/dashboard/DailyActivityChart";

export const MemberDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardData();

  if (error) {
    console.error("Member dashboard data error:", error);
  }

  return (
    <div className="p-8 dark:bg-gray-900 dark:text-white">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Welcome back</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard title="User Growth" detailsPath="/report/usage-sessions">
          <UserGrowthChart />
        </ChartCard>

        <ChartCard title="Daily Activity" detailsPath="/admin/activity">
          <DailyActivityChart />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Global Activity Map"
          detailsPath="/report/internet-access"
        >
          <DashboardMap />
        </ChartCard>
      </div>
    </div>
  );
};
