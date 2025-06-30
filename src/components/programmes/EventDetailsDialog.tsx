import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventQRCodeGenerator } from "@/components/programmes/EventQRCodeGenerator";
import {
  CalendarIcon,
  Clock,
  Edit,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  fullname: string;
  email: string;
  attendance: boolean;
  verified_by: string | null;
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
  is_acknowledge: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [attendanceUpdates, setAttendanceUpdates] = useState<
    Record<string, boolean>
  >({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [overallVerificationAcknowledged, setOverallVerificationAcknowledged] =
    useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch event details with joins to get category, subcategory, program, and module names
        const { data: event, error } = await supabase
          .from("nd_event")
          .select(
            `
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
            is_acknowledge,
            nd_event_status:status_id(id, name),
            nd_event_category:category_id(id, name),
            nd_event_subcategory:subcategory_id(id, name),
            nd_event_program:program_id(id, name),
            nd_event_module:module_id(id, name)
          `
          )
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
          duration: event.duration || 0, // Provide default value for duration
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
          is_acknowledge: event.is_acknowledge || false,
        };

        setEventDetails(formattedEvent);
        
        // Set the acknowledgment state from the database
        setOverallVerificationAcknowledged(formattedEvent.is_acknowledge);

        // Fetch participants
        const { data: participantsData, error: participantsError } =
          await supabase
            .from("nd_event_participant")
            .select(
              `
            id,
            attendance,
            verified_by,
            nd_member_profile:member_id(
              id,
              fullname,
              email
            )
          `
            )
            .eq("event_id", eventId);

        if (participantsError) throw participantsError;

        // Transform participant data
        const formattedParticipants = participantsData.map((participant) => ({
          id: participant.id.toString(), // Convert to string to match interface
          fullname: participant.nd_member_profile?.fullname || "Unknown",
          email: participant.nd_member_profile?.email || "No email",
          attendance: participant.attendance || false,
          verified_by: participant.verified_by,
        }));

        setParticipants(formattedParticipants);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (open && eventId) {
      fetchEventDetails();
    } else if (!open) {
      // Reset states when dialog is closed
      setEventDetails(null);
      setParticipants([]);
      setError(null);
      setLoading(true);
      setAttendanceUpdates({});
      setOverallVerificationAcknowledged(false);
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
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Published
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
  const canEditEvent =
    eventDetails &&
    ["draft", "postponed"].includes(eventDetails.status_name.toLowerCase());

  // Check if attendance can be verified (status is completed)
  const canVerifyAttendance = eventDetails && eventDetails.status_id === 6; // status_id 6 is COMPLETED

  // Check if event status can be updated (status is published)
  const canUpdateStatus = eventDetails && eventDetails.status_id === 2; // status_id 2 is PUBLISHED

  const handleEdit = () => {
    if (eventDetails) {
      navigate(`/programmes/edit/${eventDetails.id}`);
      onClose();
    }
  };

  const handleStatusUpdate = async (
    newStatusId: number,
    statusName: string
  ) => {
    if (!currentUserId || !eventDetails) {
      toast({
        title: "Error",
        description: "You must be logged in to update event status.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("nd_event")
        .update({
          status_id: newStatusId,
          updated_at: new Date().toISOString(),
          updated_by: currentUserId,
        })
        .eq("id", eventDetails.id);

      if (error) throw error;

      // Update local state
      setEventDetails((prev) =>
        prev
          ? {
              ...prev,
              status_id: newStatusId,
              status_name: statusName,
            }
          : null
      );

      toast({
        title: "Success",
        description: `Event status updated to ${statusName} successfully.`,
      });
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAttendanceChange = (
    participantId: string,
    isPresent: boolean
  ) => {
    setAttendanceUpdates((prev) => ({
      ...prev,
      [participantId]: isPresent,
    }));
  };

  const saveAttendanceUpdates = async () => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "You must be logged in to save attendance.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(attendanceUpdates).length === 0) {
      toast({
        title: "No Changes",
        description: "No attendance changes were made.",
        variant: "default",
      });
      return;
    }

    if (!overallVerificationAcknowledged) {
      toast({
        title: "Acknowledgment Required",
        description:
          "Please acknowledge that you have verified the overall attendance before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update attendance for all changed participants
      const updates = Object.entries(attendanceUpdates).map(
        ([participantId, attendance]) =>
          supabase
            .from("nd_event_participant")
            .update({
              attendance,
              verified_by: attendance ? currentUserId : null,
              updated_at: new Date().toISOString(),
              updated_by: currentUserId,
            })
            .eq("id", parseInt(participantId))
      );

      const results = await Promise.all(updates);

      // Check for any errors
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error("Some attendance updates failed");
      }

      // Update the event's acknowledgment status
      const { error: eventUpdateError } = await supabase
        .from("nd_event")
        .update({
          is_acknowledge: overallVerificationAcknowledged,
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventId);

      if (eventUpdateError) {
        throw new Error("Failed to update event acknowledgment status");
      }

      // Update local state
      setParticipants((prev) =>
        prev.map((participant) => {
          if (attendanceUpdates[participant.id] !== undefined) {
            return {
              ...participant,
              attendance: attendanceUpdates[participant.id],
              verified_by: attendanceUpdates[participant.id]
                ? currentUserId
                : null,
            };
          }
          return participant;
        })
      );

      // Update the event details to reflect the acknowledgment
      setEventDetails((prev) => 
        prev ? { ...prev, is_acknowledge: overallVerificationAcknowledged } : prev
      );

      // Clear the updates
      setAttendanceUpdates({});

      toast({
        title: "Success",
        description: `Attendance updated for ${
          Object.keys(attendanceUpdates).length
        } participants. Overall verification has been acknowledged.`,
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance updates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Event Details</DialogTitle>
            <DialogDescription>
              Please wait while we load the event information
            </DialogDescription>
          </DialogHeader>
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
            <DialogDescription>Unable to load event details</DialogDescription>
          </DialogHeader>
          <p>{error || "Sorry, we couldn't find details for this event."}</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">
              {eventDetails.program_name}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this programme event
            </DialogDescription>
            <div className="mt-2 flex items-center gap-2">
              {getStatusBadge(eventDetails.status_name)}
              {canUpdateStatus && (
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(6, "Completed")}
                    disabled={isUpdatingStatus}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(7, "Cancelled")}
                    disabled={isUpdatingStatus}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Mark as Cancelled
                  </Button>
                </div>
              )}
            </div>
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
                    <span>
                      {eventDetails.program_mode === 1 ? "Online" : "Physical"}
                    </span>
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
                      <span>
                        {eventDetails.duration != null
                          ? `${eventDetails.duration.toFixed(1)} hours`
                          : "Duration not specified"}
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Max Participants: </span>
                      <span>
                        {eventDetails.total_participant || "No limit"}
                      </span>
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
                <div
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: eventDetails.description }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Registration QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EventQRCodeGenerator
                  eventId={eventId!}
                  eventTitle={eventDetails.program_name}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Participant List</CardTitle>
                    {canVerifyAttendance && (
                      <div className="flex items-center space-x-2">
                        {Object.keys(attendanceUpdates).length > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            {Object.keys(attendanceUpdates).length} pending
                            changes
                          </Badge>
                        )}
                        <Button
                          onClick={saveAttendanceUpdates}
                          disabled={
                            isSaving ||
                            Object.keys(attendanceUpdates).length === 0
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving
                            ? "Saving..."
                            : `Save Changes${
                                Object.keys(attendanceUpdates).length > 0
                                  ? ` (${
                                      Object.keys(attendanceUpdates).length
                                    })`
                                  : ""
                              }`}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Overall Verification Acknowledgment */}
                  {canVerifyAttendance && participants.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="overall-verification"
                          checked={overallVerificationAcknowledged}
                          onCheckedChange={(checked) =>
                            setOverallVerificationAcknowledged(
                              checked as boolean
                            )
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor="overall-verification"
                            className="text-sm font-medium text-blue-900 cursor-pointer"
                          >
                            I acknowledge that I have verified the attendance of
                            all participants
                          </label>
                          <p className="text-xs text-blue-700 mt-1">
                            This confirms that you have reviewed and verified
                            the attendance status for this event. This action
                            will be logged for audit purposes.
                          </p>
                        </div>
                      </div>
                      {overallVerificationAcknowledged && (
                        <div className="mt-3 flex items-center space-x-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Overall attendance verification acknowledged
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-0">
                {participants.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No participants registered
                    </p>
                    <p className="text-gray-400 text-sm">
                      No one has registered for this event yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left p-4 font-medium text-gray-700">
                              Participant
                            </th>
                            <th className="text-left p-4 font-medium text-gray-700">
                              Email
                            </th>
                            {canVerifyAttendance && (
                              <th className="text-left p-4 font-medium text-gray-700">
                                Mark Attendance
                              </th>
                            )}
                            <th className="text-left p-4 font-medium text-gray-700">
                              Status
                            </th>
                            {canVerifyAttendance && (
                              <th className="text-left p-4 font-medium text-gray-700">
                                Verification
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {participants.map((participant, index) => {
                            const currentAttendance =
                              attendanceUpdates[participant.id] !== undefined
                                ? attendanceUpdates[participant.id]
                                : participant.attendance;

                            const hasChanges =
                              attendanceUpdates[participant.id] !== undefined;

                            return (
                              <tr
                                key={participant.id}
                                className={`hover:bg-gray-50 transition-colors ${
                                  hasChanges
                                    ? "bg-yellow-50 border-l-4 border-l-yellow-400"
                                    : ""
                                }`}
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500" />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {participant.fullname}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Participant #{index + 1}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm text-gray-900">
                                    {participant.email}
                                  </div>
                                </td>
                                {canVerifyAttendance && (
                                  <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                      <Checkbox
                                        checked={currentAttendance}
                                        onCheckedChange={(checked) =>
                                          handleAttendanceChange(
                                            participant.id,
                                            checked as boolean
                                          )
                                        }
                                        className="h-5 w-5"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Present
                                      </span>
                                      {hasChanges && (
                                        <Badge
                                          variant="outline"
                                          className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs"
                                        >
                                          Modified
                                        </Badge>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="p-4">
                                  <div className="flex flex-col space-y-1">
                                    {currentAttendance ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800 border-green-300 w-fit"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Present
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="bg-gray-100 text-gray-700 border-gray-300 w-fit"
                                      >
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Absent
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                {canVerifyAttendance && (
                                  <td className="p-4">
                                    {participant.verified_by ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-800 border-blue-300 w-fit"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-800 border-yellow-300 w-fit"
                                      >
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Footer */}
                    {canVerifyAttendance && (
                      <div className="mt-6 px-4 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-900">
                              {participants.length}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Registered
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-green-600">
                              {
                                participants.filter((p) => {
                                  const attendance =
                                    attendanceUpdates[p.id] !== undefined
                                      ? attendanceUpdates[p.id]
                                      : p.attendance;
                                  return attendance;
                                }).length
                              }
                            </div>
                            <div className="text-sm text-gray-600">Present</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-blue-600">
                              {participants.filter((p) => p.verified_by).length}
                            </div>
                            <div className="text-sm text-gray-600">
                              Verified
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-orange-600">
                              {Object.keys(attendanceUpdates).length}
                            </div>
                            <div className="text-sm text-gray-600">
                              Pending Changes
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
