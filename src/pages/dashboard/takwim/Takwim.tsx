import { useState, useEffect } from "react";
import { format, isSaturday, isSunday, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarMonthView } from "@/components/ui/calendar-monthview";
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
import { supabase } from "@/integrations/supabase/client";

export default function Takwim() {
  const [date, setDate] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TakwimEvent[]>([]);
  const [dbEvents, setDbEvents] = useState<any[]>([]);

  // Get holidays from the hook
  const { holidays } = useHolidays(new Date().getFullYear());
  // Get holidays for the selected date
  const selectedDateHolidays = getHolidaysForDate(date, holidays);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Fetch events from nd_event table, excluding Draft status (status_id = 1)
        const { data: eventData, error } = await supabase
          .from("nd_event")
          .select(
            `
            id,
            program_name,
            description,
            location_event,
            start_datetime,
            end_datetime,
            site_id,
            category_id,
            status_id,
            created_by,
            nd_event_status:status_id(id, name),
            nd_site:site_id(
              nd_site_profile:site_profile_id(
                sitename
              )
            ),
            nd_event_category:category_id(id, name)
          `
          )
          .neq("status_id", 1); // Exclude Draft status

        if (error) {
          console.error("Error fetching events:", error);
          toast({
            title: "Error",
            description: "Failed to load events from database",
            variant: "destructive",
          });
          return;
        }

        setDbEvents(eventData || []);

        // Convert database events to TakwimEvent format
        const convertedEvents: TakwimEvent[] = (eventData || []).map(
          (event) => ({
            id: event.id,
            title: event.program_name || "Untitled Event",
            startDate: event.start_datetime
              ? parseISO(event.start_datetime)
              : new Date(),
            endDate: event.end_datetime
              ? parseISO(event.end_datetime)
              : new Date(),
            startTime: event.start_datetime
              ? format(parseISO(event.start_datetime), "HH:mm")
              : "00:00",
            endTime: event.end_datetime
              ? format(parseISO(event.end_datetime), "HH:mm")
              : "00:00",
            type: "event", // Default type for database events
            description: event.description || "",
            location:
              event.nd_site?.nd_site_profile?.sitename ||
              event.location_event ||
              "No Location",
            category: event.category_id?.toString() || "general",
            pillar: "general", // Default pillar
            programme: "general", // Default programme
            module: "general", // Default module
            isGroupEvent: true, // Default to group event
            mode: "Physical", // Default mode
            targetParticipant: "General", // Default target
            trainerName: "TBD", // Default trainer
            duration:
              event.start_datetime && event.end_datetime
                ? `${Math.round(
                    (parseISO(event.end_datetime).getTime() -
                      parseISO(event.start_datetime).getTime()) /
                      (1000 * 60 * 60)
                  )}h`
                : "1h",
            status: event.nd_event_status?.name || "Unknown",
            categoryName: event.nd_event_category?.name || "General",
          })
        );

        setEvents(convertedEvents);
      } catch (error) {
        console.error("Error in fetchEvents:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
    <div>
      {loading ? (
        <div className="space-y-1 py-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading events...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-1 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Takwim</h1>
              <p className="text-muted-foreground">
                Manage and schedule events for your organization
              </p>
            </div>
            {/* <Button
              onClick={() => setIsEventDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button> */}
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
                <PopoverContent className="w-auto p-3" align="end">
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
                      today: (date) =>
                        format(date, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd"),
                    }}
                    modifiersStyles={{
                      weekend: { color: "#ea384c" },
                      holiday: {
                        color: "#ea384c",
                        fontWeight: "bold",
                        backgroundColor: "#ffe4e6",
                      },
                      hasEvent: {
                        backgroundColor: "#e9d5ff",
                        borderRadius: "100%",
                      },
                      today: {
                        border: "2px solid #7e22ce",
                        borderRadius: "100%",
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>{format(date, "MMMM yyyy")}</CardTitle>
                    <CardDescription>
                      View events for the selected date
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date);
                        newDate.setMonth(date.getMonth() - 1);
                        setDate(newDate);
                      }}
                      title="Previous month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-[130px]">
                          {format(date, "MMMM yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newDate = new Date(date);
                                newDate.setFullYear(date.getFullYear() - 1);
                                setDate(newDate);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-left"
                              >
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                            </Button>
                            <div className="font-medium">
                              {date.getFullYear()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newDate = new Date(date);
                                newDate.setFullYear(date.getFullYear() + 1);
                                setDate(newDate);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-right"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => {
                              const monthDate = new Date(
                                date.getFullYear(),
                                i,
                                1
                              );
                              return (
                                <Button
                                  key={i}
                                  variant={
                                    i === date.getMonth()
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    const newDate = new Date(date);
                                    newDate.setMonth(i);
                                    setDate(newDate);
                                  }}
                                >
                                  {format(monthDate, "MMM")}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date);
                        newDate.setMonth(date.getMonth() + 1);
                        setDate(newDate);
                      }}
                      title="Next month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        setDate(today);
                      }}
                      title="Today"
                    >
                      Today
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 w-full">
                    {/* Calendar Header - Days of Week */}
                    <div className="grid grid-cols-7 gap-2 mb-2 font-semibold text-center">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className={day === "Sun" ? "text-red-500" : ""}
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        // Get current year and month from the selected date
                        const year = date.getFullYear();
                        const month = date.getMonth();

                        // Get the first day of the month
                        const firstDayOfMonth = new Date(year, month, 1);
                        // Get the last day of the month
                        const lastDayOfMonth = new Date(year, month + 1, 0);

                        // Calculate the starting day of the week (0 = Sunday, 6 = Saturday)
                        const startingDayOfWeek = firstDayOfMonth.getDay();

                        // Calculate the total days in the month
                        const daysInMonth = lastDayOfMonth.getDate();

                        // Create array to hold all calendar cells
                        const calendarCells = [];

                        // Add empty cells for days before the first of the month
                        for (let i = 0; i < startingDayOfWeek; i++) {
                          calendarCells.push(
                            <div
                              key={`empty-${i}`}
                              className="p-2 rounded-md border border-gray-100"
                            ></div>
                          );
                        }

                        // Add cells for each day of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const currentDate = new Date(year, month, day);
                          const formattedDate = format(
                            currentDate,
                            "yyyy-MM-dd"
                          );
                          const isWeekend =
                            isSaturday(currentDate) || isSunday(currentDate);
                          const isToday =
                            format(currentDate, "yyyy-MM-dd") ===
                            format(new Date(), "yyyy-MM-dd");
                          const hasEventOnDay = hasEvent(currentDate);
                          const isHolidayOnDay = isHoliday(currentDate);
                          const isSelected =
                            currentDate.getDate() === date.getDate() &&
                            currentDate.getMonth() === date.getMonth() &&
                            currentDate.getFullYear() === date.getFullYear();

                          // Find holiday information for the current day
                          const holiday = holidays.find(
                            (h) => h.date === formattedDate
                          );

                          // Find events for the current day
                          const dayEvents = events.filter(
                            (event) =>
                              event.startDate.toDateString() ===
                                currentDate.toDateString() ||
                              event.endDate.toDateString() ===
                                currentDate.toDateString() ||
                              (event.startDate <= currentDate &&
                                event.endDate >= currentDate)
                          );

                          calendarCells.push(
                            <div
                              key={day}
                              onClick={() =>
                                setDate(new Date(year, month, day))
                              }
                              className={`p-2 rounded-md border cursor-pointer min-h-[70px] transition-colors ${
                                isSelected ? "ring-2 ring-purple-500" : ""
                              } ${
                                isHolidayOnDay
                                  ? "bg-red-50 border-red-200"
                                  : hasEventOnDay
                                  ? "bg-purple-50 border-purple-200"
                                  : "border-gray-200 hover:bg-gray-50"
                              } ${isToday ? "border-purple-500 border-2" : ""}`}
                            >
                              <div
                                className={`font-medium ${
                                  isWeekend ? "text-red-500" : ""
                                }`}
                              >
                                {day}
                              </div>
                              {isHolidayOnDay && holiday && (
                                <div
                                  className="text-xs text-red-500 mt-1 truncate"
                                  title={holiday.desc}
                                >
                                  {holiday.desc}
                                </div>
                              )}
                              {hasEventOnDay && dayEvents.length > 0 && (
                                <div className="text-xs text-purple-600 mt-1">
                                  {dayEvents.length > 1 ? (
                                    `${dayEvents.length} events`
                                  ) : (
                                    <span
                                      className="truncate block"
                                      title={dayEvents[0].title}
                                    >
                                      {dayEvents[0].title}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }

                        return calendarCells;
                      })()}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />{" "}
                        Holiday
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-purple-50 border border-purple-200" />{" "}
                        Event
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border-2 border-purple-500" />{" "}
                        Today
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded ring-2 ring-purple-500" />{" "}
                        Selected
                      </div>
                    </div>

                    {/* Events and holidays list */}
                    <div className="mt-2">
                      <h4 className="text-md font-semibold mb-2">
                        Events & Holidays on {format(date, "PPP")}
                      </h4>

                      {selectedDateHolidays.length === 0 &&
                      eventsForSelectedDate.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No holidays or events
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {selectedDateHolidays.map((holiday) => (
                            <Badge
                              key={holiday.id}
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 w-fit"
                            >
                              {holiday.desc}
                            </Badge>
                          ))}
                          {eventsForSelectedDate.map((event) => (
                            <div
                              key={event.id}
                              className="flex flex-col p-3 border rounded-lg bg-purple-50"
                            >
                              <p className="font-semibold">{event.title}</p>
                              <p className="text-sm text-gray-600">
                                {event.startTime} – {event.endTime} (
                                {event.duration})
                              </p>
                              {event.description && (
                                <div
                                  className="text-sm text-gray-500 mt-1 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: event.description,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {/* Events Section */}
              <Card>
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                  <CardDescription>
                    View all scheduled events from the system
                  </CardDescription>
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
                            <div className="flex-1">
                              <h3 className="font-medium text-lg">
                                {event.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {getEventDateRangeText(event)} |{" "}
                                {event.startTime} - {event.endTime} (
                                {event.duration})
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(event as any).categoryName && (
                                  <Badge variant="secondary">
                                    {(event as any).categoryName}
                                  </Badge>
                                )}
                                {(event as any).status && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      (event as any).status === "Published"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : (event as any).status ===
                                          "Open For Registration"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : (event as any).status === "Ongoing"
                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                        : (event as any).status === "Completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                    }
                                  >
                                    {(event as any).status}
                                  </Badge>
                                )}
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
                                {event.isGroupEvent && (
                                  <Badge>Group Event</Badge>
                                )}
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
                                <div
                                  className="text-sm text-gray-600 mt-2 border-t pt-2 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: event.description,
                                  }}
                                />
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

              {/* Holidays Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Holidays ({new Date().getFullYear()})</CardTitle>
                  <CardDescription>
                    View all holidays for the current year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {holidays.length > 0 ? (
                    <div className="space-y-3">
                      {holidays.map((holiday) => (
                        <div
                          key={holiday.id}
                          className="border rounded-lg p-4 bg-red-50 border-red-200 hover:bg-red-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg text-red-800">
                                {holiday.desc}
                              </h3>
                              <p className="text-sm text-red-600">
                                {format(parseISO(holiday.date), "PPP")} (
                                {format(parseISO(holiday.date), "EEEE")})
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-700 border-red-300"
                            >
                              Holiday
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                      No holidays found for {new Date().getFullYear()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

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
    </div>
  );
}
