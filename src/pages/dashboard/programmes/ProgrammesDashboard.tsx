import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

// Sample programme data for demonstration
const programmeStatusData = [
  { status: "Draft", count: 1, color: "bg-gray-200 text-gray-700" },
  {
    status: "Request Approval",
    count: 1,
    color: "bg-yellow-100 text-yellow-700",
  },
  { status: "Registered", count: 1, color: "bg-purple-100 text-purple-700" },
  { status: "Completed", count: 1, color: "bg-blue-100 text-blue-700" },
  { status: "Verified", count: 1, color: "bg-green-100 text-green-700" },
  { status: "Cancelled", count: 1, color: "bg-red-100 text-red-700" },
];

const recentProgrammes = [
  {
    id: 1,
    title: "Digital Literacy Workshop",
    location: "NADI 4U · Kuala Lumpur Training Center",
    category: "NADI 4U",
    status: "Draft",
  },
  {
    id: 2,
    title: "Cybersecurity Essentials",
    location: "NADI 2U · Penang Community Center",
    category: "NADI 2U",
    status: "Request Approval",
  },
  {
    id: 3,
    title: "Digital Marketing for SMEs",
    location: "Others · Johor Bahru Business Hub",
    category: "Others",
    status: "Registered",
  },
  {
    id: 4,
    title: "Financial Technology Workshop",
    location: "Others · Melaka Financial Center",
    category: "Others",
    status: "Cancelled",
  },
  {
    id: 5,
    title: "Entrepreneurship Workshop",
    location: "NADI 4U · Kuching Innovation Hub",
    category: "NADI 4U",
    status: "Completed",
  },
];

const programmeCategories = [
  { id: 1, name: "NADI 4U Programs", count: 2 },
  { id: 2, name: "NADI 2U Programs", count: 2 },
  { id: 3, name: "Other Programs", count: 2 },
];

const ProgrammesDashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || "user";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return (
          <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Draft
          </Badge>
        );
      case "Request Approval":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            Request Approval
          </Badge>
        );
      case "Registered":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            Registered
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Completed
          </Badge>
        );
      case "Verified":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            Verified
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Program Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          <Button asChild>
            <Link to="/programmes/registration">Register New Program</Link>
          </Button>
        </div>

        {/* Program Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {programmeCategories.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-3xl font-bold">{category.count}</span>
                    <Button variant="link" className="text-sm" asChild>
                      <Link to={`/programmes/${category.id}`}>View All</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Program Status Overview */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                Program Status Overview
              </h3>
              <div className="space-y-4">
                {programmeStatusData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${item.color}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Programs */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Programs</h3>
              <div className="space-y-4">
                {recentProgrammes.map((program) => (
                  <div
                    key={program.id}
                    className="border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{program.title}</h4>
                      {getStatusBadge(program.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {program.location}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Program Management */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Program Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium text-xl mb-2">NADI 4U</h4>
                <Button variant="outline" className="w-full">
                  <Link to="/programmes/nadi4u">View and manage programs</Link>
                </Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium text-xl mb-2">NADI 2U</h4>
                <Button variant="outline" className="w-full">
                  <Link to="/programmes/nadi2u">View and manage programs</Link>
                </Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium text-xl mb-2">Other Programs</h4>
                <Button variant="outline" className="w-full">
                  <Link to="/programmes/others">View and manage programs</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardLayout>
  );
};

export default ProgrammesDashboard;
