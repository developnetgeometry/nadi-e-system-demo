import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { 
  Users, 
  Shield, 
  Activity,
  UserCog,
  LayoutDashboard 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: users } = await supabase
        .from('users')
        .select('count');
      
      const { data: roles } = await supabase
        .from('roles')
        .select('count');
      
      return {
        totalUsers: users?.[0]?.count || 0,
        totalRoles: roles?.[0]?.count || 0,
        activeUsers: 0, // To be implemented
        lastActivity: new Date().toISOString(),
      };
    },
  });

  const dashboardCards = [
    {
      title: "Total Users",
      value: isLoading ? "Loading..." : stats?.totalUsers,
      icon: Users,
      description: "Total registered users in the system",
    },
    {
      title: "User Roles",
      value: isLoading ? "Loading..." : stats?.totalRoles,
      icon: Shield,
      description: "Available user roles",
    },
    {
      title: "Active Users",
      value: isLoading ? "Loading..." : stats?.activeUsers,
      icon: UserCog,
      description: "Users active in last 24h",
    },
    {
      title: "Last Activity",
      value: isLoading ? "Loading..." : new Date(stats?.lastActivity || "").toLocaleDateString(),
      icon: Activity,
      description: "Most recent system activity",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 p-8">
            <SidebarTrigger />
            <div className="flex items-center gap-4 mb-8">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dashboardCards.map((card) => (
                <Card key={card.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Activity log will be implemented in Phase 2
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Status</span>
                      <span className="text-sm font-medium text-green-500">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-sm font-medium">Today, 03:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Server Load</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;