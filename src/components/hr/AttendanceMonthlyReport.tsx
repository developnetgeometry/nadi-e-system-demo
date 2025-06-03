
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, FileText, FileSpreadsheet, Table as TableIcon, Search, Filter } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MonthlyAttendanceRecord {
  id: number;
  staff_id: string;
  site_id: number;
  attend_date: string;
  check_in: string | null;
  check_out: string | null;
  status: boolean;
  total_working_hour: number;
  nd_staff_profile?: {
    fullname: string;
    ic_no: string;
    mobile_no: string;
  };
  nd_site_profile?: {
    sitename: string;
  };
}

interface StaffMonthlySummary {
  staff_id: string;
  fullname: string;
  ic_no: string;
  mobile_no: string;
  site_name: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  total_hours: number;
  attendance_rate: number;
}

export const AttendanceMonthlyReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<MonthlyAttendanceRecord[]>([]);
  const [staffSummaries, setStaffSummaries] = useState<StaffMonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const { toast } = useToast();

  const fetchMonthlyAttendance = async (month: Date) => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(month), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('nd_staff_attendance')
        .select(`
          *,
          nd_staff_profile(fullname, ic_no, mobile_no),
          nd_site_profile(sitename)
        `)
        .gte('attend_date', startDate)
        .lte('attend_date', endDate)
        .order('attend_date', { ascending: true });

      if (error) throw error;

      setAttendanceData(data || []);
      generateStaffSummaries(data || [], month);
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateStaffSummaries = (data: MonthlyAttendanceRecord[], month: Date) => {
    const staffMap = new Map<string, StaffMonthlySummary>();
    const monthDays = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month)
    });

    data.forEach(record => {
      const key = record.staff_id;
      if (!staffMap.has(key)) {
        staffMap.set(key, {
          staff_id: record.staff_id,
          fullname: record.nd_staff_profile?.fullname || 'Unknown',
          ic_no: record.nd_staff_profile?.ic_no || '',
          mobile_no: record.nd_staff_profile?.mobile_no || '',
          site_name: record.nd_site_profile?.sitename || 'Unknown',
          total_days: monthDays.length,
          present_days: 0,
          absent_days: 0,
          late_days: 0,
          total_hours: 0,
          attendance_rate: 0
        });
      }

      const summary = staffMap.get(key)!;
      if (record.status) {
        summary.present_days++;
        summary.total_hours += record.total_working_hour || 0;
        
        // Check if late (assuming late if check_in is after 9:00 AM)
        if (record.check_in) {
          const checkInTime = new Date(`${record.attend_date}T${record.check_in}`);
          const nineAM = new Date(`${record.attend_date}T09:00:00`);
          if (checkInTime > nineAM) {
            summary.late_days++;
          }
        }
      } else {
        summary.absent_days++;
      }
    });

    // Calculate attendance rates
    const summaries = Array.from(staffMap.values()).map(summary => ({
      ...summary,
      attendance_rate: (summary.present_days / summary.total_days) * 100
    }));

    setStaffSummaries(summaries);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const monthYear = format(selectedMonth, 'MMMM yyyy');
    
    doc.setFontSize(16);
    doc.text(`Monthly Attendance Report - ${monthYear}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 32);

    if (viewMode === 'summary') {
      const tableData = staffSummaries.map(staff => [
        staff.fullname,
        staff.ic_no,
        staff.site_name,
        staff.present_days.toString(),
        staff.absent_days.toString(),
        staff.late_days.toString(),
        `${staff.attendance_rate.toFixed(1)}%`,
        `${staff.total_hours.toFixed(1)}h`
      ]);

      (doc as any).autoTable({
        head: [['Staff Name', 'IC No', 'Site', 'Present', 'Absent', 'Late', 'Rate', 'Hours']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    } else {
      const tableData = attendanceData.map(record => [
        format(parseISO(record.attend_date), 'dd/MM/yyyy'),
        record.nd_staff_profile?.fullname || 'Unknown',
        record.nd_site_profile?.sitename || 'Unknown',
        record.check_in || '-',
        record.check_out || '-',
        record.status ? 'Present' : 'Absent',
        `${record.total_working_hour || 0}h`
      ]);

      (doc as any).autoTable({
        head: [['Date', 'Staff Name', 'Site', 'Check In', 'Check Out', 'Status', 'Hours']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }

    doc.save(`attendance-report-${format(selectedMonth, 'yyyy-MM')}.pdf`);
    toast({
      title: "Success",
      description: "PDF report downloaded successfully",
    });
  };

  const exportToExcel = () => {
    const monthYear = format(selectedMonth, 'MMMM yyyy');
    
    let data: any[] = [];
    let headers: string[] = [];

    if (viewMode === 'summary') {
      headers = ['Staff Name', 'IC No', 'Mobile No', 'Site', 'Present Days', 'Absent Days', 'Late Days', 'Attendance Rate (%)', 'Total Hours'];
      data = staffSummaries.map(staff => ({
        'Staff Name': staff.fullname,
        'IC No': staff.ic_no,
        'Mobile No': staff.mobile_no,
        'Site': staff.site_name,
        'Present Days': staff.present_days,
        'Absent Days': staff.absent_days,
        'Late Days': staff.late_days,
        'Attendance Rate (%)': staff.attendance_rate.toFixed(1),
        'Total Hours': staff.total_hours.toFixed(1)
      }));
    } else {
      headers = ['Date', 'Staff Name', 'IC No', 'Site', 'Check In', 'Check Out', 'Status', 'Working Hours'];
      data = attendanceData.map(record => ({
        'Date': format(parseISO(record.attend_date), 'dd/MM/yyyy'),
        'Staff Name': record.nd_staff_profile?.fullname || 'Unknown',
        'IC No': record.nd_staff_profile?.ic_no || '',
        'Site': record.nd_site_profile?.sitename || 'Unknown',
        'Check In': record.check_in || '-',
        'Check Out': record.check_out || '-',
        'Status': record.status ? 'Present' : 'Absent',
        'Working Hours': record.total_working_hour || 0
      }));
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Attendance ${format(selectedMonth, 'MMM yyyy')}`);
    
    XLSX.writeFile(wb, `attendance-report-${format(selectedMonth, 'yyyy-MM')}.xlsx`);
    toast({
      title: "Success",
      description: "Excel report downloaded successfully",
    });
  };

  const exportToCSV = () => {
    let csvContent = '';
    
    if (viewMode === 'summary') {
      csvContent = 'Staff Name,IC No,Mobile No,Site,Present Days,Absent Days,Late Days,Attendance Rate (%),Total Hours\n';
      csvContent += staffSummaries.map(staff => 
        `"${staff.fullname}","${staff.ic_no}","${staff.mobile_no}","${staff.site_name}",${staff.present_days},${staff.absent_days},${staff.late_days},${staff.attendance_rate.toFixed(1)},${staff.total_hours.toFixed(1)}`
      ).join('\n');
    } else {
      csvContent = 'Date,Staff Name,IC No,Site,Check In,Check Out,Status,Working Hours\n';
      csvContent += attendanceData.map(record => 
        `"${format(parseISO(record.attend_date), 'dd/MM/yyyy')}","${record.nd_staff_profile?.fullname || 'Unknown'}","${record.nd_staff_profile?.ic_no || ''}","${record.nd_site_profile?.sitename || 'Unknown'}","${record.check_in || '-'}","${record.check_out || '-'}","${record.status ? 'Present' : 'Absent'}",${record.total_working_hour || 0}`
      ).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance-report-${format(selectedMonth, 'yyyy-MM')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Success",
      description: "CSV report downloaded successfully",
    });
  };

  useEffect(() => {
    fetchMonthlyAttendance(selectedMonth);
  }, [selectedMonth]);

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Present" : "Absent"}
      </Badge>
    );
  };

  const getAttendanceRateBadge = (rate: number) => {
    let variant: "default" | "secondary" | "destructive" = "default";
    if (rate < 70) variant = "destructive";
    else if (rate < 85) variant = "secondary";
    
    return (
      <Badge variant={variant}>
        {rate.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Monthly Attendance Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Month Selector */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select month"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedMonth(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* View Mode Selector */}
              <Select value={viewMode} onValueChange={(value: 'summary' | 'detailed') => setViewMode(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary View</SelectItem>
                  <SelectItem value="detailed">Detailed View</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => fetchMonthlyAttendance(selectedMonth)} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Loading...' : 'Generate Report'}
              </Button>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <TableIcon className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating report...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === 'summary' ? 'Staff Attendance Summary' : 'Detailed Attendance Records'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({format(selectedMonth, 'MMMM yyyy')})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'summary' ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>IC No</TableHead>
                      <TableHead>Mobile No</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Rate</TableHead>
                      <TableHead className="text-center">Total Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffSummaries.map((staff) => (
                      <TableRow key={staff.staff_id}>
                        <TableCell className="font-medium">{staff.fullname}</TableCell>
                        <TableCell>{staff.ic_no}</TableCell>
                        <TableCell>{staff.mobile_no}</TableCell>
                        <TableCell>{staff.site_name}</TableCell>
                        <TableCell className="text-center">{staff.present_days}</TableCell>
                        <TableCell className="text-center">{staff.absent_days}</TableCell>
                        <TableCell className="text-center">{staff.late_days}</TableCell>
                        <TableCell className="text-center">
                          {getAttendanceRateBadge(staff.attendance_rate)}
                        </TableCell>
                        <TableCell className="text-center">{staff.total_hours.toFixed(1)}h</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>IC No</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(parseISO(record.attend_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="font-medium">
                          {record.nd_staff_profile?.fullname || 'Unknown'}
                        </TableCell>
                        <TableCell>{record.nd_staff_profile?.ic_no || ''}</TableCell>
                        <TableCell>{record.nd_site_profile?.sitename || 'Unknown'}</TableCell>
                        <TableCell>{record.check_in || '-'}</TableCell>
                        <TableCell>{record.check_out || '-'}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-center">
                          {record.total_working_hour ? `${record.total_working_hour}h` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {(viewMode === 'summary' ? staffSummaries : attendanceData).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No attendance data found for {format(selectedMonth, 'MMMM yyyy')}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
