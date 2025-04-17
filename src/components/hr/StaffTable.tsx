
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  employDate: string;
  status: string;
  phone_number: string;
  ic_number: string;
  role: string;
}

interface StaffTableProps {
  isLoading: boolean;
  filteredStaff: StaffMember[];
  formatDate: (dateString: string) => string;
  statusColors: Record<string, string>;
}

export const StaffTable = ({
  isLoading,
  filteredStaff,
  formatDate,
  statusColors,
}: StaffTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Employ Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
                <p className="mt-2 text-muted-foreground">Loading staff data...</p>
              </TableCell>
            </TableRow>
          ) : filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>
                  {staff.userType?.replace(/_/g, ' ') || "Unknown"}
                </TableCell>
                <TableCell>{staff.employDate ? formatDate(staff.employDate) : "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[staff.status]}>
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>{staff.role}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No staff members found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
