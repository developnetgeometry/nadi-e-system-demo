import { Users, Shield, Activity, UserCog } from "lucide-react";
import { DashboardStatsData } from "@/types/dashboard";
import { StatsCard } from "./StatsCard";

interface DashboardStatsProps {
  stats?: DashboardStatsData;
  isLoading: boolean;
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  console.log("Rendering DashboardStats with:", { stats, isLoading });

  const items = [
    {
      title: "Total Users",
      value: isLoading ? "Loading..." : stats?.totalUsers.toString() || "0",
      icon: Users,
      description: "Total registered users in the system",
    },
    {
      title: "Total Roles",
      value: isLoading ? "Loading..." : stats?.totalRoles.toString() || "0",
      icon: Shield,
      description: "Number of defined roles",
    },
    {
      title: "Active Users",
      value: isLoading ? "Loading..." : stats?.activeUsers.toString() || "0",
      icon: UserCog,
      description: "Currently active users",
    },
    {
      title: "Last Activity",
      value: isLoading 
        ? "Loading..." 
        : stats?.lastActivity 
          ? new Date(stats.lastActivity).toLocaleDateString() 
          : "No activity",
      icon: Activity,
      description: "Most recent system activity",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatsCard key={item.title} {...item} />
      ))}
    </div>
  );
};