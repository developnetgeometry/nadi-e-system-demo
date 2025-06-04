
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, Users, Clock, BarChart3 } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";

interface AttendanceStats {
  totalStaff: number;
  presentToday: number;
  averageAttendanceRate: number;
  totalWorkingHours: number;
  lateArrivals: number;
  earlyDepartures: number;
}

interface DailyAttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  attendanceRate: number;
}

interface SiteAttendanceData {
  siteName: string;
  present: number;
  absent: number;
  total: number;
  attendanceRate: number;
}

interface StatusDistribution {
  name: string;
  value: number;
}

export const AttendanceStatistics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AttendanceStats>({
    totalStaff: 0,
    presentToday: 0,
    averageAttendanceRate: 0,
    totalWorkingHours: 0,
    lateArrivals: 0,
    earlyDepartures: 0
  });
  const [dailyData, setDailyData] = useState<DailyAttendanceData[]>([]);
  const [siteData, setSiteData] = useState<SiteAttendanceData[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([]);
  const { toast } = useToast();

  const fetchAttendanceStatistics = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      switch (selectedPeriod) {
        case 'week':
          startDate = subMonths(selectedMonth, 0);
          endDate = new Date();
          break;
        case 'quarter':
          startDate = subMonths(selectedMonth, 3);
          endDate = endOfMonth(selectedMonth);
          break;
        default: // month
          startDate = startOfMonth(selectedMonth);
          endDate = endOfMonth(selectedMonth);
      }

      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');

      // Fetch attendance data with staff and site information
      const { data: attendanceData, error } = await supabase
        .from('nd_staff_attendance')
        .select(`
          *,
          nd_staff_profile(fullname, ic_no),
          nd_site_profile(sitename)
        `)
        .gte('attend_date', startDateStr)
        .lte('attend_date', endDateStr)
        .order('attend_date', { ascending: true });

      if (error) throw error;

      if (attendanceData) {
        processStatistics(attendanceData, startDate, endDate);
      }
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processStatistics = (data: any[], startDate: Date, endDate: Date) => {
    // Basic statistics
    const uniqueStaff = new Set(data.map(record => record.staff_id));
    const totalStaff = uniqueStaff.size;
    const totalRecords = data.length;
    const presentRecords = data.filter(record => record.status === true);
    const totalWorkingHours = presentRecords.reduce((sum, record) => sum + (record.total_working_hour || 0), 0);

    // Calculate late arrivals (assuming 9:00 AM is standard start time)
    const lateArrivals = presentRecords.filter(record => {
      if (!record.check_in) return false;
      const checkInTime = new Date(`${record.attend_date}T${record.check_in}`);
      const standardStart = new Date(`${record.attend_date}T09:00:00`);
      return checkInTime > standardStart;
    }).length;

    // Calculate early departures (assuming 5:00 PM is standard end time)
    const earlyDepartures = presentRecords.filter(record => {
      if (!record.check_out) return false;
      const checkOutTime = new Date(`${record.attend_date}T${record.check_out}`);
      const standardEnd = new Date(`${record.attend_date}T17:00:00`);
      return checkOutTime < standardEnd;
    }).length;

    const averageAttendanceRate = totalRecords > 0 ? (presentRecords.length / totalRecords) * 100 : 0;

    setStats({
      totalStaff,
      presentToday: presentRecords.length,
      averageAttendanceRate,
      totalWorkingHours,
      lateArrivals,
      earlyDepartures
    });

    // Process daily attendance data
    const dailyMap = new Map<string, { present: number; absent: number; late: number; total: number }>();
    
    // Initialize all dates in the period
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    allDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      dailyMap.set(dateStr, { present: 0, absent: 0, late: 0, total: 0 });
    });

    data.forEach(record => {
      const dateStr = record.attend_date;
      if (dailyMap.has(dateStr)) {
        const dayData = dailyMap.get(dateStr)!;
        dayData.total++;
        
        if (record.status) {
          dayData.present++;
          
          // Check if late
          if (record.check_in) {
            const checkInTime = new Date(`${record.attend_date}T${record.check_in}`);
            const standardStart = new Date(`${record.attend_date}T09:00:00`);
            if (checkInTime > standardStart) {
              dayData.late++;
            }
          }
        } else {
          dayData.absent++;
        }
      }
    });

    const processedDailyData: DailyAttendanceData[] = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date: format(parseISO(date), 'dd/MM'),
      present: data.present,
      absent: data.absent,
      late: data.late,
      total: data.total,
      attendanceRate: data.total > 0 ? (data.present / data.total) * 100 : 0
    }));

    setDailyData(processedDailyData);

    // Process site attendance data
    const siteMap = new Map<string, { present: number; absent: number; total: number }>();
    
    data.forEach(record => {
      const siteName = record.nd_site_profile?.sitename || 'Unknown Site';
      if (!siteMap.has(siteName)) {
        siteMap.set(siteName, { present: 0, absent: 0, total: 0 });
      }
      
      const siteData = siteMap.get(siteName)!;
      siteData.total++;
      
      if (record.status) {
        siteData.present++;
      } else {
        siteData.absent++;
      }
    });

    const processedSiteData: SiteAttendanceData[] = Array.from(siteMap.entries()).map(([siteName, data]) => ({
      siteName,
      present: data.present,
      absent: data.absent,
      total: data.total,
      attendanceRate: data.total > 0 ? (data.present / data.total) * 100 : 0
    }));

    setSiteData(processedSiteData);

    // Status distribution for pie chart
    const statusDist: StatusDistribution[] = [
      { name: 'Present', value: presentRecords.length },
      { name: 'Absent', value: totalRecords - presentRecords.length },
      { name: 'Late', value: lateArrivals }
    ];

    setStatusDistribution(statusDist);
  };

  useEffect(() => {
    fetchAttendanceStatistics();
  }, [selectedPeriod, selectedMonth]);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> = ({
    title, value, icon, trend
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className="h-8 w-8 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Period Selector */}
              <Select value={selectedPeriod} onValueChange={(value: 'week' | 'month' | 'quarter') => setSelectedPeriod(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

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

              <Button onClick={fetchAttendanceStatistics} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Average Attendance Rate"
          value={`${stats.averageAttendanceRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Working Hours"
          value={`${stats.totalWorkingHours.toFixed(0)}h`}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Late Arrivals"
          value={stats.lateArrivals}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend */}
        <BarChart
          title="Daily Attendance Trend"
          data={dailyData}
          categories={['present', 'absent', 'late']}
          indexBy="date"
          colors={['#22c55e', '#ef4444', '#f59e0b']}
          height={300}
        />

        {/* Attendance Status Distribution */}
        <PieChart
          title="Attendance Status Distribution"
          data={statusDistribution}
          colors={['#22c55e', '#ef4444', '#f59e0b']}
          height={300}
        />
      </div>

      {/* Site Performance */}
      <BarChart
        title="Site Attendance Performance"
        data={siteData}
        categories={['present', 'absent']}
        indexBy="siteName"
        colors={['#22c55e', '#ef4444']}
        height={400}
      />

      {/* Attendance Rate Line Chart */}
      <LineChart
        title="Daily Attendance Rate Trend"
        data={dailyData}
        categories={['attendanceRate']}
        indexBy="date"
        colors={['#3b82f6']}
        height={300}
      />
    </div>
  );
};
