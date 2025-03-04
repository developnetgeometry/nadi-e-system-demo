
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
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
import { RefreshCw, Download, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
  const profileMap = profiles.reduce((acc, profile) => {
    acc[profile.id] = {
      email: profile.email
    };
    return acc;
  }, {});

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

  // Combine logs with user information
  const logs = logsRaw.map(log => {
    const userProfile = log.user_id ? profileMap[log.user_id] : null;
    return {
      ...log,
      userEmail: userProfile?.email || 'Unknown member'
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
      userEmail: userProfile?.email || 'Unknown member'
    };
  });

  // Filter logs based on search term
  const filteredLogs = logs.filter((log) => {
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
  const exportToCSV = (data, filename) => {
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
              <Card>
                <CardHeader>
                  <CardTitle>Member Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Entity Type</TableHead>
                          <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingLogs ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              <div className="flex justify-center py-4">
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
                              <TableCell>{log.userEmail}</TableCell>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell>{log.entity_type}</TableCell>
                              <TableCell className="hidden lg:table-cell">{log.ip_address}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              No member activity logs found
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
                <CardHeader>
                  <CardTitle>Member Login Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
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
                            <TableCell colSpan={5} className="text-center">
                              <div className="flex justify-center py-4">
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
                              <TableCell>{session.userEmail}</TableCell>
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
                            <TableCell colSpan={5} className="text-center">
                              No member sessions found
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
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogs;
