import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ActivityLogs = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["member-activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("entity_type", "member")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching member activity logs:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Member Activity Logs</h1>
        <div className="space-y-4">
          {logs?.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {log.action}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Entity Type:</span> {log.entity_type}</p>
                  {log.changes && (
                    <p><span className="font-medium">Changes:</span> {JSON.stringify(log.changes, null, 2)}</p>
                  )}
                  <p><span className="font-medium">Time:</span> {new Date(log.created_at).toLocaleString()}</p>
                  {log.ip_address && (
                    <p><span className="font-medium">IP Address:</span> {log.ip_address}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogs;