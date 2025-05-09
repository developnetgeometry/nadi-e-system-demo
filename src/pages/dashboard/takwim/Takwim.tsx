import { useState, useEffect } from "react";
import { format, isSaturday, isSunday } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TakwimEventDialog } from "@/components/takwim/TakwimEventDialog";
import {
  TakwimEvent,
  EventType,
  EventCategory,
  Pillar,
  Programme,
  Module,
} from "@/types/takwim";
import { useHolidays } from "@/hooks/use-holidays";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { getHolidaysForDate } from "@/utils/holidayUtils";
import { Badge } from "@/components/ui/badge";

export default function Takwim() {
  const [date, setDate] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [events, setEvents] = useState<TakwimEvent[]>([
    {
      id: "1",
      title: "Strategic Planning Meeting",
      startDate: new Date(2024, 3, 20),
      endDate: new Date(2024, 3, 20),
      startTime: "10:00",
      endTime: "12:00",
      type: "meeting",
      description: "Annual strategic planning session",
      location: "Conference Room A",
      category: "cat1",
      pillar: "pil1",
      programme: "prog1",
      module: "mod1",
      isGroupEvent: true,
      mode: "Physical",
      targetParticipant: "Department Heads",
      trainerName: "John Facilitator",
      duration: "2h",
    },
    {
      id: "2",
      title: "Digital Transformation Project Kickoff",
      startDate: new Date(2024, 3, 21),
      endDate: new Date(2024, 3, 21),
      startTime: "14:00",
      endTime: "15:30",
      type: "project",
      description: "Kickoff for the new digital transformation project",
      location: "Meeting Room 3",
      category: "cat2",
      pillar: "pil2",
      programme: "prog2",
      module: "mod2",
      isGroupEvent: false,
      mode: "Online",
      targetParticipant: "IT Team",
      trainerName: "Sarah Project Manager",
      duration: "1h 30m",
    },
  ]);

  // Get holidays from the hook
  const { holidays } = useHolidays(new Date().getFullYear());
  // Get holidays for the selected date
  const selectedDateHolidays = getHolidaysForDate(date, holidays);

  // Sample data for categories and related items
  const eventTypes: EventType[] = [
    { value: "meeting", label: "Meeting", color: "bg-blue-100 text-blue-800" },
    {
      value: "project",
      label: "Project",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "training",
      label: "Training",
      color: "bg-amber-100 text-amber-800",
    },
    { value: "event", label: "Event", color: "bg-purple-100 text-purple-800" },
  ];

  // Sample data for hierarchical selections
  const categories: EventCategory[] = [
    { value: "cat1", label: "Administration" },
    { value: "cat2", label: "Technology" },
    { value: "cat3", label: "Finance" },
  ];

  const pillars: Pillar[] = [
    { value: "pil1", label: "Policy Management", categoryId: "cat1" },
    { value: "pil2", label: "Staff Development", categoryId: "cat1" },
    { value: "pil3", label: "Software Development", categoryId: "cat2" },
    { value: "pil4", label: "Infrastructure", categoryId: "cat2" },
    { value: "pil5", label: "Budgeting", categoryId: "cat3" },
    { value: "pil6", label: "Reporting", categoryId: "cat3" },
  ];

  const programmes: Programme[] = [
    { value: "prog1", label: "Policy Review", pillarId: "pil1" },
    { value: "prog2", label: "Leadership Training", pillarId: "pil2" },
    { value: "prog3", label: "Agile Development", pillarId: "pil3" },
    { value: "prog4", label: "Cloud Migration", pillarId: "pil4" },
    { value: "prog5", label: "Annual Budget", pillarId: "pil5" },
    { value: "prog6", label: "Financial Analysis", pillarId: "pil6" },
  ];

  const modules: Module[] = [
    { value: "mod1", label: "Policy Documentation", programmeId: "prog1" },
    { value: "mod2", label: "Team Building", programmeId: "prog2" },
    { value: "mod3", label: "Scrum Methodology", programmeId: "prog3" },
    { value: "mod4", label: "AWS Setup", programmeId: "prog4" },
    { value: "mod5", label: "Budget Allocation", programmeId: "prog5" },
    { value: "mod6", label: "Quarterly Reports", programmeId: "prog6" },
  ];

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(
    (event) =>
      event.startDate.toDateString() === date.toDateString() ||
      event.endDate.toDateString() === date.toDateString() ||
      (event.startDate <= date && event.endDate >= date)
  );

  const getEventTypeColor = (type: string) => {
    return (
      eventTypes.find((t) => t.value === type)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  // Check if a date has an event
  const hasEvent = (date: Date | undefined) => {
    if (!date) return false;
    return events.some(
      (event) =>
        event.startDate.toDateString() === date.toDateString() ||
        event.endDate.toDateString() === date.toDateString() ||
        (event.startDate <= date && event.endDate >= date)
    );
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date | undefined) => {
    if (!date) return false;
    const formattedDate = format(date, "yyyy-MM-dd");
    return holidays.some((holiday) => holiday.date === formattedDate);
  };

  // Handle adding a new event
  const handleAddEvent = (event: Omit<TakwimEvent, "id">) => {
    const newEvent: TakwimEvent = {
      ...event,
      id: uuidv4(),
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Event created",
      description: `${event.title} has been scheduled from ${format(
        event.startDate,
        "PPP"
      )} to ${format(event.endDate, "PPP")}`,
    });
  };

  // Helper function to get category label by value
  const getCategoryLabel = (value: string) => {
    return categories.find((cat) => cat.value === value)?.label || value;
  };

  // Helper function to get pillar label by value
  const getPillarLabel = (value: string) => {
    return pillars.find((pil) => pil.value === value)?.label || value;
  };

  // Generate date range display text
  const getEventDateRangeText = (event: TakwimEvent) => {
    const isSameDay =
      event.startDate.toDateString() === event.endDate.toDateString();

    if (isSameDay) {
      return format(event.startDate, "PPP");
    } else {
      return `${format(event.startDate, "PPP")} - ${format(
        event.endDate,
        "PPP"
      )}`;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Takwim</h1>
            <p className="text-muted-foreground">
              Manage and schedule events for your organization
            </p>
          </div>
          <Button
            onClick={() => setIsEventDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>

        <Tabs
          defaultValue="calendar"
          value={view}
          onValueChange={(v) => setView(v as "calendar" | "list")}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="pointer-events-auto"
                  modifiers={{
                    weekend: (date) => isSaturday(date) || isSunday(date),
                    holiday: (date) => isHoliday(date),
                    hasEvent: (date) => hasEvent(date),
                  }}
                  modifiersStyles={{
                    weekend: { color: "#ea384c" },
                    holiday: { color: "#ea384c", fontWeight: "bold" },
                    hasEvent: {
                      backgroundColor: "#d6bcfa",
                      borderRadius: "100%",
                    },
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{format(date, "MMMM yyyy")}</CardTitle>
                <CardDescription>
                  View and manage events for the selected date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="rounded-md border w-full pointer-events-auto"
                    modifiers={{
                      weekend: (date) => isSaturday(date) || isSunday(date),
                      holiday: (date) => isHoliday(date),
                      hasEvent: (date) => hasEvent(date),
                    }}
                    modifiersStyles={{
                      weekend: { color: "#ea384c" },
                      holiday: { color: "#ea384c", fontWeight: "bold" },
                      hasEvent: {
                        backgroundColor: "#d6bcfa",
                        borderRadius: "100%",
                      },
                    }}
                  />

                  {/* Display holidays for the selected date if any */}
                  {selectedDateHolidays.length > 0 && (
                    <div className="mt-1 mb-4">
                      <h4 className="text-md font-semibold mb-2">
                        Holidays on {format(date, "PPP")}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDateHolidays.map((holiday) => (
                          <Badge
                            key={holiday.id}
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {holiday.desc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Events for {format(date, "PPP")}
                    </h3>
                    {eventsForSelectedDate.length > 0 ? (
                      <div className="space-y-2">
                        {eventsForSelectedDate.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-lg">
                                {event.title}
                              </h4>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs",
                                  getEventTypeColor(event.type)
                                )}
                              >
                                {
                                  eventTypes.find((t) => t.value === event.type)
                                    ?.label
                                }
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {getEventDateRangeText(event)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.startTime} - {event.endTime} (
                              {event.duration})
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary">
                                {getCategoryLabel(event.category)}
                              </Badge>
                              <Badge variant="secondary">
                                {getPillarLabel(event.pillar)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  event.mode === "Online"
                                    ? "bg-blue-50"
                                    : "bg-green-50"
                                }
                              >
                                {event.mode}
                              </Badge>
                              {event.isGroupEvent && <Badge>Group Event</Badge>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                              <div>
                                <strong>Location:</strong>{" "}
                                {event.location || "N/A"}
                              </div>
                              <div>
                                <strong>Target:</strong>{" "}
                                {event.targetParticipant}
                              </div>
                              <div>
                                <strong>Trainer:</strong> {event.trainerName}
                              </div>
                            </div>
                            {event.description && (
                              <div className="text-sm text-gray-600 mt-2 border-t pt-2">
                                {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                        {selectedDateHolidays.length > 0
                          ? "Holiday - No events scheduled"
                          : "No events scheduled for this date"}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>View all scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getEventDateRangeText(event)} | {event.startTime}{" "}
                              - {event.endTime} ({event.duration})
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary">
                                {getCategoryLabel(event.category)}
                              </Badge>
                              <Badge variant="secondary">
                                {getPillarLabel(event.pillar)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  event.mode === "Online"
                                    ? "bg-blue-50"
                                    : "bg-green-50"
                                }
                              >
                                {event.mode}
                              </Badge>
                              {event.isGroupEvent && <Badge>Group Event</Badge>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                              <div>
                                <strong>Location:</strong>{" "}
                                {event.location || "N/A"}
                              </div>
                              <div>
                                <strong>Target:</strong>{" "}
                                {event.targetParticipant}
                              </div>
                              <div>
                                <strong>Trainer:</strong> {event.trainerName}
                              </div>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                {event.description}
                              </p>
                            )}
                            {/* Show holiday badge if the event falls on a holiday */}
                            {(isHoliday(event.startDate) ||
                              isHoliday(event.endDate)) && (
                              <div className="mt-2">
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200"
                                >
                                  Event overlaps with holiday
                                </Badge>
                              </div>
                            )}
                          </div>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              getEventTypeColor(event.type)
                            )}
                          >
                            {
                              eventTypes.find((t) => t.value === event.type)
                                ?.label
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    No events scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TakwimEventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        eventTypes={eventTypes}
        onSubmit={handleAddEvent}
        categories={categories}
        pillars={pillars}
        programmes={programmes}
        modules={modules}
      />
    </DashboardLayout>
  );
}
