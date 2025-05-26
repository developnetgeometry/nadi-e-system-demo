import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  Clock,
  Building,
  GraduationCap,
  DollarSign,
  Calendar,
  BadgePercent,
  UserCheck,
  UserX,
  UserPlus,
  ArrowRight,
  FileText,
  UserCircle,
  School,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Import the correct layout component
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Sample data for charts
const staffByPosition = [
  { name: "Manager", value: 25 },
  { name: "Assistant Manager", value: 45 },
  { name: "Staff", value: 130 },
];

const contractStatus = [
  { name: "Active", value: 180 },
  { name: "Ended", value: 20 },
];

const staffByRace = [
  { name: "Malay", value: 100 },
  { name: "Chinese", value: 50 },
  { name: "Indian", value: 30 },
  { name: "Others", value: 20 },
];

const genderRatio = [
  { name: "Male", value: 60 },
  { name: "Female", value: 40 },
];

const ageGroups = [
  { name: "20-29", value: 40 },
  { name: "30-39", value: 80 },
  { name: "40-49", value: 50 },
  { name: "50+", value: 30 },
];

const educationLevel = [
  { name: "Bachelor's", value: 80 },
  { name: "Diploma", value: 70 },
  { name: "Master's", value: 30 },
  { name: "Others", value: 20 },
];

const yearsOfService = [
  { name: "<1 year", value: 20 },
  { name: "1-3 years", value: 50 },
  { name: "4-6 years", value: 60 },
  { name: "7+ years", value: 70 },
];

const vacancies = [
  { name: "Manager", value: 5 },
  { name: "Assistant Manager", value: 8 },
  { name: "Staff", value: 12 },
];

const staffTurnover = [
  { month: "Jan", resignation: 2, newJoiner: 3 },
  { month: "Feb", resignation: 1, newJoiner: 4 },
  { month: "Mar", resignation: 3, newJoiner: 2 },
  { month: "Apr", resignation: 2, newJoiner: 5 },
  { month: "May", resignation: 4, newJoiner: 3 },
  { month: "Jun", resignation: 1, newJoiner: 2 },
];

const disciplinaryData = [
  { type: "Warning", value: 12 },
  { type: "Suspension", value: 5 },
  { type: "Termination", value: 2 },
];

const leaveByStatus = [
  {
    status: "Approved",
    value: 45,
    description: "Leave applications that have been approved by management",
  },
  {
    status: "Pending",
    value: 15,
    description: "Leave applications awaiting approval from management",
  },
  {
    status: "Rejected",
    value: 5,
    description: "Leave applications that were denied by management",
  },
];

const leaveByType = [
  {
    type: "Annual",
    value: 35,
    description: "Regular yearly leave entitlement",
  },
  {
    type: "Medical",
    value: 20,
    description: "Leave taken due to health issues with medical certificates",
  },
  {
    type: "Emergency",
    value: 10,
    description: "Unplanned leave due to urgent personal matters",
  },
];

const replacementLeave = [
  {
    status: "Approved",
    value: 25,
    description: "Replacement leave applications that have been approved",
  },
  {
    status: "Pending",
    value: 8,
    description: "Replacement leave applications awaiting approval",
  },
  {
    status: "Rejected",
    value: 3,
    description: "Replacement leave applications that were denied",
  },
];

const attendanceData = [
  { date: "2025-05-01", present: 185, absent: 15 },
  { date: "2025-05-02", present: 190, absent: 10 },
  { date: "2025-05-03", present: 188, absent: 12 },
  { date: "2025-05-04", present: 195, absent: 5 },
  { date: "2025-05-05", present: 192, absent: 8 },
  { date: "2025-05-06", present: 187, absent: 13 },
  { date: "2025-05-07", present: 193, absent: 7 },
];

const siteData = [
  {
    status: "In Operation",
    value: 25,
    description: "Sites that are currently active and operational",
  },
  {
    status: "In Progress",
    value: 8,
    description: "New sites that are being developed or under construction",
  },
  {
    status: "Temporarily Closed",
    value: 3,
    description:
      "Sites that are temporarily closed for maintenance or other reasons",
  },
  {
    status: "Permanently Closed",
    value: 2,
    description: "Sites that have been permanently decommissioned",
  },
];

