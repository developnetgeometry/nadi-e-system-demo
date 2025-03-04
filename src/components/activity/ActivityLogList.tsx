
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Filter, Download, UserIcon, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: any;
  ip_address: string;
  created_at: string;
  userEmail?: string;
  userType?: string;
}

interface Session {
  id: string;
  user_id: string;
  session_type: string;
  start_time: string;
  end_time: string | null;
  ip_address: string;
  user_agent: string;
  device_info: any;
  created_at: string;
  duration_minutes?: number;
  userEmail?: string;
  userType?: string;
}

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
      return data;
    }
  });

  // Create a lookup map for profiles
  const profileMap = profiles.reduce((acc, profile) => {
    acc[profile.id] = {
      email: profile.email,
      user_type: profile.user_type
    };
    return acc;
  }, {});

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

  // Combine audit logs with user information
  const auditLogs = auditLogsRaw.map(log => {
    const userProfile = log.user_id ? profileMap[log.user_id] : null;
    return {
      ...log,
      userEmail: userProfile?.email,
      userType: userProfile?.user_type
    };
  });

  // Combine sessions with user information and calculate duration
  const sessions = sessionsRaw.map(session => {
    const userProfile = session.user_id ? profileMap[session.user_id] : null;
    const startTime = new Date(session.start_time);
    const endTime = session.end_time ? new Date(session.end_time) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    return {
      ...session,
      duration_minutes: durationMinutes,
      userEmail: userProfile?.email,
      userType: userProfile?.user_type
    };
  });

  // Filter logs based on search term
  const filteredLogs = auditLogs.filter((log) => {
    if (!searchTerm) return true;
    
    const searchFields = [
      log.action,
      log.entity_type,
      log.entity_id,
      log.ip_address,
      log.userEmail,
    ];
    
    return searchFields.some(
      (field) => field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter sessions based on search term
  const filteredSessions = sessions.filter((session) => {
    if (!searchTerm) return true;
    
    const searchFields = [
      session.session_type,
      session.ip_address,
      session.user_agent,
      session.userEmail,
    ];
    
    return searchFields.some(
      (field) => field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle refresh
  const handleRefresh = () => {
    refetchLogs();
    refetchSessions();
  };

  // Export data as CSV
  const exportToCSV = (data: any[], filename: string) => {
    // Prepare CSV content
    const headers = Object.keys(data[0] || {}).filter(key => !key.startsWith('user'));
    const csvRows = [
      // Add headers
      headers.join(','),
      // Add data rows
      ...data.map(row => {
        return headers
          .map(header => {
            const value = row[header];
            return typeof value === 'object' 
              ? JSON.stringify(value)
              : `"${value?.toString().replace(/"/g, '""') || ''}"`;
          })
          .join(',');
      }),
    ];

    // Create and download the CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
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
            onClick={() => exportToCSV(auditLogs, 'audit-logs.csv')}
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
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            User Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Audit Logs</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Button 
                    variant={filterBy === "all" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setFilterBy("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterBy === "login" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setFilterBy("login")}
                  >
                    Logins
                  </Button>
                  <Button 
                    variant={filterBy === "logout" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setFilterBy("logout")}
                  >
                    Logouts
                  </Button>
                  <Button 
                    variant={filterBy === "actions" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setFilterBy("actions")}
                  >
                    Actions
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="hidden md:table-cell">Entity Type</TableHead>
                      <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingLogs ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex justify-center">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(log.created_at), "MMM d, h:mm a")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[120px] md:max-w-none" title={log.userEmail || 'Unknown'}>
                                {log.userEmail || 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell className="hidden md:table-cell">{log.entity_type}</TableCell>
                          <TableCell className="hidden lg:table-cell">{log.ip_address}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                      <TableHead className="hidden xl:table-cell">Browser</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingSessions ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex justify-center">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSessions.length > 0 ? (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(session.start_time), "MMM d, h:mm a")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[120px] md:max-w-none" title={session.userEmail || 'Unknown'}>
                                {session.userEmail || 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {session.end_time ? (
                              `${session.duration_minutes} minutes`
                            ) : (
                              <span className="text-green-500 font-medium">Active</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{session.ip_address}</TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <span className="truncate max-w-[200px] inline-block" title={session.user_agent}>
                              {session.user_agent}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No sessions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
