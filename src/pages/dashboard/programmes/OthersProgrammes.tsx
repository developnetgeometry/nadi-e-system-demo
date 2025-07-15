import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { Loader2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import EventDetailsDialog from "@/components/programmes/EventDetailsDialog";

const OthersProgrammes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch event statuses for filter
        const { data: statusData, error: statusError } = await supabase
          .from("nd_event_status")
          .select("id, name");

        if (statusError) throw statusError;
        setStatuses(statusData);

        // Fetch programs where category_id is 3 (Other Programs)
        const { data: programData, error: programError } = await supabase
          .from("nd_event")
          .select(
            `
            id,
            program_name,
            location_event,
            site_id,
            start_datetime,
            end_datetime,
            created_by,
            nd_event_status:status_id(id, name),
            nd_site:site_id(
              nd_site_profile:site_profile_id(
                sitename
              )
            )
          `
          )
          .eq("category_id", 3);

        if (programError) throw programError;

        // Format data
        const formattedData = await Promise.all(
          programData.map(async (program) => {
            // Get creator's name if possible
            let creatorName = "Unknown";
            if (program.created_by) {
              const { data: userData } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", program.created_by)
                .single();

              creatorName = userData?.full_name || "Unknown";
            }

            const formattedProgram = {
              id: program.id,
              title: program.program_name || "Untitled Program",
              location:
                program.nd_site?.nd_site_profile?.sitename ||
                program.location_event ||
                "No Location",
              date: program.start_datetime || new Date().toISOString(),
              createdBy: creatorName,
              status: program.nd_event_status?.name?.toLowerCase() || "draft",
              statusId: program.nd_event_status?.id || 1, // Default to 1 (Draft) if no status
              nd_event_status: program.nd_event_status, // Keep the original structure for consistency
            };

            // Debug log to check the status data
            console.log("Program status data:", {
              id: program.id,
              statusId: formattedProgram.statusId,
              statusName: program.nd_event_status?.name,
              originalStatus: program.nd_event_status,
            });

            return formattedProgram;
          })
        );

        setProgrammes(formattedData);
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get badge variant based on status
  const getStatusBadge = (statusId: string | number | undefined) => {
    // Convert to string for consistent comparison
    const status = String(statusId);

    // Debug log to check what status is being processed
    console.log("Getting status badge for:", { statusId, status });

    switch (status) {
      case "1":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Draft
          </Badge>
        );
      case "2":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Submitted
          </Badge>
        );
      case "3":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Open For Registration
          </Badge>
        );
      case "4":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Closed For Registration
          </Badge>
        );
      case "5":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Ongoing
          </Badge>
        );
      case "6":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Completed
          </Badge>
        );
      case "7":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            Cancelled
          </Badge>
        );
      case "8":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            Postponed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Draft
          </Badge>
        );
    }
  };

  // Filter programmes based on search query and status
  const filteredProgrammes = programmes.filter((programme) => {
    const matchesSearch =
      programme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      String(programme.statusId) === statusFilter ||
      programme.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    setSelectedEventId(id);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div>
        <div className="space-y-1 py-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading programs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="space-y-1 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Other Programs</h1>
            <Button asChild>
              <Link to="/programmes/registration?category=3">
                <PlusCircle className="mr-2 h-4 w-4" />
                Register New Program
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <Input
                  placeholder="Search programs..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No programmes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProgrammes.map((programme) => (
                        <TableRow
                          key={programme.id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell
                            className="font-medium"
                            onClick={() => handleViewDetails(programme.id)}
                          >
                            {programme.title}
                          </TableCell>
                          <TableCell
                            onClick={() => handleViewDetails(programme.id)}
                          >
                            {programme.location}
                          </TableCell>
                          <TableCell
                            onClick={() => handleViewDetails(programme.id)}
                          >
                            {formatDate(programme.date)}
                          </TableCell>
                          <TableCell
                            onClick={() => handleViewDetails(programme.id)}
                          >
                            {programme.createdBy}
                          </TableCell>
                          <TableCell
                            onClick={() => handleViewDetails(programme.id)}
                          >
                            {getStatusBadge(programme.statusId)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(programme.id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <EventDetailsDialog
            eventId={selectedEventId}
            open={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default OthersProgrammes;
