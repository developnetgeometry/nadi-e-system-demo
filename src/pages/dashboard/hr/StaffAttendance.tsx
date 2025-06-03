
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardHover,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  Users,
  UserCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { AttendanceDetailsModal } from "@/components/hr/AttendanceDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useStaffID from "@/hooks/use-staff-id";

interface AttendanceRecord {
  id: number;
  staff_id: string;
  site_id: number;
  attend_date: string;
  check_in: string | null;
  check_out: string | null;
  status: boolean;
  remark: string | null;
  total_working_hour: number;
  longtitude_check_in: number | null;
  latitude_check_in: number | null;
  longtitude_check_out: number | null;
  latitude_check_out: number | null;
  address: string | null;
  photo_path: string | null;
  attendance_type: number;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  nd_staff_profile?: {
    fullname: string;
    ic_no: string;
    mobile_no: string;
  };
  nd_site_profile?: {
    sitename: string;
    dusp_tp?: {
      id: string;
      name: string;
      parent?: {
        id: string;
        name: string;
      };
    };
  };
}

interface AttendanceStats {
  totalRecords: number;
  presentDays: number;
  onTimeDays: number;
  lateDays: number;
  averageWorkingHours: number;
}

const StaffAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalRecords: 0,
    presentDays: 0,
    onTimeDays: 0,
    lateDays: 0,
    averageWorkingHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { staffID } = useStaffID();
  const { toast } = useToast();

  const fetchStaffAttendance = async (selectedDate?: Date) => {
    if (!staffID) return;

    setLoading(true);
    try {
      let query = supabase
        .from('nd_staff_attendance')
        .select(`
          *,
          nd_staff_profile!inner(fullname, ic_no, mobile_no),
          nd_site_profile(sitename)
        `)
        .eq('staff_id', staffID);

      // If date is selected, filter by that date
      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        query = query.eq('attend_date', dateString);
      }

      // Order by date descending to show latest first
      query = query.order('attend_date', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching staff attendance:', error);
        throw error;
      }

      const records = data || [];
      setAttendanceRecords(records);

      // Calculate statistics
      const totalRecords = records.length;
      const presentDays = records.filter(record => record.check_in && record.check_out).length;
      const onTimeDays = records.filter(record => {
        if (!record.check_in) return false;
        const checkInTime = new Date(`2000-01-01T${record.check_in}`);
        const standardTime = new Date(`2000-01-01T09:00:00`);
        return checkInTime <= standardTime;
      }).length;
      const lateDays = records.filter(record => {
        if (!record.check_in) return false;
        const checkInTime = new Date(`2000-01-01T${record.check_in}`);
        const standardTime = new Date(`2000-01-01T09:00:00`);
        return checkInTime > standardTime;
      }).length;

      const workingHours = records
        .filter(record => record.total_working_hour > 0)
        .map(record => record.total_working_hour);
      
      const averageWorkingHours = workingHours.length > 0 
        ? workingHours.reduce((sum, hours) => sum + hours, 0) / workingHours.length 
        : 0;

      setStats({
        totalRecords,
        presentDays,
        onTimeDays,
        lateDays,
        averageWorkingHours,
      });

    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffID) {
      fetchStaffAttendance();
    }
  }, [staffID]);

  useEffect(() => {
    if (date && staffID) {
      fetchStaffAttendance(date);
    }
  }, [date, staffID]);

  const handleRowClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (record: AttendanceRecord) => {
    if (record.check_in && record.check_out) {
      return <Badge variant="default">Present</Badge>;
    } else if (record.check_in && !record.check_out) {
      return <Badge variant="secondary">Checked In</Badge>;
    } else {
      return <Badge variant="destructive">Absent</Badge>;
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return format(new Date(`2000-01-01T${time}`), "HH:mm");
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold mb-6">My Attendance</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Records
                </p>
                <h3 className="text-2xl font-bold">
                  {loading ? "..." : stats.totalRecords}
                </h3>
              </div>
            </CardContent>
          </CardHover>

          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Present Days
                </p>
                <h3 className="text-2xl font-bold">
                  {loading ? "..." : stats.presentDays}
                </h3>
              </div>
            </CardContent>
          </CardHover>

          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  On Time
                </p>
                <h3 className="text-2xl font-bold">
                  {loading ? "..." : stats.onTimeDays}
                </h3>
              </div>
            </CardContent>
          </CardHover>

          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Late Days
                </p>
                <h3 className="text-2xl font-bold">
                  {loading ? "..." : stats.lateDays}
                </h3>
              </div>
            </CardContent>
          </CardHover>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Attendance Records */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  My Attendance Records - {date ? format(date, "dd MMMM yyyy") : "All Records"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {loading && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                  <div className="text-sm text-muted-foreground">
                    Avg. Working Hours: {stats.averageWorkingHours.toFixed(1)}h
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length > 0 ? (
                  <div className="rounded-md border max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.map((record) => (
                          <TableRow
                            key={record.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleRowClick(record)}
                          >
                            <TableCell className="font-medium">
                              {format(new Date(record.attend_date), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              {record.nd_site_profile?.sitename || "Unknown"}
                            </TableCell>
                            <TableCell>{formatTime(record.check_in)}</TableCell>
                            <TableCell>{formatTime(record.check_out)}</TableCell>
                            <TableCell>{getStatusBadge(record)}</TableCell>
                            <TableCell>
                              {record.total_working_hour
                                ? `${record.total_working_hour}h`
                                : "-"}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {record.remark || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                        Loading attendance data...
                      </div>
                    ) : (
                      `No attendance records found ${
                        date ? `for ${format(date, "dd MMMM yyyy")}` : ""
                      }`
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attendance Details Modal */}
        <AttendanceDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          record={selectedRecord}
        />
      </div>
    </div>
  );
};

export default StaffAttendance;
