
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Clock, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createProfileMap,
  processAuditLogs,
  processSessions,
  filterLogs,
  filterSessions,
  exportToCSV
} from "@/components/activity/utils/activity-utils";
import { AuditLogTable } from "@/components/activity/AuditLogTable";
import { SessionTable } from "@/components/activity/SessionTable";

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "login" | "logout" | "actions">("all");

  // Fetch profiles separately
  const { data: profiles = [] } = useQuery({
    queryKey: ["member-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, user_type")
        .eq("user_type", "member");

      if (error) {
        console.error("Error fetching member profiles:", error);
        throw error;
      }
      return data;
    }
  });

  // Create a lookup map for profiles
  const profileMap = createProfileMap(profiles);

  // Get member IDs
  const memberIds = profiles.map(profile => profile.id);

  // Fetch member activity logs
  const {
    data: logsRaw = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["member-activity-logs", memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .in("user_id", memberIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching member activity logs:", error);
        throw error;
      }

      return data;
    },
    enabled: memberIds.length > 0
  });

  // Fetch member sessions
  const {
    data: sessionsRaw = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["member-sessions", memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("usage_sessions")
        .select("*")
        .in("user_id", memberIds)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching member sessions:", error);
        throw error;
      }

      return data;
    },
    enabled: memberIds.length > 0
  });

  // Process logs and sessions
  const logs = processAuditLogs(logsRaw, profileMap);
  const sessions = processSessions(sessionsRaw, profileMap);

  // Filter logs and sessions based on search term
  const filteredLogs = filterLogs(logs, searchTerm);
  const filteredSessions = filterSessions(sessions, searchTerm);

  // Handle refresh
  const handleRefresh = () => {
    refetchLogs();
    refetchSessions();
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Member Activity Logs</h1>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => exportToCSV(logs, 'member-logs.csv')}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Login Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="mt-4">
              <AuditLogTable 
                logs={filteredLogs}
                isLoading={isLoadingLogs}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
              />
            </TabsContent>

            <TabsContent value="sessions" className="mt-4">
              <SessionTable 
                sessions={filteredSessions}
                isLoading={isLoadingSessions}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogs;
