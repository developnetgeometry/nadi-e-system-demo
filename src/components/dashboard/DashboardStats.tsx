import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Activity, UserCog } from "lucide-react";
import { DashboardStatsData } from "@/types/dashboard";

interface DashboardStatsProps {
  stats?: DashboardStatsData;
  isLoading: boolean;
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
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
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};