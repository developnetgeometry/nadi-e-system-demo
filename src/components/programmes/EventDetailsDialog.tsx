
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Edit, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Participant {
  id: string;
  fullname: string;
  email: string;
  attendance: boolean;
}

interface EventDetails {
  id: string;
  program_name: string;
  description: string;
  location_event: string;
  start_datetime: string;
  end_datetime: string;
  duration: number;
  trainer_name: string;
  is_group_event: boolean;
  category_name: string;
  subcategory_name: string;
  program_name_nested: string;
  module_name: string;
  program_mode: number;
  total_participant: number;
  status_id: number;
  status_name: string;
}

interface EventDetailsDialogProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  eventId,
  open,
  onClose,
}) => {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        
        // Fetch event details with joins to get category, subcategory, program, and module names
        const { data: event, error } = await supabase
          .from("nd_event")
          .select(`
            id,
            program_name,
            description,
            location_event,
            start_datetime,
            end_datetime,
            duration,
            trainer_name,
            is_group_event,
            program_mode,
            total_participant,
            status_id,
            nd_event_status:status_id(id, name),
            nd_event_category:category_id(id, name),
            nd_event_subcategory:subcategory_id(id, name),
            nd_event_program:program_id(id, name),
            nd_event_module:module_id(id, name)
          `)
          .eq("id", eventId)
          .single();

        if (error) throw error;

        // Transform the data to the expected format
        const formattedEvent: EventDetails = {
          id: event.id,
          program_name: event.program_name,
          description: event.description || "No description available",
          location_event: event.location_event || "No location specified",
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
          duration: event.duration,
          trainer_name: event.trainer_name || "Not specified",
          is_group_event: event.is_group_event,
          category_name: event.nd_event_category?.name || "Unknown",
          subcategory_name: event.nd_event_subcategory?.name || "Unknown",
          program_name_nested: event.nd_event_program?.name || "Unknown",
          module_name: event.nd_event_module?.name || "Unknown",
          program_mode: event.program_mode,
          total_participant: event.total_participant || 0,
          status_id: event.status_id,
          status_name: event.nd_event_status?.name || "Unknown",
        };

        setEventDetails(formattedEvent);

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from("nd_event_participant")
          .select(`
            id,
            attendance,
            nd_member_profile:member_id(
              id,
              fullname,
              email
            )
          `)
          .eq("event_id", eventId);

        if (participantsError) throw participantsError;

        // Transform participant data
        const formattedParticipants = participantsData.map(participant => ({
          id: participant.id,
          fullname: participant.nd_member_profile?.fullname || "Unknown",
          email: participant.nd_member_profile?.email || "No email",
          attendance: participant.attendance || false,
        }));

        setParticipants(formattedParticipants);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && eventId) {
      fetchEventDetails();
    }
  }, [eventId, open]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  // Function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "registered":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Registered
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      case "postponed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
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

  // Check if event can be edited (status is draft or postponed)
  const canEditEvent = eventDetails && ["draft", "postponed"].includes(eventDetails.status_name.toLowerCase());

  const handleEdit = () => {
    if (eventDetails) {
      navigate(`/programmes/edit/${eventDetails.id}`);
      onClose();
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!eventDetails) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event not found</DialogTitle>
          </DialogHeader>
          <p>Sorry, we couldn't find details for this event.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{eventDetails.program_name}</DialogTitle>
            <div className="mt-2">{getStatusBadge(eventDetails.status_name)}</div>
          </div>
          {canEditEvent && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="participants">
              Participants ({participants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <CalendarIcon className="h-4 w-4 opacity-70" />
                    <span>
                      {formatDate(eventDetails.start_datetime)} -{" "}
                      {formatDate(eventDetails.end_datetime)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 opacity-70" />
                    <span>
                      {formatTime(eventDetails.start_datetime)} -{" "}
                      {formatTime(eventDetails.end_datetime)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 opacity-70" />
                    <span>{eventDetails.location_event}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Mode: </span>
                    <span>{eventDetails.program_mode === 1 ? "Online" : "Physical"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Programme Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Category: </span>
                      <span>{eventDetails.category_name}</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Pillar: </span>
                      <span>{eventDetails.subcategory_name}</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Programme: </span>
                      <span>{eventDetails.program_name_nested}</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Module: </span>
                      <span>{eventDetails.module_name}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Duration: </span>
                      <span>{eventDetails.duration.toFixed(1)} hours</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Max Participants: </span>
                      <span>{eventDetails.total_participant || "No limit"}</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Trainer: </span>
                      <span>{eventDetails.trainer_name}</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Group Event: </span>
                      <span>{eventDetails.is_group_event ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">
                  {eventDetails.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participant List</CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No participants registered for this event yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((participant) => (
                          <tr key={participant.id} className="border-b">
                            <td className="p-2 flex items-center">
                              <User className="h-4 w-4 mr-2 opacity-70" />
                              {participant.fullname}
                            </td>
                            <td className="p-2">{participant.email}</td>
                            <td className="p-2">
                              {participant.attendance ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Present
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Not Recorded
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
