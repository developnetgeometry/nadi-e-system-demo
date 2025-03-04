
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Profile,
  createProfileMap,
  processAuditLogs,
  processSessions,
  filterLogs,
  filterSessions
} from "../utils/activity-utils";

export const useMemberActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "login" | "logout" | "actions">("all");

  // Fetch member profiles
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
      return data as Profile[];
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
    queryKey: ["member-activity-logs", memberIds, filterBy],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      
      let query = supabase
        .from("audit_logs")
        .select("*")
        .in("user_id", memberIds)
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

  return {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    logs: filteredLogs,
    sessions: filteredSessions,
    isLoadingLogs,
    isLoadingSessions,
    handleRefresh,
    profileMap
  };
};
