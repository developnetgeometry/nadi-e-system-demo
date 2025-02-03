import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardMap } from "@/components/dashboard/DashboardMap";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log("Fetching dashboard stats...");
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count');
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('count');
      
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        throw rolesError;
      }

      console.log("Stats fetched:", { profiles, roles });
      
      return {
        totalUsers: profiles?.[0]?.count || 0,
        totalRoles: roles?.[0]?.count || 0,
        activeUsers: 0,
        lastActivity: new Date().toISOString(),
      };
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
      }
    }
  });

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-8">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <DashboardStats stats={stats} isLoading={isLoading} />
      <DashboardMap />
      <DashboardCharts />
    </DashboardLayout>
  );
};

export default Dashboard;