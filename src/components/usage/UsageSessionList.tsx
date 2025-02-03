import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Monitor, Clock } from "lucide-react";

interface UsageSession {
  id: string;
  session_type: string;
  start_time: string;
  end_time: string | null;
  ip_address: string;
  user_agent: string;
}

export const UsageSessionList = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["usage_sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usage_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UsageSession[];
    },
  });

  if (isLoading) {
    return <div>Loading usage sessions...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions?.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {session.session_type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  Started: {new Date(session.start_time).toLocaleString()}
                </span>
              </div>
              {session.end_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Ended: {new Date(session.end_time).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span className="text-sm truncate" title={session.user_agent}>
                  {session.user_agent}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  IP: {session.ip_address}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};