import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00"
  ];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedSlot(null);
    console.log("Selected date:", selectedDate);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    console.log(`Selected time slot: ${slot}`);
    toast({
      title: "Time slot selected",
      description: `You selected ${format(date!, "PPP")} at ${slot}`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavbar />
          <main className="flex-1 p-8">
            <SidebarTrigger />
            <div className="flex items-center gap-4 mb-8">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Calendar</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border shadow"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        onClick={() => handleSlotSelect(slot)}
                        className={cn(
                          "w-full justify-center",
                          selectedSlot === slot && "bg-primary text-primary-foreground"
                        )}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                  {date && selectedSlot && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Selected Time:</h3>
                      <Badge variant="outline" className="text-sm">
                        {format(date, "PPP")} at {selectedSlot}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CalendarPage;