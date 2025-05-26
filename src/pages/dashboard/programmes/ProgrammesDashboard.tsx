import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ProgrammesDashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || "user";

  // State for storing data
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([
    { id: 1, name: "NADI 4U Programs", count: 0 },
    { id: 2, name: "NADI 2U Programs", count: 0 },
    { id: 3, name: "Other Programs", count: 0 },
  ]);
  const [statusData, setStatusData] = useState([]);
  const [recentProgrammes, setRecentProgrammes] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch program counts by category
        const { data: eventData, error: eventError } = await supabase
          .from("nd_event")
          .select("category_id");

        if (eventError) throw eventError;

        // Count programs by category
        const categoryCounts = { 1: 0, 2: 0, 3: 0 };
        eventData.forEach((event) => {
          if (
            event.category_id &&
            categoryCounts[event.category_id] !== undefined
          ) {
            categoryCounts[event.category_id]++;
          }
        });

        // Update category data with counts
        setCategoryData((prevData) =>
          prevData.map((cat) => ({
            ...cat,
            count: categoryCounts[cat.id] || 0,
          }))
        );

        // Fetch status data
        const { data: statusData, error: statusError } = await supabase
          .from("nd_event_status")
          .select("id, name");

        if (statusError) throw statusError;

        // Fetch count for each status
        const statusWithCounts = await Promise.all(
          statusData.map(async (status) => {
            const { count, error: countError } = await supabase
              .from("nd_event")
              .select("*", { count: "exact", head: true })
              .eq("status_id", status.id);

            if (countError) throw countError;

            // Determine color based on status name
            let color = "bg-gray-200 text-gray-700";
            switch (status.name?.toLowerCase()) {
              case "draft":
                color = "bg-gray-200 text-gray-700";
                break;
              case "request approval":
              case "pending approval":
                color = "bg-yellow-100 text-yellow-700";
                break;
              case "registered":
                color = "bg-purple-100 text-purple-700";
                break;
              case "completed":
                color = "bg-blue-100 text-blue-700";
                break;
              case "verified":
                color = "bg-green-100 text-green-700";
                break;
              case "cancelled":
                color = "bg-red-100 text-red-700";
                break;
              default:
                color = "bg-gray-200 text-gray-700";
            }

            return {
              status: status.name,
              count: count || 0,
              color,
            };
          })
        );

        setStatusData(statusWithCounts);

        // Fetch recent programs
        const { data: recentData, error: recentError } = await supabase
          .from("nd_event")
          .select(
            `
            id, 
            program_name,
            location_event,
            nd_event_category:category_id(name),
            nd_event_status:status_id(name)
          `
          )
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        // Format recent programs data
        const formattedRecentData = recentData.map((item) => ({
          id: item.id,
          title: item.program_name || "Untitled Program",
          location: item.location_event || "No location specified",
          category: item.nd_event_category?.name || "Uncategorized",
          status: item.nd_event_status?.name || "Unknown Status",
        }));

        setRecentProgrammes(formattedRecentData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get badge for status
  const getStatusBadge = (status) => {
    if (!status) return <Badge>Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "draft":
        return (
          <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Draft
          </Badge>
        );
      case "request approval":
      case "pending approval":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            Request Approval
          </Badge>
        );
      case "registered":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            Registered
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Completed
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            Verified
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <PageContainer>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading dashboard data...</span>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div>
      <PageContainer>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Program Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          {/* Register New Program button removed */}
        </div>

        {/* Program Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categoryData.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-3xl font-bold">{category.count}</span>
                    <Button variant="link" className="text-sm" asChild>
                      <Link
                        to={`/programmes/${
                          category.id === 1
                            ? "nadi4u"
                            : category.id === 2
                            ? "nadi2u"
                            : "others"
                        }`}
                      >
                        View All
                      </Link>
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
                {statusData.map((item, index) => (
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
                {recentProgrammes.length === 0 ? (
                  <p className="text-muted-foreground">
                    No recent programs found
                  </p>
                ) : (
                  recentProgrammes.map((program) => (
                    <div
                      key={program.id}
                      className="border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{program.title}</h4>
                        {getStatusBadge(program.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.category} · {program.location}
                      </p>
                    </div>
                  ))
                )}
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
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/programmes/nadi4u">View and manage programs</Link>
                </Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium text-xl mb-2">NADI 2U</h4>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/programmes/nadi2u">View and manage programs</Link>
                </Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium text-xl mb-2">Other Programs</h4>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/programmes/others">View and manage programs</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
};

export default ProgrammesDashboard;
