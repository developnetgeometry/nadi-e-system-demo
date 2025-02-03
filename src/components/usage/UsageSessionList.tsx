import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Monitor, Clock, User, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsageSession {
  id: string;
  session_type: string;
  start_time: string;
  end_time: string | null;
  ip_address: string;
  user_agent: string;
  device_info: Record<string, any> | null;
  actions_performed: Record<string, any> | null;
}

export const UsageSessionList = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["usage_sessions"],
    queryFn: async () => {
      console.log("Fetching usage sessions...");
      const { data, error } = await supabase
        .from("usage_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching usage sessions:", error);
        throw error;
      }
      console.log("Fetched usage sessions:", data);
      return data as UsageSession[];
    },
  });

  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "Ongoing";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    return `${minutes} minutes`;
  };

  if (isLoading) {
    return <div>Loading usage sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usage Sessions</h2>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="login">Login Sessions</SelectItem>
              <SelectItem value="system_access">System Access</SelectItem>
              <SelectItem value="feature_usage">Feature Usage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {session.session_type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Duration:{" "}
                    {calculateDuration(session.start_time, session.end_time)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm truncate" title={session.user_agent}>
                    {session.user_agent}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{session.ip_address}</span>
                </div>
                {session.device_info && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs font-medium">Device Info</p>
                    <pre className="text-xs mt-1 overflow-x-auto">
                      {JSON.stringify(session.device_info, null, 2)}
                    </pre>
                  </div>
                )}
                {session.actions_performed && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Actions Performed</p>
                    <div className="mt-1 space-y-1">
                      {Object.entries(session.actions_performed).map(
                        ([action, count]) => (
                          <div
                            key={action}
                            className="flex justify-between text-xs"
                          >
                            <span>{action}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};