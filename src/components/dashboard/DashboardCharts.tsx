import { UserGrowthChart } from './charts/UserGrowthChart';
import { DailyActivityChart } from './charts/DailyActivityChart';
import { UserStatusChart } from './charts/UserStatusChart';
import { SystemStatusCard } from './charts/SystemStatusCard';

export const DashboardCharts = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-8">
      <UserGrowthChart />
      <DailyActivityChart />
      <UserStatusChart />
      <SystemStatusCard />
    </div>
  );
};