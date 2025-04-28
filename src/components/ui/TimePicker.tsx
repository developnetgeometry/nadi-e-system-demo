import React, { useState, useEffect, useRef } from "react";
import * as Popover from "@radix-ui/react-popover";
import {Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define proper TypeScript interface for the component props
interface TimeInputProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  disallowSameAsValue?: string;
  className?: string; // Make className optional
}

const parseTime = (str) => {
  const [h, m] = str.split(":").map(Number);
  return { hour: h, minute: m };
};

const toTimeString = ({ hour, minute }) =>
  `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

const toMinutes = ({ hour, minute }) => hour * 60 + minute;

const TimeInput: React.FC<TimeInputProps> = ({
  id,
  value = "",
  onChange,
  min = "",
  max = "",
  required,
  disallowSameAsValue = "",
  className,
}) => {
  const parsedValue = value ? parseTime(value) : null;
  const parsedMin = parseTime(min || "00:00");
  const parsedMax = parseTime(max || "23:59");
  const parsedDisallowed = disallowSameAsValue ? parseTime(disallowSameAsValue) : null;

  const [hour, setHour] = useState(() =>
    parsedValue && parsedValue.hour !== undefined ? parsedValue.hour : null
  );
  const [minute, setMinute] = useState(() =>
    parsedValue && parsedValue.minute !== undefined ? parsedValue.minute : null
  );

  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && !value) {
      setHour(null);
      setMinute(null);
    }
  }, [open, value]);

  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      setHour(parsed.hour !== undefined ? parsed.hour : null);
      setMinute(parsed.minute !== undefined ? parsed.minute : null);
    } else {
      setHour(null);
      setMinute(null);
    }
  }, [value]);

  const isValid = (h, m) => {
    if (h === null || m === null) return false;

    const test = toMinutes({ hour: h, minute: m });
    const minMinutes = toMinutes(parsedMin);
    const maxMinutes = toMinutes(parsedMax);

    if (parsedDisallowed && h === parsedDisallowed.hour && m === parsedDisallowed.minute) {
      return false;
    }

    return test >= minMinutes && test <= maxMinutes;
  };

  const handleChange = (newHour, newMinute) => {
    setHour(newHour);
    setMinute(newMinute);

    if (newHour !== null && newMinute !== null && isValid(newHour, newMinute)) {
      const timeStr = toTimeString({ hour: newHour, minute: newMinute });
      onChange?.(timeStr);

      // Close popover when minute is selected
      if (newMinute !== null) {
        // Use setTimeout to avoid React state update conflicts
        setTimeout(() => {
          setOpen(false);
          setIsFocused(false); // Reset focus state when popover closes
        }, 100);
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setHour(null);
    setMinute(null);
    onChange?.("");
  };

  const display = hour !== null && minute !== null
    ? `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    : "Select Time";

  const getValidMinutes = (h) => {
    if (h === null) return [];

    return [...Array(60).keys()].filter((m) => {
      const time = toMinutes({ hour: h, minute: m });
      const minMinutes = toMinutes(parsedMin);
      const maxMinutes = toMinutes(parsedMax);

      if (h === parsedMin.hour && m < parsedMin.minute) return false;
      if (h === parsedMax.hour && m > parsedMax.minute) return false;
      if (parsedDisallowed && h === parsedDisallowed.hour && m === parsedDisallowed.minute) return false;

      return time >= minMinutes && time <= maxMinutes;
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <Popover.Root 
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          setIsFocused(isOpen);
          
          if (isOpen && !value) {
            setHour(null);
            setMinute(null);
          }
        }}
      >
        <Popover.Trigger asChild>
          <button
            id={id}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center justify-between",
              isFocused && "ring-2 ring-ring ring-offset-2",
              className
            )}
            type="button"
          >
            <span className={!value ? "text-muted-foreground" : ""}>
              {display}
            </span>
            <div className="flex items-center">
              {(hour !== null && minute !== null) && (
                <X
                  size={16}
                  className="mr-1 hover:text-muted-foreground cursor-pointer"
                  onClick={handleClear}
                />
              )}
              <Timer size={16} />
            </div>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            className="bg-popover text-popover-foreground p-4 rounded-md shadow-md space-y-4 w-80 z-50 border border-border"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm mb-1 text-muted-foreground">Hour</p>
                <select
                  value={hour !== null ? hour : ""}
                  onChange={(e) => {
                    const newHour = e.target.value === "" ? null : Number(e.target.value);
                    handleChange(newHour, minute);
                  }}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="" disabled>
                    Select Hour
                  </option>
                  {[...Array(24).keys()]
                    .filter((h) => h >= parsedMin.hour && h <= parsedMax.hour)
                    .map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1 text-muted-foreground">Minute</p>
                <select
                  value={minute !== null ? minute : ""}
                  onChange={(e) => {
                    const newMinute = e.target.value === "" ? null : Number(e.target.value);
                    handleChange(hour, newMinute);
                  }}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={hour === null}
                >
                  <option value="" disabled>
                    Select Minute
                  </option>
                  {hour !== null && getValidMinutes(hour).map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default TimeInput;
