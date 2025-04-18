import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Settings,
  Award,
  FileText,
  Users,
  CalendarDays,
  Briefcase,
  School,
  Clock,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Sample data
const programmeTypes = [
  {
    id: 1,
    name: "Training Course",
    description: "Structured learning with defined curriculum",
    isActive: true,
  },
  {
    id: 2,
    name: "Workshop",
    description: "Short-term, intensive, hands-on learning",
    isActive: true,
  },
  {
    id: 3,
    name: "Seminar",
    description: "Presentations and discussions on specific topics",
    isActive: true,
  },
  {
    id: 4,
    name: "Mentorship",
    description: "One-on-one or small group guidance",
    isActive: true,
  },
  {
    id: 5,
    name: "Webinar",
    description: "Online educational presentation",
    isActive: true,
  },
  {
    id: 6,
    name: "Conference",
    description: "Large-scale event with multiple sessions",
    isActive: false,
  },
];
const certificateTemplates = [
  {
    id: 1,
    name: "Standard Completion",
    description: "Basic completion certificate",
    programmeTypes: ["All"],
    isDefault: true,
  },
  {
    id: 2,
    name: "Digital Skills Training",
    description: "Certificate for digital skills courses",
    programmeTypes: ["Training Course"],
    isDefault: false,
  },
  {
    id: 3,
    name: "Workshop Participation",
    description: "Certificate for workshop attendance",
    programmeTypes: ["Workshop"],
    isDefault: false,
  },
  {
    id: 4,
    name: "Mentorship Completion",
    description: "Certificate for mentorship programmes",
    programmeTypes: ["Mentorship"],
    isDefault: false,
  },
];
const assessmentTypes = [
  {
    id: 1,
    name: "Quiz",
    description: "Multiple choice questions",
    isActive: true,
  },
  {
    id: 2,
    name: "Project Submission",
    description: "Practical application assessment",
    isActive: true,
  },
  {
    id: 3,
    name: "Skills Demonstration",
    description: "Live demonstration of acquired skills",
    isActive: true,
  },
  {
    id: 4,
    name: "Peer Review",
    description: "Assessment by fellow participants",
    isActive: false,
  },
  {
    id: 5,
    name: "Written Exam",
    description: "Formal written assessment",
    isActive: true,
  },
];
const ProgrammeSettings = () => {
  // Function to simulate save settings
  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };
  return (
    <DashboardLayout>
      <div className="p-6 mx-auto space-y-6 w-full max-w-none overflow-x-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-xl">Programmes Settings</h1>
          <p className="text-muted-foreground">
            Configure programme management parameters
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="programme-types">Programme Types</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure default programme parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-capacity">
                      Default Maximum Capacity
                    </Label>
                    <Input
                      id="default-capacity"
                      type="number"
                      min="1"
                      defaultValue="30"
                    />
                    <p className="text-xs text-muted-foreground">
                      Default maximum number of participants per programme
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-capacity">
                      Minimum Capacity to Start
                    </Label>
                    <Input
                      id="min-capacity"
                      type="number"
                      min="1"
                      defaultValue="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum number of participants required to start a
                      programme
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registration-days">
                      Registration Lead Time (days)
                    </Label>
                    <Input
                      id="registration-days"
                      type="number"
                      min="0"
                      defaultValue="7"
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before programme start that registration closes
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Reminder Days</Label>
                    <Input
                      id="reminder-days"
                      type="number"
                      min="0"
                      defaultValue="3"
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before programme to send reminder notifications
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-duration">
                      Default Session Duration (hours)
                    </Label>
                    <Input
                      id="default-duration"
                      type="number"
                      min="0.5"
                      step="0.5"
                      defaultValue="2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Default duration of a single programme session
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-window">
                      Feedback Window (days)
                    </Label>
                    <Input
                      id="feedback-window"
                      type="number"
                      min="1"
                      defaultValue="7"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days participants have to submit feedback after
                      completion
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="allow-waitlist" defaultChecked />
                  <Label htmlFor="allow-waitlist">
                    Enable waitlist for full programmes
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-certificates" defaultChecked />
                  <Label htmlFor="auto-certificates">
                    Automatically generate certificates upon completion
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="require-assessment" />
                  <Label htmlFor="require-assessment">
                    Require assessment completion for certification
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Reset to Defaults
                </Button>
                <Button onClick={saveSettings} className="gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programme Calendar Settings</CardTitle>
                <CardDescription>
                  Configure calendar and scheduling parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calendar-view">Default Calendar View</Label>
                    <select
                      id="calendar-view"
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="day">Day</option>
                      <option selected value="week">
                        Week
                      </option>
                      <option value="month">Month</option>
                      <option value="agenda">Agenda</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="week-starts">Week Starts On</Label>
                    <select
                      id="week-starts"
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="sunday">Sunday</option>
                      <option selected value="monday">
                        Monday
                      </option>
                      <option value="saturday">Saturday</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-hours-start">
                      Business Hours Start
                    </Label>
                    <select
                      id="business-hours-start"
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="7">7:00 AM</option>
                      <option value="8">8:00 AM</option>
                      <option selected value="9">
                        9:00 AM
                      </option>
                      <option value="10">10:00 AM</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-hours-end">
                      Business Hours End
                    </Label>
                    <select
                      id="business-hours-end"
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="16">4:00 PM</option>
                      <option value="17">5:00 PM</option>
                      <option selected value="18">
                        6:00 PM
                      </option>
                      <option value="19">7:00 PM</option>
                      <option value="20">8:00 PM</option>
                      <option value="21">9:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="show-holidays" defaultChecked />
                  <Label htmlFor="show-holidays">
                    Show public holidays in calendar
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="conflict-warning" defaultChecked />
                  <Label htmlFor="conflict-warning">
                    Warn about scheduling conflicts
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="allow-overlap" />
                  <Label htmlFor="allow-overlap">
                    Allow overlapping programme schedules
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button onClick={saveSettings} className="gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="programme-types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programme Types</CardTitle>
                <CardDescription>
                  Manage different types of programmes offered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programmeTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell>
                          {type.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Button className="gap-2">
                    <Plus size={16} />
                    Add Programme Type
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programme Categories</CardTitle>
                <CardDescription>
                  Organize programmes into categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase size={18} />
                        Professional Development
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Career and skill enhancement programmes
                      </p>
                      <div className="mt-2 space-y-1">
                        <Badge variant="outline">IT Certifications</Badge>
                        <Badge variant="outline">Management Skills</Badge>
                        <Badge variant="outline">Career Planning</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <School size={18} />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Educational and learning programmes
                      </p>
                      <div className="mt-2 space-y-1">
                        <Badge variant="outline">Digital Literacy</Badge>
                        <Badge variant="outline">Youth Education</Badge>
                        <Badge variant="outline">Adult Learning</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users size={18} />
                        Community
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Community-focused engagement programmes
                      </p>
                      <div className="mt-2 space-y-1">
                        <Badge variant="outline">Digital Inclusion</Badge>
                        <Badge variant="outline">Senior Outreach</Badge>
                        <Badge variant="outline">Social Initiatives</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen size={18} />
                        Technical Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Technical and hands-on skill development
                      </p>
                      <div className="mt-2 space-y-1">
                        <Badge variant="outline">Programming</Badge>
                        <Badge variant="outline">Web Development</Badge>
                        <Badge variant="outline">Database Skills</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="mt-4">
                  <Button className="gap-2">
                    <Plus size={16} />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Duration Settings</CardTitle>
                <CardDescription>
                  Configure standard durations by programme type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="training-duration">Training Course</Label>
                    <div className="flex gap-2">
                      <Input
                        id="training-duration"
                        type="number"
                        min="1"
                        defaultValue="8"
                      />
                      <select className="border rounded-md p-2">
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option selected value="weeks">
                          Weeks
                        </option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workshop-duration">Workshop</Label>
                    <div className="flex gap-2">
                      <Input
                        id="workshop-duration"
                        type="number"
                        min="1"
                        defaultValue="4"
                      />
                      <select className="border rounded-md p-2">
                        <option selected value="hours">
                          Hours
                        </option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seminar-duration">Seminar</Label>
                    <div className="flex gap-2">
                      <Input
                        id="seminar-duration"
                        type="number"
                        min="1"
                        defaultValue="2"
                      />
                      <select className="border rounded-md p-2">
                        <option selected value="hours">
                          Hours
                        </option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentorship-duration">Mentorship</Label>
                    <div className="flex gap-2">
                      <Input
                        id="mentorship-duration"
                        type="number"
                        min="1"
                        defaultValue="12"
                      />
                      <select className="border rounded-md p-2">
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option selected value="months">
                          Months
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button onClick={saveSettings} className="gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Templates</CardTitle>
                <CardDescription>
                  Manage certificate designs and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Applies To</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificateTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>{template.description}</TableCell>
                        <TableCell>
                          {template.programmeTypes.join(", ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={template.isDefault}
                              disabled={template.isDefault}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={template.isDefault}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Button className="gap-2">
                    <Plus size={16} />
                    Add Certificate Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Generation Settings</CardTitle>
                <CardDescription>
                  Configure certificate generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-prefix">
                    Certificate Number Prefix
                  </Label>
                  <Input
                    id="certificate-prefix"
                    placeholder="e.g., CERT-"
                    defaultValue="CERT-"
                  />
                  <p className="text-xs text-muted-foreground">
                    Prefix for certificate identification numbers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuing-authority">Issuing Authority</Label>
                  <Input
                    id="issuing-authority"
                    placeholder="e.g., Organization Name"
                    defaultValue="NADI Digital Skills Programme"
                  />
                  <p className="text-xs text-muted-foreground">
                    Official authority name shown on certificates
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validity-period">
                      Certificate Validity Period
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="validity-period"
                        type="number"
                        min="0"
                        defaultValue="0"
                      />
                      <select className="border rounded-md p-2">
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option selected value="years">
                          Years
                        </option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Duration certificates remain valid (0 = unlimited)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="digital-signature">
                      Digital Signature Type
                    </Label>
                    <select
                      id="digital-signature"
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="none">None</option>
                      <option selected value="image">
                        Image Signature
                      </option>
                      <option value="digital">Digital Certificate</option>
                      <option value="blockchain">
                        Blockchain Verification
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-email" defaultChecked />
                  <Label htmlFor="auto-email">
                    Automatically email certificates to participants
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="verification-qr" defaultChecked />
                  <Label htmlFor="verification-qr">
                    Include QR code for certificate verification
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="allow-download" defaultChecked />
                  <Label htmlFor="allow-download">
                    Allow participants to download certificates
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Preview Certificate
                </Button>
                <Button onClick={saveSettings} className="gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Types</CardTitle>
                <CardDescription>
                  Configure methods for evaluating participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentTypes.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {assessment.name}
                        </TableCell>
                        <TableCell>{assessment.description}</TableCell>
                        <TableCell>
                          {assessment.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4">
                  <Button className="gap-2 bg-[#8079b9]">
                    <Plus size={16} />
                    Add Assessment Type
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grading System</CardTitle>
                <CardDescription>
                  Configure assessment grading parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grading-system">Default Grading System</Label>
                  <select
                    id="grading-system"
                    className="border rounded-md p-2 w-full"
                  >
                    <option selected value="percentage">
                      Percentage (0-100%)
                    </option>
                    <option value="letter">Letter Grade (A-F)</option>
                    <option value="pass-fail">Pass/Fail</option>
                    <option value="competency">Competency Based</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passing-grade">Default Passing Grade</Label>
                  <div className="flex gap-2">
                    <Input
                      id="passing-grade"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue="70"
                    />
                    <span className="flex items-center">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum score required to pass assessments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Grade Definitions</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="grade-a">A Grade (Excellent)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="grade-a-min"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="90"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            id="grade-a-max"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="100"
                          />
                          <span className="flex items-center">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="grade-b">B Grade (Good)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="grade-b-min"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="80"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            id="grade-b-max"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="89"
                          />
                          <span className="flex items-center">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="grade-c">C Grade (Satisfactory)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="grade-c-min"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="70"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            id="grade-c-max"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="79"
                          />
                          <span className="flex items-center">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="grade-d">
                          D Grade (Needs Improvement)
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="grade-d-min"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="60"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            id="grade-d-max"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="69"
                          />
                          <span className="flex items-center">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="grade-f">F Grade (Fail)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="grade-f-min"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="0"
                          />
                          <span className="flex items-center">-</span>
                          <Input
                            id="grade-f-max"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="59"
                          />
                          <span className="flex items-center">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="allow-retakes" defaultChecked />
                  <Label htmlFor="allow-retakes">
                    Allow assessment retakes
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-retakes">Maximum Retake Attempts</Label>
                  <Input
                    id="max-retakes"
                    type="number"
                    min="1"
                    defaultValue="2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of times participants can retake assessments
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Reset to Defaults
                </Button>
                <Button onClick={saveSettings} className="gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure programme-related notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Participant Notifications
                  </Label>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-registration" defaultChecked />
                        <Label htmlFor="notify-registration">
                          Registration confirmation
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-reminder" defaultChecked />
                        <Label htmlFor="notify-reminder">
                          Programme start reminder
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-schedule-change" defaultChecked />
                        <Label htmlFor="notify-schedule-change">
                          Schedule changes
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-completion" defaultChecked />
                        <Label htmlFor="notify-completion">
                          Programme completion
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-certificate" defaultChecked />
                        <Label htmlFor="notify-certificate">
                          Certificate available
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Instructor Notifications
                  </Label>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-session-assigned" defaultChecked />
                        <Label htmlFor="notify-session-assigned">
                          Session assignment
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-roster-update" defaultChecked />
                        <Label htmlFor="notify-roster-update">
                          Participant roster updates
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-feedback-available" defaultChecked />
                        <Label htmlFor="notify-feedback-available">
                          Participant feedback available
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Administrator Notifications
                  </Label>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-low-registration" defaultChecked />
                        <Label htmlFor="notify-low-registration">
                          Low registration alert
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-full-capacity" defaultChecked />
                        <Label htmlFor="notify-full-capacity">
                          Programme at capacity
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-programme-summary" defaultChecked />
                        <Label htmlFor="notify-programme-summary">
                          Programme completion summary
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <FileText size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Test Notifications
                </Button>
                <Button onClick={saveSettings} className="gap-2 bg-[#8079b9]">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Channels</CardTitle>
                <CardDescription>
                  Configure notification delivery methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <h3 className="font-medium">Email Notifications</h3>
                      </div>
                      <Switch id="enable-email" defaultChecked />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="email-sender">Sender Name</Label>
                        <Input
                          id="email-sender"
                          defaultValue="NADI Digital Skills Programme"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="email-address">Sender Email</Label>
                        <Input
                          id="email-address"
                          defaultValue="notifications@nadi.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <FileText size={18} className="text-green-600" />
                        </div>
                        <h3 className="font-medium">SMS Notifications</h3>
                      </div>
                      <Switch id="enable-sms" />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="sms-sender">Sender ID</Label>
                        <Input id="sms-sender" defaultValue="NADI" />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="sms-template">Default Template</Label>
                        <textarea
                          id="sms-template"
                          className="border rounded-md p-2 w-full h-16"
                          defaultValue="NADI: {{message_type}}. For details, please check your email or visit our portal."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <FileText size={18} className="text-purple-600" />
                        </div>
                        <h3 className="font-medium">In-App Notifications</h3>
                      </div>
                      <Switch id="enable-inapp" defaultChecked />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <Label htmlFor="notify-dashboard">
                          Show on dashboard
                        </Label>
                        <Switch id="notify-dashboard" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-popup">Show as popup</Label>
                        <Switch id="notify-popup" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <FileText size={18} className="text-amber-600" />
                        </div>
                        <h3 className="font-medium">Calendar Integration</h3>
                      </div>
                      <Switch id="enable-calendar" defaultChecked />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <Label htmlFor="add-ical">
                          Include iCal attachments
                        </Label>
                        <Switch id="add-ical" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="add-gcal">
                          Add Google Calendar link
                        </Label>
                        <Switch id="add-gcal" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button onClick={saveSettings} className="gap-2 bg-[#8079b9]">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
export default ProgrammeSettings;