const trainingData = [
  { type: "Initial - Manager", value: 15 },
  { type: "Initial - Asst Manager", value: 22 },
  { type: "Refresh - Manager", value: 18 },
  { type: "Refresh - Asst Manager", value: 25 },
];

const participationRate = 78; // 78% training participation

const payrollTrend = [
  {
    month: "Jan",
    total: 480000,
    employees: 190,
    average: 2526,
    deductions: 96000,
    net: 384000,
  },
  {
    month: "Feb",
    total: 485000,
    employees: 195,
    average: 2487,
    deductions: 97000,
    net: 388000,
  },
  {
    month: "Mar",
    total: 490000,
    employees: 198,
    average: 2475,
    deductions: 98000,
    net: 392000,
  },
  {
    month: "Apr",
    total: 495000,
    employees: 200,
    average: 2475,
    deductions: 99000,
    net: 396000,
  },
  {
    month: "May",
    total: 500000,
    employees: 200,
    average: 2500,
    deductions: 100000,
    net: 400000,
  },
];

const holidays = [
  { date: "2025-05-01", description: "Labor Day" },
  { date: "2025-05-10", description: "Vesak Day" },
  { date: "2025-05-19", description: "Hari Raya Puasa" },
  { date: "2025-05-31", description: "Gawai Day" },
];

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

// Attendance data by region with Nadi Site
const attendanceDataByRegion = {
  North: [
    { date: "2025-05-01", present: 45, absent: 5 },
    { date: "2025-05-02", present: 47, absent: 3 },
    { date: "2025-05-03", present: 46, absent: 4 },
    { date: "2025-05-04", present: 48, absent: 2 },
    { date: "2025-05-05", present: 47, absent: 3 },
    { date: "2025-05-06", present: 44, absent: 6 },
    { date: "2025-05-07", present: 46, absent: 4 },
  ],
  South: [
    { date: "2025-05-01", present: 50, absent: 3 },
    { date: "2025-05-02", present: 49, absent: 4 },
    { date: "2025-05-03", present: 51, absent: 2 },
    { date: "2025-05-04", present: 52, absent: 1 },
    { date: "2025-05-05", present: 50, absent: 3 },
    { date: "2025-05-06", present: 48, absent: 5 },
    { date: "2025-05-07", present: 51, absent: 2 },
  ],
  East: [
    { date: "2025-05-01", present: 38, absent: 7 },
    { date: "2025-05-02", present: 40, absent: 5 },
    { date: "2025-05-03", present: 39, absent: 6 },
    { date: "2025-05-04", present: 42, absent: 3 },
    { date: "2025-05-05", present: 41, absent: 4 },
    { date: "2025-05-06", present: 37, absent: 8 },
    { date: "2025-05-07", present: 40, absent: 5 },
  ],
  West: [
    { date: "2025-05-01", present: 42, absent: 4 },
    { date: "2025-05-02", present: 44, absent: 2 },
    { date: "2025-05-03", present: 43, absent: 3 },
    { date: "2025-05-04", present: 45, absent: 1 },
    { date: "2025-05-05", present: 44, absent: 2 },
    { date: "2025-05-06", present: 42, absent: 4 },
    { date: "2025-05-07", present: 43, absent: 3 },
  ],
};

