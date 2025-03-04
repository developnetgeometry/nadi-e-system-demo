
import { RefreshCw, UserIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AuditLog } from "./utils/activity-utils";

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  filterBy: "all" | "login" | "logout" | "actions";
  setFilterBy: (filter: "all" | "login" | "logout" | "actions") => void;
}

export const AuditLogTable = ({ 
  logs, 
  isLoading, 
  filterBy, 
  setFilterBy 
}: AuditLogTableProps) => {
  return (
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length > 0 ? (
                logs.map((log) => (
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
  );
};
