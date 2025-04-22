import React, { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, X } from "lucide-react";
import { clsx } from "clsx";

const parseTime = (str) => {
  const [h, m] = str.split(":").map(Number);
  return { hour: h, minute: m };
};

const toTimeString = ({ hour, minute }) =>
  `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

const toMinutes = ({ hour, minute }) => hour * 60 + minute;

const TimeInput = ({
  id,
  value = "", // Ensure default value is an empty string
  onChange,
  min = "",
  max = "",
  required,
  disallowSameAsValue = "", // Add new prop to prevent same value as another field
}) => {
  const parsedValue = value ? parseTime(value) : null; // Parse only if value exists
  const parsedMin = parseTime(min || "00:00");
  const parsedMax = parseTime(max || "23:59");
  const parsedDisallowed = disallowSameAsValue ? parseTime(disallowSameAsValue) : null;

  // Initialize state with parsedValue or null, ensuring we don't set undefined
  const [hour, setHour] = useState(() => 
    parsedValue && parsedValue.hour !== undefined ? parsedValue.hour : null
  );
  const [minute, setMinute] = useState(() => 
    parsedValue && parsedValue.minute !== undefined ? parsedValue.minute : null
  );

  // Update state when value prop changes
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

  // Revised isValid function to also check for disallowed value
  const isValid = (h, m) => {
    if (h === null || m === null) return false;

    const test = toMinutes({ hour: h, minute: m });
    const minMinutes = toMinutes(parsedMin);
    const maxMinutes = toMinutes(parsedMax);

    // Check if the time is the same as the disallowed value
    if (parsedDisallowed && h === parsedDisallowed.hour && m === parsedDisallowed.minute) {
      return false;
    }

    return test >= minMinutes && test <= maxMinutes;
  };

  // Modified handleChange function to correctly handle zero values
  const handleChange = (newHour, newMinute) => {
    // Update the state regardless of validity
    setHour(newHour);
    setMinute(newMinute);

    // Only trigger onChange if the complete time is valid
    // Use explicit null checks to properly handle 0 values
    if (newHour !== null && newMinute !== null && isValid(newHour, newMinute)) {
      const timeStr = toTimeString({ hour: newHour, minute: newMinute });
      onChange?.(timeStr);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation(); // Prevent triggering the popover toggle
    setHour(null);
    setMinute(null);
    onChange?.(""); // Clear the value
  };

  // Improved display logic with explicit null checks for hour and minute
  const display = hour !== null && minute !== null
    ? `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    : "Select Time";

  // Get valid minutes for the currently selected hour
  const getValidMinutes = (h) => {
    if (h === null) return [];

    return [...Array(60).keys()].filter((m) => {
      const time = toMinutes({ hour: h, minute: m });
      const minMinutes = toMinutes(parsedMin);
      const maxMinutes = toMinutes(parsedMax);

      // Check for minimum time constraint
      if (h === parsedMin.hour && m < parsedMin.minute) return false;

      // Check for maximum time constraint
      if (h === parsedMax.hour && m > parsedMax.minute) return false;

      // Check for disallowed same value
      if (parsedDisallowed && h === parsedDisallowed.hour && m === parsedDisallowed.minute) return false;

      return time >= minMinutes && time <= maxMinutes;
    });
  };

  return (
    <div className="flex flex-col gap-1 w-fit">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            id={id}
            className={clsx(
              "flex items-center justify-between w-32 px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 relative",
              required && !value && "border border-red-500"
            )}
          >
            {display}
            <div className="flex items-center">
              {(hour !== null && minute !== null) && (
                <X
                  size={14}
                  className="mr-1 hover:text-gray-400 cursor-pointer"
                  onClick={handleClear}
                />
              )}
              <ChevronDown size={16} />
            </div>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            className="bg-gray-900 text-white p-4 rounded-xl shadow-xl space-y-4 w-80 z-50"
          >
            <div className="flex gap-4">
              {/* Hours Dropdown */}
              <div className="flex-1">
                <p className="text-sm mb-1 text-gray-400">Hour</p>
                <select
                  value={hour !== null ? hour : ""}
                  onChange={(e) => {
                    const newHour = e.target.value === "" ? null : Number(e.target.value);
                    handleChange(newHour, minute);
                  }}
                  className="w-full px-2 py-1 bg-gray-800 text-white rounded-md"
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
              {/* Minutes Dropdown */}
              <div className="flex-1">
                <p className="text-sm mb-1 text-gray-400">Minute</p>
                <select
                  value={minute !== null ? minute : ""}
                  onChange={(e) => {
                    const newMinute = e.target.value === "" ? null : Number(e.target.value);
                    handleChange(hour, newMinute);
                  }}
                  className="w-full px-2 py-1 bg-gray-800 text-white rounded-md"
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
