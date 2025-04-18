import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  FolderKanban,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const ProgrammesDashboard = () => {
  // Sample programmes data
  const programmes = [
    {
      id: 1,
      name: "Digital Skills for Youth",
      type: "Training",
      participants: 85,
      startDate: "2023-06-01",
      endDate: "2023-07-15",
      completion: 40,
      status: "Active",
    },
    {
      id: 2,
      name: "Community Coding Bootcamp",
      type: "Workshop",
      participants: 32,
      startDate: "2023-06-15",
      endDate: "2023-06-30",
      completion: 20,
      status: "Active",
    },
    {
      id: 3,
      name: "Senior Digital Literacy",
      type: "Course",
      participants: 45,
      startDate: "2023-05-10",
      endDate: "2023-06-10",
      completion: 90,
      status: "Closing",
    },
    {
      id: 4,
      name: "Entrepreneurship Accelerator",
      type: "Mentorship",
      participants: 25,
      startDate: "2023-07-05",
      endDate: "2023-09-15",
      completion: 0,
      status: "Upcoming",
    },
  ];

  // Upcoming events
  const events = [
    {
      id: 1,
      title: "Workshop: Web Development Basics",
      date: "2023-06-20",
      time: "10:00 AM - 1:00 PM",
      location: "Kuala Lumpur Hub",
      attendees: 25,
    },
    {
      id: 2,
      title: "Seminar: Digital Marketing Skills",
      date: "2023-06-22",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Session",
      attendees: 50,
    },
    {
      id: 3,
      title: "Bootcamp: Mobile App Development",
      date: "2023-06-25",
      time: "9:00 AM - 4:00 PM",
      location: "Penang Centre",
      attendees: 20,
    },
  ];

  // Recent achievements
  const achievements = [
    {
      id: 1,
      title: "Certified 500 Youth in Digital Skills",
      date: "June 5, 2023",
      description: "Milestone achievement in our youth empowerment programme",
    },
    {
      id: 2,
      title: "Launched New Online Learning Platform",
      date: "May 28, 2023",
      description: "Digital learning portal with 50+ courses now available",
    },
    {
      id: 3,
      title: "Community Tech Initiative Award",
      date: "May 15, 2023",
      description:
        "Recognized for excellence in community technology education",
    },
  ];
  return (
    <DashboardLayout>
      <div className="p-6 mx-auto space-y-6 w-full max-w-none overflow-x-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-xl">Programmes Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage educational and community programmes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Programmes
                  </p>
                  <h3 className="text-2xl font-bold mt-1">12</h3>
                  <p className="text-xs text-green-600 mt-1">
                    +2 from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Participants
                  </p>
                  <h3 className="text-2xl font-bold mt-1">1,254</h3>
                  <p className="text-xs text-green-600 mt-1">
                    +85 from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Upcoming Events
                  </p>
                  <h3 className="text-2xl font-bold mt-1">8</h3>
                  <p className="text-xs text-blue-600 mt-1">Next: Today</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1">78%</h3>
                  <p className="text-xs text-amber-600 mt-1">
                    +5% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Programmes</CardTitle>
                <CardDescription>
                  Currently running educational programmes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Programme Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programmes.map((programme) => (
                        <TableRow key={programme.id}>
                          <TableCell className="font-medium">
                            {programme.name}
                          </TableCell>
                          <TableCell>{programme.type}</TableCell>
                          <TableCell>{programme.participants}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{programme.startDate}</div>
                              <div className="text-muted-foreground">
                                to {programme.endDate}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  programme.status === "Active"
                                    ? "bg-blue-600"
                                    : programme.status === "Closing"
                                    ? "bg-amber-600"
                                    : "bg-green-600"
                                }`}
                                style={{
                                  width: `${programme.completion}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {programme.completion}% Complete
                            </div>
                          </TableCell>
                          <TableCell>
                            {programme.status === "Active" ? (
                              <Badge className="bg-blue-100 text-blue-800">
                                Active
                              </Badge>
                            ) : programme.status === "Closing" ? (
                              <Badge className="bg-amber-100 text-amber-800">
                                Closing
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                Upcoming
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Programmes
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Scheduled activities and sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{event.attendees} registered attendees</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Programme Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium">Training Courses</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: "45%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">45%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium">Workshops</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: "25%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">25%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium">Mentorship</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: "15%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">15%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium">Seminars</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-600 h-2.5 rounded-full"
                        style={{
                          width: "10%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">10%</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium">Other</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{
                          width: "5%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participant Demographics</CardTitle>
              <CardDescription>
                Profile of programme participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium mb-2">Age Distribution</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Under 18</p>
                      <p className="font-semibold">25%</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">18-30</p>
                      <p className="font-semibold">45%</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">31-50</p>
                      <p className="font-semibold">20%</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Over 50</p>
                      <p className="font-semibold">10%</p>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-2">
                  <p className="font-medium mb-2">Gender Ratio</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-l-full"
                        style={{
                          width: "55%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Male: 55%</span>
                    <span>Female: 45%</span>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Background</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="font-semibold">40%</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Employed</p>
                      <p className="font-semibold">30%</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">
                        Entrepreneurs
                      </p>
                      <p className="font-semibold">15%</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">
                        Unemployed
                      </p>
                      <p className="font-semibold">15%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border-l-4 border-green-500 pl-4 py-1"
                  >
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-2 w-full">
                View All Achievements
                <ArrowUpRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default ProgrammesDashboard;
