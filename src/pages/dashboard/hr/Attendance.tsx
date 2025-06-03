import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardHover,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import AttendanceRecords from "@/components/hr/AttendanceRecords";
import AttendanceScheduler from "@/components/hr/AttendanceScheduler";
import { AttendanceMonthlyReport } from "@/components/hr/AttendanceMonthlyReport";
import { AttendanceStatistics } from "@/components/hr/AttendanceStatistics";
import { format } from "date-fns";
import { Building, Clock, UserCheck, Users } from "lucide-react";
import useStaffID from "@/hooks/use-staff-id";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useAttendanceStats } from "@/hooks/hr/use-attendance-stats";

const Attendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("daily");
  const { staffID } = useStaffID();
  const userMetadataString = useUserMetadata();
  const [siteId, setSiteId] = useState<number | undefined>(undefined);
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );

  // Extract organization info from metadata
  useEffect(() => {
    if (userMetadataString) {
      try {
        const metadata = JSON.parse(userMetadataString);
        if (metadata.site_id) {
          setSiteId(Number(metadata.site_id));
        }
        if (metadata.organization_id) {
          setOrganizationId(metadata.organization_id);
          console.log("Organization ID set:", metadata.organization_id);
        }
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadataString]);

  // Use the real attendance statistics hook
  const { stats: attendanceStats, loading: statsLoading } = useAttendanceStats(
    siteId,
    organizationId
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold mb-6">Attendance Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Present Today
                </p>
                <h3 className="text-2xl font-bold">
                  {statsLoading ? "..." : attendanceStats.presentToday}
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
                  {statsLoading ? "..." : attendanceStats.onTime}
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
                  Late
                </p>
                <h3 className="text-2xl font-bold">
                  {statsLoading ? "..." : attendanceStats.late}
                </h3>
              </div>
            </CardContent>
          </CardHover>

          <CardHover>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Active Staff
                </p>
                <h3 className="text-2xl font-bold">
                  {statsLoading ? "..." : attendanceStats.totalStaff}
                </h3>
              </div>
            </CardContent>
          </CardHover>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="scheduler">Task Scheduler</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <AttendanceRecords siteId={siteId} />
          </TabsContent>

          <TabsContent value="scheduler">
            <AttendanceScheduler />
          </TabsContent>

          <TabsContent value="monthly">
            <AttendanceMonthlyReport />
          </TabsContent>

          <TabsContent value="stats">
            <AttendanceStatistics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Attendance;