// Nadi Site specific attendance data
const nadiSiteAttendance = [
  {
    site: "Nadi Site A",
    data: [
      { date: "2025-05-01", present: 10, absent: 1 },
      { date: "2025-05-02", present: 10, absent: 1 },
      { date: "2025-05-03", present: 9, absent: 2 },
      { date: "2025-05-04", present: 11, absent: 0 },
      { date: "2025-05-05", present: 10, absent: 1 },
      { date: "2025-05-06", present: 9, absent: 2 },
      { date: "2025-05-07", present: 10, absent: 1 },
    ],
  },
  {
    site: "Nadi Site B",
    data: [
      { date: "2025-05-01", present: 8, absent: 1 },
      { date: "2025-05-02", present: 7, absent: 2 },
      { date: "2025-05-03", present: 8, absent: 1 },
      { date: "2025-05-04", present: 6, absent: 3 },
      { date: "2025-05-05", present: 8, absent: 1 },
      { date: "2025-05-06", present: 7, absent: 2 },
      { date: "2025-05-07", present: 8, absent: 1 },
    ],
  },
  {
    site: "Nadi Site C",
    data: [
      { date: "2025-05-01", present: 12, absent: 0 },
      { date: "2025-05-02", present: 11, absent: 1 },
      { date: "2025-05-03", present: 12, absent: 0 },
      { date: "2025-05-04", present: 10, absent: 2 },
      { date: "2025-05-05", present: 12, absent: 0 },
      { date: "2025-05-06", present: 11, absent: 1 },
      { date: "2025-05-07", present: 12, absent: 0 },
    ],
  },
  {
    site: "Nadi Site D",
    data: [
      { date: "2025-05-01", present: 7, absent: 3 },
      { date: "2025-05-02", present: 8, absent: 2 },
      { date: "2025-05-03", present: 6, absent: 4 },
      { date: "2025-05-04", present: 9, absent: 1 },
      { date: "2025-05-05", present: 7, absent: 3 },
      { date: "2025-05-06", present: 8, absent: 2 },
      { date: "2025-05-07", present: 7, absent: 3 },
    ],
  },
];

// Clock data by region with multiple Nadi sites
const nadiSites = [
  { region: "Nadi Site A", onTime: 10, late: 1 },
  { region: "Nadi Site B", onTime: 8, late: 2 },
  { region: "Nadi Site C", onTime: 12, late: 0 },
  { region: "Nadi Site D", onTime: 7, late: 3 },
];

// Clock data including all regions and Nadi sites
const combinedClockData = [...nadiSites];

// Calculate attendance percentage data for a specific region
const calculateAttendancePercentage = (region: string) => {
  if (
    region === "North" ||
    region === "South" ||
    region === "East" ||
    region === "West"
  ) {
    const data = attendanceDataByRegion[region];

    if (!data) return [];

    let totalPresent = 0;
    let totalAbsent = 0;

    data.forEach((day) => {
      totalPresent += day.present;
      totalAbsent += day.absent;
    });

    const total = totalPresent + totalAbsent;

    return [
      { name: "Present", value: Math.round((totalPresent / total) * 100) },
      { name: "Absent", value: Math.round((totalAbsent / total) * 100) },
    ];
  }
  return [];
};

// Calculate attendance percentage for Nadi sites
const calculateNadiSiteAttendancePercentage = (siteIndex: number) => {
  const data = nadiSiteAttendance[siteIndex]?.data;

  if (!data) return [];

  let totalPresent = 0;
  let totalAbsent = 0;

  data.forEach((day) => {
    totalPresent += day.present;
    totalAbsent += day.absent;
  });

  const total = totalPresent + totalAbsent;

  return [
    { name: "Present", value: Math.round((totalPresent / total) * 100) },
    { name: "Absent", value: Math.round((totalAbsent / total) * 100) },
  ];
};

