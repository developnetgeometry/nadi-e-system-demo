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
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
    },
    {
      title: "Total Roles",
      value: isLoading ? "Loading..." : stats?.totalRoles.toString() || "0",
      icon: Shield,
      description: "Number of defined roles",
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
    },
    {
      title: "Active Users",
      value: isLoading ? "Loading..." : stats?.activeUsers.toString() || "0",
      icon: UserCog,
      description: "Currently active users",
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
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
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
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