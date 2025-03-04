
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
import { Session } from "./utils/activity-utils";

interface SessionTableProps {
  sessions: Session[];
  isLoading: boolean;
}

export const SessionTable = ({ sessions, isLoading }: SessionTableProps) => {
  return (
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
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
  );
};
