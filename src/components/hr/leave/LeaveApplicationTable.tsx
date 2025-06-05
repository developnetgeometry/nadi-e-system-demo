import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useLeaveApplications } from "@/hooks/hr/use-leave-applications";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export function LeaveApplicationTable() {
  const { leaveApplications, isLoading } = useLeaveApplications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 border rounded"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Leave Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {leaveApplications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No leave applications found.</p>
            <p className="text-sm">
              Apply for your first leave using the button above.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.nd_leave_type?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.start_date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.end_date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{application.days_requested}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(application.status)}>
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.applied_at), "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
