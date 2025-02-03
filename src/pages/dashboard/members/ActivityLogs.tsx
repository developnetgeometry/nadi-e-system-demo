import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const ActivityLogs = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usage_sessions")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="space-y-4">
        {sessions?.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {session.profiles?.full_name || "Unknown User"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Session Type:</span> {session.session_type}</p>
                <p><span className="font-medium">Start Time:</span> {new Date(session.start_time).toLocaleString()}</p>
                {session.end_time && (
                  <p><span className="font-medium">End Time:</span> {new Date(session.end_time).toLocaleString()}</p>
                )}
                <p><span className="font-medium">IP Address:</span> {session.ip_address}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;