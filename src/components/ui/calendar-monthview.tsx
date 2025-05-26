import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarMonthViewProps = {
  selected?: Date;
  onSelect?: (date: Date) => void;
  onAddEvent?: () => void;
  events?: Record<string, { title: string; time: string }[]>; // e.g. {"2025-06-22": [{ title: "Event", time: "10AM" }]}
};

export function CalendarMonthView({
  selected,
  onSelect,
  onAddEvent,
  events = {},
}: CalendarMonthViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {selected
            ? selected.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "Month"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const calendar =
                document.querySelector("[data-rdp]")?.["__reactDayPicker"];
              calendar?.goToMonth?.(
                new Date(selected!.getFullYear(), selected!.getMonth() - 1)
              );
            }}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 w-8 p-0 flex items-center justify-center"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const calendar =
                document.querySelector("[data-rdp]")?.["__reactDayPicker"];
              calendar?.goToMonth?.(
                new Date(selected!.getFullYear(), selected!.getMonth() + 1)
              );
            }}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 w-8 p-0 flex items-center justify-center"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={onAddEvent}
            className={cn(buttonVariants({ variant: "default" }), "ml-2")}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        showOutsideDays
        className="w-full"
        classNames={{
          months: "w-full",
          month: "grid grid-cols-7 gap-px border-t border-l",
          table: "w-full",
          head_row: "hidden",
          row: "contents",
          cell: "h-28 min-h-[6rem] border-r border-b bg-white p-1 align-top text-left relative hover:bg-gray-50",
          day: "text-sm text-gray-800",
          day_today: "font-bold text-purple-600",
          day_outside: "text-gray-300",
          day_selected: "bg-purple-100 border border-purple-600",
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        footer={undefined}
        modifiersClassNames={{}}
        renderDay={(day) => {
          const key = day.toISOString().split("T")[0];
          const dayEvents = events[key] || [];

          return (
            <div className="flex flex-col gap-1">
              <span>{day.getDate()}</span>
              {dayEvents.map((e, i) => (
                <span
                  key={i}
                  className="text-xs truncate text-gray-600 whitespace-nowrap"
                  title={e.title}
                >
                  {e.title}{" "}
                  <span className="text-gray-400 text-[10px]">{e.time}</span>
                </span>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}

CalendarMonthView.displayName = "CalendarMonthView";
