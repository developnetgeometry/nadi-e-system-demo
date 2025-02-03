import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AuditLogs = () => {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      console.log("Fetching audit logs...");
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      console.log("Audit logs fetched:", data);
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Audit Logs</h1>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entity_type}</TableCell>
                    <TableCell>{log.entity_id}</TableCell>
                    <TableCell>{log.user_id}</TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>
                      {format(new Date(log.created_at), "PPpp")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No audit logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;