
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isHoliday } from "@/utils/holidayUtils";
import { type Holiday } from "@/utils/holidayUtils";

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
            holiday: (date) => isHoliday(date, holidays)
          }}
          modifiersClassNames={{
            holiday: "bg-red-100 text-red-600 font-bold"
          }}
        />
      </CardContent>
    </Card>
  );
}
