import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useUserMetadata } from "@/hooks/use-user-metadata";

const AttendanceRecords = ({ siteId }: { siteId?: number }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [userOrganizationId, setUserOrganizationId] = useState<string | undefined>(undefined);
  const { userMetadata, isLoading } = useUserMetadata();
  
  useEffect(() => {
    if (userMetadata) {
      try {
        const metadata = JSON.parse(userMetadata);
        if (metadata?.organization_id) {
          setUserOrganizationId(metadata.organization_id);
        }
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadata]);

  useEffect(() => {
    if (siteId) {
      fetchAttendanceRecords(siteId, format(date, "yyyy-MM-dd"));
    }
  }, [siteId, date]);

  const fetchAttendanceRecords = async (siteId: number, attendDate: string) => {
    setLoading(true);
    try {
      // Fetch attendance records for the selected date and site
      const response = await fetch(
        `/api/attendance?siteId=${siteId}&date=${attendDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);

      // Fetch staff members for the selected site
      const staffResponse = await fetch(`/api/staff?siteId=${siteId}`);
      if (!staffResponse.ok) {
        throw new Error(`HTTP error! status: ${staffResponse.status}`);
      }
      const staffData = await staffResponse.json();
      setStaff(staffData);
    } catch (error) {
      console.error("Could not fetch attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStaffName = (staffId: number) => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? staffMember.fullname : "Unknown";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          {date ? (
            <p className="text-center text-sm text-muted-foreground">
              {format(date, "PPP")}
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Please select a date.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading attendance records...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records found for this date.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{getStaffName(record.staff_id)}</TableCell>
                    <TableCell>
                      {record.check_in
                        ? format(new Date(record.check_in), "HH:mm")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {record.check_out
                        ? format(new Date(record.check_out), "HH:mm")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{record.total_working_hour || "N/A"}</TableCell>
                    <TableCell>
                      {record.status ? (
                        <Badge variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Absent
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceRecords;
