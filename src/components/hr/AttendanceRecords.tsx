import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { AttendanceFilters } from "./AttendanceFilters";
import { AttendanceDetailsModal } from "./AttendanceDetailsModal";
import {
  getStaffAttendanceByDate,
  getAttendanceFilterOptions,
  AttendanceRecord,
  AttendanceAnalytics,
  AttendanceFilters as FilterType,
} from "@/lib/attendance";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecordsProps {
  siteId?: number;
}

const AttendanceRecords: React.FC<AttendanceRecordsProps> = ({ siteId }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalytics>({
    totalPresent: 0,
    totalCheckIn: 0,
    totalCheckOut: 0,
    averageWorkingHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [tpFilter, setTpFilter] = useState<string>("all");
  const [duspFilter, setDuspFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter options
  const [sites, setSites] = useState<{ id: string | number; name: string }[]>(
    []
  );
  const [tpOptions, setTpOptions] = useState<
    { id: string | number; name: string }[]
  >([]);
  const [duspOptions, setDuspOptions] = useState<
    { id: string | number; name: string }[]
  >([]);

  const { toast } = useToast();

  const fetchFilterOptions = async () => {
    try {
      const options = await getAttendanceFilterOptions();
      setSites(options.sites);
      setTpOptions(options.tpOptions);
      setDuspOptions(options.duspOptions);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchAttendanceData = async (
    selectedDate: Date,
    filters?: FilterType
  ) => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const result = await getStaffAttendanceByDate(dateString, filters);

      setAttendanceRecords(result.records);
      setAnalytics(result.analytics);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!date) return;

    const filters: FilterType = {};

    if (siteFilter && siteFilter !== "all") {
      filters.siteId = parseInt(siteFilter);
    }
    if (tpFilter && tpFilter !== "all") {
      filters.tpId = tpFilter;
    }
    if (duspFilter && duspFilter !== "all") {
      filters.duspId = duspFilter;
    }
    if (statusFilter && statusFilter !== "all") {
      filters.status = statusFilter;
    }

    fetchAttendanceData(date, filters);
  };

  const handleClearFilters = () => {
    setSiteFilter("all");
    setTpFilter("all");
    setDuspFilter("all");
    setStatusFilter("all");

    if (date) {
      fetchAttendanceData(date);
    }
  };

  const handleRowClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (date) {
      fetchAttendanceData(date);
    }
  }, [date]);

  // Auto-refresh when filters change
  useEffect(() => {
    if (date) {
      handleApplyFilters();
    }
  }, [siteFilter, tpFilter, duspFilter, statusFilter]);

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-4 flex flex-col lg:flex-row gap-6">
        {/* Calendar - 3 columns */}
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
        {/* Analytics Overview */}
        <Card className="shadow-sm border-gray-200 flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Daily Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {attendanceRecords.length}
                </div>
                <div className="text-xs text-blue-600">Total Records</div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {analytics.totalPresent}
                </div>
                <div className="text-xs text-green-600">Present</div>
              </div>

              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {analytics.totalCheckIn}
                </div>
                <div className="text-xs text-orange-600">Check-ins</div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {analytics.totalCheckOut}
                </div>
                <div className="text-xs text-purple-600">Check-outs</div>
              </div>
            </div>

            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-700">
                {analytics.averageWorkingHours.toFixed(1)}h
              </div>
              <div className="text-xs text-amber-600">Average Hours</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards - 3 columns */}
      <div className="col-span-12 lg:col-span-3"></div>

      {/* Records and Filters - 6 columns */}
      <div className="lg:col-span-4 space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Attendance Records</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => date && fetchAttendanceData(date)}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {showFilters && (
            <AttendanceFilters
              siteFilter={siteFilter}
              setSiteFilter={setSiteFilter}
              tpFilter={tpFilter}
              setTpFilter={setTpFilter}
              duspFilter={duspFilter}
              setDuspFilter={setDuspFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sites={sites}
              tpOptions={tpOptions}
              duspOptions={duspOptions}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              loading={loading}
            />
          )}
        </div>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Staff Attendance -{" "}
              {date ? format(date, "dd MMMM yyyy") : "Select a date"}
              {loading && (
                <div className="ml-2 inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length > 0 ? (
              <div className="rounded-md border max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>IC No</TableHead>
                      <TableHead>Mobile No</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>DUSP (TP)</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hours</TableHead>
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
                          {record.nd_staff_profile?.fullname || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {record.nd_staff_profile?.ic_no || "-"}
                        </TableCell>
                        <TableCell>
                          {record.nd_staff_profile?.mobile_no || "-"}
                        </TableCell>
                        <TableCell>
                          {record.nd_site_profile?.sitename || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {record.nd_site_profile?.dusp_tp ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                {record.nd_site_profile.dusp_tp.name}
                              </div>
                              {record.nd_site_profile.dusp_tp.parent && (
                                <div className="text-muted-foreground">
                                  ({record.nd_site_profile.dusp_tp.parent.name})
                                </div>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{formatTime(record.check_in)}</TableCell>
                        <TableCell>{formatTime(record.check_out)}</TableCell>
                        <TableCell>{getStatusBadge(record)}</TableCell>
                        <TableCell>
                          {record.total_working_hour
                            ? `${record.total_working_hour}h`
                            : "-"}
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
                  `No attendance records found for ${
                    date ? format(date, "dd MMMM yyyy") : "selected date"
                  }`
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        record={selectedRecord}
      />
    </div>
  );
};

export default AttendanceRecords;
