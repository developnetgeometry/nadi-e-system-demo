
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DatePickerExamples = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState<"day" | "week" | "month">("day");
  
  const events = [
    { title: "Team Meeting", time: "9:00 AM", type: "work" },
    { title: "Project Review", time: "11:30 AM", type: "work" },
    { title: "Lunch Break", time: "1:00 PM", type: "personal" },
    { title: "Client Call", time: "3:00 PM", type: "work" },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <div className="bg-muted/50 p-3 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Schedule</h3>
            <Button variant="outline" size="sm">
              {date ? format(date, "MMM d, yyyy") : "Today"}
            </Button>
          </div>
          <Tabs defaultValue="day" value={schedule} onValueChange={(v) => setSchedule(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="p-3">
          <TabsContent value="day" className="m-0">
            <div className="space-y-2">
              {events.map((event, i) => (
                <div key={i} className="flex justify-between p-2 text-sm rounded-md hover:bg-muted">
                  <div>
                    <div>{event.title}</div>
                    <div className="text-muted-foreground">{event.time}</div>
                  </div>
                  <div>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      event.type === "work" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    )}>
                      {event.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="week" className="m-0">
            <div className="text-sm text-muted-foreground">Week view calendar</div>
          </TabsContent>
          <TabsContent value="month" className="m-0">
            <div className="text-sm text-muted-foreground">Month view calendar</div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export const datePickerCode = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : <span>Pick a date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>

{/* Schedule Component */}
<div className="rounded-md border">
  <Tabs defaultValue="day">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="day">Day</TabsTrigger>
      <TabsTrigger value="week">Week</TabsTrigger>
      <TabsTrigger value="month">Month</TabsTrigger>
    </TabsList>
    <TabsContent value="day">
      {/* Day events */}
    </TabsContent>
  </Tabs>
</div>`;
