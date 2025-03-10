
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Holiday {
  id: number;
  desc: string;
  date: string;
  year: number;
  status: number;
  states?: { id: number; name: string }[];
}

interface HolidayCalendarProps {
  holidays: Holiday[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export function HolidayCalendar({
  holidays,
  selectedDate,
  onSelectDate
}: HolidayCalendarProps) {
  // Check if a date is a holiday
  const isHoliday = (date: Date | undefined) => {
    if (!date) return false;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return holidays.some(holiday => holiday.date === formattedDate);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Holiday Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border bg-white pointer-events-auto"
          modifiers={{
            holiday: (date) => isHoliday(date)
          }}
          modifiersClassNames={{
            holiday: "bg-red-100 text-red-600 font-bold"
          }}
        />
      </CardContent>
    </Card>
  );
}
