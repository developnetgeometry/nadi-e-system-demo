import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const Leave = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Leave Management</h1>
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Annual Leave</TableCell>
                <TableCell>Feb 15, 2024</TableCell>
                <TableCell>Feb 20, 2024</TableCell>
                <TableCell>
                  <Badge variant="outline">Pending</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {/* Add more leave request rows as needed */}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;