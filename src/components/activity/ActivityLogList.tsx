
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock } from "lucide-react";
import {
  AuditLog,
  Session,
  Profile,
  createProfileMap,
  processAuditLogs,
  processSessions,
  filterLogs,
  filterSessions,
  exportToCSV
} from "./utils/activity-utils";
import { ActivitySearch } from "./ActivitySearch";
import { AuditLogTable } from "./AuditLogTable";
import { SessionTable } from "./SessionTable";

export const ActivityLogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "login" | "logout" | "actions">("all");

  // Fetch profiles separately
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, user_type");

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
      return data as Profile[];
    }
  });

  // Create a lookup map for profiles
  const profileMap = createProfileMap(profiles);

  // Fetch audit logs
  const {
    data: auditLogsRaw = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["audit-logs", filterBy],
    queryFn: async () => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filterBy === "login") {
        query = query.eq("action", "login");
      } else if (filterBy === "logout") {
        query = query.eq("action", "logout");
      } else if (filterBy === "actions") {
        query = query.not("action", "in", '("login", "logout")');
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      return data;
    },
  });

  // Fetch sessions
  const {
    data: sessionsRaw = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usage_sessions")
        .select("*")
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }

      return data;
    },
  });

  // Process audit logs and sessions
  const auditLogs = processAuditLogs(auditLogsRaw, profileMap);
  const sessions = processSessions(sessionsRaw, profileMap);

  // Filter logs and sessions
  const filteredLogs = filterLogs(auditLogs as AuditLog[], searchTerm);
  const filteredSessions = filterSessions(sessions as Session[], searchTerm);

  // Handle refresh
  const handleRefresh = () => {
    refetchLogs();
    refetchSessions();
  };

  // Handle export
  const handleExport = () => {
    exportToCSV(auditLogs, 'audit-logs.csv');
  };

  return (
    <div className="space-y-6">
      <ActivitySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            User Sessions
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
  );
};