// Summarize daily attendance for all Nadi sites
const nadiSiteSummary = nadiSiteAttendance.map((site) => {
  const totalPresent = site.data.reduce((sum, day) => sum + day.present, 0);
  const totalAbsent = site.data.reduce((sum, day) => sum + day.absent, 0);

  return {
    site: site.site,
    present: totalPresent,
    absent: totalAbsent,
    total: totalPresent + totalAbsent,
    presentPercentage: Math.round(
      (totalPresent / (totalPresent + totalAbsent)) * 100
    ),
    absentPercentage: Math.round(
      (totalAbsent / (totalPresent + totalAbsent)) * 100
    ),
  };
});

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>("South");
  const [selectedNadiSite, setSelectedNadiSite] = useState<number>(0);

  // Get the current date
  const today = new Date();
  const currentDate = format(today, "EEEE, MMMM d, yyyy");

  // Get the attendance data for the selected region
  const regionAttendanceData = attendanceDataByRegion[selectedRegion] || [];
  // Access array directly with numeric index - no need for conversion
  const nadiSiteData = nadiSiteAttendance[selectedNadiSite]?.data || [];
  const attendancePercentageData =
    calculateAttendancePercentage(selectedRegion);
  // Use numeric index directly
  const nadiSiteAttendancePercentageData =
    calculateNadiSiteAttendancePercentage(selectedNadiSite);

  // Filter out South and West regions from combinedClockData
  const filteredClockData = combinedClockData.filter(
    (item) => item.region !== "South" && item.region !== "West"
  );

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">Export as PDF</Button>
            <Button variant="outline">Export as Excel</Button>
          </div>
        </div>

        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-4">
            <TabsTrigger value="staff">Staff Summary</TabsTrigger>
            <TabsTrigger value="leave">Leave Summary</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="site">Site Management</TabsTrigger>
            <TabsTrigger value="training">Staff Training</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* Staff Summary Tab */}
          <TabsContent value="staff">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Employment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={staffByPosition}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {staffByPosition.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Staff:</span>
                      <span className="font-bold">200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Manager:</span>
                      <span className="font-bold">
                        {staffByPosition[0].value}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Assistant Manager:</span>
                      <span className="font-bold">
                        {staffByPosition[1].value}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Contract Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contractStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Contract Active:</span>
                      <span className="font-bold">
                        {contractStatus[0].value}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Contract Ended:</span>
                      <span className="font-bold">
                        {contractStatus[1].value}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Demographic
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-0">
                  <Tabs defaultValue="race" className="w-full">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="race">Race</TabsTrigger>
                      <TabsTrigger value="gender">Gender</TabsTrigger>
                      <TabsTrigger value="age">Age</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                    </TabsList>

                    <TabsContent value="race" className="p-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={staffByRace}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {staffByRace.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="gender" className="p-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genderRatio}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              <Cell fill="#2196F3" />
                              <Cell fill="#E91E63" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="age" className="p-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ageGroups}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="value"
                              name="Employees"
                              fill="#8884d8"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="education" className="p-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={educationLevel}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {educationLevel.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Years of Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearsOfService}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Employees" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Vacancies & Recruitment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vacancies}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Vacancies" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-48 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={staffTurnover}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="resignation"
                          stroke="#FF8042"
                        />
                        <Line
                          type="monotone"
                          dataKey="newJoiner"
                          stroke="#00C49F"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Employee Turnover Rate:</span>
                      <span className="font-bold">7.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Disciplinary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={disciplinaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Count" fill="#F44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leave Summary Tab */}
          <TabsContent value="leave">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Leave Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="h-64">
                      <h3 className="text-md font-medium mb-2">
                        By Leave Status
                      </h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={leaveByStatus}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="status" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Applications"
                            fill="#8884d8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 space-y-3">
                      {leaveByStatus.map((item) => (
                        <div
                          key={item.status}
                          className="rounded-lg border p-3"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  item.status === "Approved"
                                    ? "bg-green-500"
                                    : item.status === "Pending"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span className="font-medium">{item.status}</span>
                            </div>
                            <span className="font-bold">{item.value}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="h-64">
                      <h3 className="text-md font-medium mb-2">
                        By Leave Type
                      </h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={leaveByType}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Applications"
                            fill="#3F51B5"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 space-y-3">
                      {leaveByType.map((item) => (
                        <div key={item.type} className="rounded-lg border p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.type}</span>
                            </div>
                            <span className="font-bold">{item.value}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Replacement Leave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <h3 className="text-md font-medium mb-2">
                      By Leave Status
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={replacementLeave}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ status, percent }) =>
                            `${status}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#FFC107" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-3">
                    {replacementLeave.map((item) => (
                      <div key={item.status} className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                item.status === "Approved"
                                  ? "bg-green-500"
                                  : item.status === "Pending"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span className="font-medium">{item.status}</span>
                          </div>
                          <span className="font-bold">{item.value}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      navigate("/staff-dashboard/replacement-leave")
                    }
                  >
                    View Replacement Leave Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <div className="mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Region Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select
                      value={selectedRegion}
                      onValueChange={setSelectedRegion}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Daily Attendance %
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Today: {currentDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendancePercentageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) =>
                            `${name}: ${value.toString()}%`
                          }
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Selected Region:</span>
                      <span className="font-bold">{selectedRegion}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Daily Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={regionAttendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).getDate()}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="present"
                          name="Present"
                          stroke="#4CAF50"
                        />
                        <Line
                          type="monotone"
                          dataKey="absent"
                          name="Absent"
                          stroke="#F44336"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Attendance Rate:</span>
                      <span className="font-bold">
                        {attendancePercentageData[0]?.value}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nadi Sites Section */}
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Nadi Site Attendance
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Select
                        value={selectedNadiSite.toString()}
                        onValueChange={(value) =>
                          setSelectedNadiSite(Number(value))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Nadi Site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {nadiSiteAttendance.map((site, index) => (
                              <SelectItem
                                key={site.site}
                                value={index.toString()}
                              >
                                {site.site}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Today: {currentDate}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <h3 className="text-md font-medium mb-2">
                        Daily Attendance %
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={nadiSiteAttendancePercentageData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) =>
                                `${name}: ${value.toString()}%`
                              }
                            >
                              <Cell fill="#4CAF50" />
                              <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-md font-medium mb-2">
                        Daily Attendance
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={nadiSiteData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).getDate()}
                            />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="present"
                              name="Present"
                              fill="#4CAF50"
                            />
                            <Bar
                              dataKey="absent"
                              name="Absent"
                              fill="#F44336"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Clock In/Out
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Today: {currentDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredClockData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="region" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="onTime"
                          name="On Time"
                          stackId="a"
                          fill="#4CAF50"
                        />
                        <Bar
                          dataKey="late"
                          name="Late"
                          stackId="a"
                          fill="#F44336"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Site Management Tab */}
          <TabsContent value="site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Site Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={siteData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ status, percent }) =>
                            `${status}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#2196F3" />
                          <Cell fill="#FFC107" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Sites:</span>
                      <span className="font-bold">
                        {siteData.reduce((sum, site) => sum + site.value, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Site Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siteData.map((site) => (
                        <TableRow key={site.status}>
                          <TableCell>{site.status}</TableCell>
                          <TableCell className="text-right">
                            {site.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-3">
                    {siteData.map((site) => (
                      <div key={site.status} className="rounded-lg border p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                site.status === "In Operation"
                                  ? "bg-green-500"
                                  : site.status === "In Progress"
                                  ? "bg-blue-500"
                                  : site.status === "Temporarily Closed"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span className="font-medium">{site.status}</span>
                          </div>
                          <span className="font-bold">{site.value}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {site.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staff Training Tab */}
          <TabsContent value="training">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Training Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trainingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Trainings" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    Staff Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">
                          {participationRate}%
                        </span>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#8884d8"
                          strokeWidth="10"
                          strokeDasharray={`${participationRate * 2.83} ${
                            283 - participationRate * 2.83
                          }`}
                          strokeDashoffset="70.75"
                        />
                      </svg>
                    </div>
                    <div className="text-center mt-4">
                      <p>Staff Participation Rate</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Trainings:</span>
                      <span className="font-bold">
                        {trainingData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Payroll Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={payrollTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Payroll (RM)"
                        stroke="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="net"
                        name="Net Payroll (RM)"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Total Payroll
                        </span>
                      </div>
                      <span className="font-bold">RM 500,000</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Employees Paid
                        </span>
                      </div>
                      <span className="font-bold">200</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BadgePercent className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Average Salary
                        </span>
                      </div>
                      <span className="font-bold">RM 2,500</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Deductions</span>
                      </div>
                      <span className="font-bold">RM 100,000</span>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Net Payroll</span>
                      </div>
                      <span className="font-bold">RM 400,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Public Holidays & Off Days (May 2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const dateStr = `2025-05-${day
                      .toString()
                      .padStart(2, "0")}`;
                    const holiday = holidays.find((h) => h.date === dateStr);

                    return (
                      <div
                        key={day}
                        className={`p-2 rounded-md border text-center ${
                          holiday
                            ? "bg-red-50 border-red-200"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="font-medium">{day}</div>
                        {holiday && (
                          <div className="text-xs text-red-500 mt-1">
                            {holiday.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Holiday Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holidays.map((holiday) => (
                        <TableRow key={holiday.date}>
                          <TableCell>
                            {new Date(holiday.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{holiday.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default HRDashboard;
