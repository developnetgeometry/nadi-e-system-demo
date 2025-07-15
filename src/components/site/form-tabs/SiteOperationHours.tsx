import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimeInput from "@/components/ui/TimePicker";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SiteFormData } from "./schemas/schema";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OperationTime {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  id?: number;
}

interface SiteOperationHoursProps {
  form: UseFormReturn<SiteFormData>;
  siteId?: string | null;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_OPEN_TIME = "08:00";
const DEFAULT_CLOSE_TIME = "18:00";

export const SiteOperationHours = ({
  form,
  siteId,
}: SiteOperationHoursProps) => {
  const operationTimes = form.watch("operationTimes") || [];
  const hasLoadedOperationData = form.watch("hasLoadedOperationData") || false;

  // Note: Operation times data loading is now handled in the main SiteForm component
  // when the form loads, so we don't need to load it here anymore.

  // Create default operation times for all days
  const createDefaultOperationTimes = () => {
    const defaultTimes: OperationTime[] = DAYS_OF_WEEK.map((day) => ({
      day,
      openTime: DEFAULT_OPEN_TIME,
      closeTime: DEFAULT_CLOSE_TIME,
      isClosed: false,
    }));

    form.setValue("operationTimes", defaultTimes);
  };

  // Add a specific day operation time
  const addSpecificDay = (dayName: string) => {
    // Check if day already exists
    const existingDay = operationTimes.find(time => time.day === dayName);
    if (existingDay) return; // Don't add if already exists

    const newTime: OperationTime = {
      day: dayName,
      openTime: DEFAULT_OPEN_TIME,
      closeTime: DEFAULT_CLOSE_TIME,
      isClosed: false,
    };

    form.setValue("operationTimes", [...operationTimes, newTime]);
  };

  // Add a new operation time slot
  const addOperationTime = () => {
    // Find the next available day that isn't already set
    const usedDays = operationTimes.map(time => time.day);
    const availableDays = DAYS_OF_WEEK.filter(day => !usedDays.includes(day));
    const nextDay = availableDays.length > 0 ? availableDays[0] : "Monday";

    const newTime: OperationTime = {
      day: nextDay,
      openTime: DEFAULT_OPEN_TIME,
      closeTime: DEFAULT_CLOSE_TIME,
      isClosed: false,
    };

    form.setValue("operationTimes", [...operationTimes, newTime]);
  };

  // Remove an operation time slot by day name
  const removeOperationTimeByDay = (dayName: string) => {
    const updatedTimes = operationTimes.filter((time) => time.day !== dayName);
    form.setValue("operationTimes", updatedTimes);
  };

  // Remove an operation time slot by index (keep for backward compatibility)
  const removeOperationTime = (index: number) => {
    const updatedTimes = operationTimes.filter((_, i) => i !== index);
    form.setValue("operationTimes", updatedTimes);
  };

  // Update a specific operation time by day name
  const updateOperationTimeByDay = (dayName: string, updatedTime: Partial<OperationTime>) => {
    const updatedTimes = operationTimes.map((time) =>
      time.day === dayName ? { ...time, ...updatedTime } : time
    );
    form.setValue("operationTimes", updatedTimes);
  };

  // Update a specific operation time by index (keep for backward compatibility)
  const updateOperationTime = (index: number, updatedTime: Partial<OperationTime>) => {
    const updatedTimes = operationTimes.map((time, i) =>
      i === index ? { ...time, ...updatedTime } : time
    );
    form.setValue("operationTimes", updatedTimes);
  };

  // Clear all operation times
  const clearOperationTimes = () => {
    form.setValue("operationTimes", []);
    // Don't reset hasLoadedInitialData here - we want to prevent auto-reload
  };

  // Get missing days for individual buttons
  const missingDays = DAYS_OF_WEEK.filter(day => !operationTimes.some(time => time.day === day));
  
  // Check for validation errors
  const fieldError = form.formState.errors.operationTimes;
  const hasValidationError = fieldError && missingDays.length > 0;
  
  // Helper function to validate individual day times
  const validateDayTimes = (day: string) => {
    const dayData = operationTimes.find(time => time.day === day);
    if (!dayData || dayData.isClosed) return { isValid: true, error: "" };
    
    if (!dayData.openTime || !dayData.closeTime) {
      return { isValid: false, error: "Times required" };
    }
    
    // Check time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(dayData.openTime) || !timeRegex.test(dayData.closeTime)) {
      return { isValid: false, error: "Invalid format" };
    }
    
    // Check if open time is before close time
    const [openHour, openMin] = dayData.openTime.split(':').map(Number);
    const [closeHour, closeMin] = dayData.closeTime.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    if (openMinutes >= closeMinutes) {
      return { isValid: false, error: "Open must be before close" };
    }
    
    return { isValid: true, error: "" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Operation Hours</h3>
          <p className="text-sm text-muted-foreground">
            All 7 days must be defined with valid times <span className="text-red-500">*</span>
          </p>
          {fieldError && (
            <p className="text-sm text-red-500 mt-1">
              {fieldError.message || "Please fix operation hours errors"}
              {missingDays.length > 0 && ` (${missingDays.length} day${missingDays.length > 1 ? 's' : ''} missing)`}
            </p>
          )}
        </div>
        
        {/* Top right buttons - only show when we have some days defined */}
        {operationTimes.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center">
            {/* Individual buttons for each missing day */}
            {missingDays.length > 0 && (
              <div className="flex gap-1">
                <span className="text-xs text-muted-foreground mr-2 self-center">Missing:</span>
                {missingDays.map((day) => (
                  <Button
                    key={day}
                    onClick={() => addSpecificDay(day)}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs h-7 px-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Status indicator */}
            {(() => {
              const hasTimeErrors = operationTimes.some(time => !validateDayTimes(time.day).isValid);
              const allValid = missingDays.length === 0 && !hasTimeErrors;
              
              if (allValid) {
                return (
                  <div className="flex items-center text-green-600 text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Complete
                  </div>
                );
              } else {
                const errorCount = missingDays.length + (hasTimeErrors ? 1 : 0);
                return (
                  <div className="flex items-center text-red-600 text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {missingDays.length > 0 && `${missingDays.length} missing`}
                    {missingDays.length > 0 && hasTimeErrors && ', '}
                    {hasTimeErrors && 'time errors'}
                  </div>
                );
              }
            })()}
            
            {/* Clear All button */}
            <Button onClick={clearOperationTimes} variant="destructive" size="sm" type="button" className="h-7">
              Clear All
            </Button>
          </div>
        )}
      </div>

      {operationTimes.length === 0 ? (
        /* No days defined - centered Create Standard Week */
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-red-300 rounded-lg bg-red-50/30">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Operation Hours Required</h4>
            <p className="text-muted-foreground mb-2">
              All 7 days must be defined with valid open and close times
            </p>
            <p className="text-red-600 text-sm mb-6">
              This is required to create or update the site
            </p>
            <Button onClick={createDefaultOperationTimes} variant="default" type="button" className="mb-2">
              <Plus className="h-4 w-4 mr-2" />
              Create Standard Week (Mon-Sun)
            </Button>
            <p className="text-xs text-muted-foreground">
              Creates default operation hours (8:00 AM - 6:00 PM) for all 7 days
            </p>
          </div>
        </div>
      ) : (
        /* Horizontal view with separated cards for each day */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((dayName) => {
            // Find if we have operation time for this day
            const dayOperationIndex = operationTimes.findIndex(time => time.day === dayName);
            const dayOperation = dayOperationIndex >= 0 ? operationTimes[dayOperationIndex] : null;
            
            // Validate times for this day
            const timeValidation = validateDayTimes(dayName);
            const hasTimeError = !timeValidation.isValid;
            
            return (
              <Card key={dayName} className={`min-h-[200px] ${
                dayOperation 
                  ? hasTimeError 
                    ? 'border-red-300 bg-red-50/30' 
                    : 'border-blue-200 bg-blue-50/30'
                  : hasValidationError 
                    ? 'border-red-300 bg-red-50/30' 
                    : 'border-gray-200 bg-gray-50/30'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-center flex-1">
                      {dayName}
                    </CardTitle>
                    {dayOperation && (
                      <Button
                        onClick={() => removeOperationTimeByDay(dayName)}
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {dayOperation ? (
                    /* Day has operation hours */
                    <div className="space-y-3">
                      {/* Closed toggle */}
                      <div className="flex items-center justify-center">
                        <Switch
                          id={`closed-${dayName}`}
                          checked={dayOperation.isClosed}
                          onCheckedChange={(checked) => updateOperationTimeByDay(dayName, { isClosed: checked })}
                        />
                        <Label htmlFor={`closed-${dayName}`} className="text-xs ml-2">
                          {dayOperation.isClosed ? 'Closed' : 'Open'}
                        </Label>
                      </div>
                      
                      {!dayOperation.isClosed && (
                        <>
                          {/* Opening Time */}
                          <div>
                            <Label htmlFor={`open-time-${dayName}`} className="text-xs">Open</Label>
                            <TimeInput
                              id={`open-time-${dayName}`}
                              value={dayOperation.openTime}
                              onChange={(value) => updateOperationTimeByDay(dayName, { openTime: value })}
                              className={cn(
                                "text-xs h-8 mt-1",
                                hasTimeError ? "border-red-300 focus:border-red-500" : ""
                              )}
                            />
                          </div>
                          
                          {/* Closing Time */}
                          <div>
                            <Label htmlFor={`close-time-${dayName}`} className="text-xs">Close</Label>
                            <TimeInput
                              id={`close-time-${dayName}`}
                              value={dayOperation.closeTime}
                              onChange={(value) => updateOperationTimeByDay(dayName, { closeTime: value })}
                              className={cn(
                                "text-xs h-8 mt-1",
                                hasTimeError ? "border-red-300 focus:border-red-500" : ""
                              )}
                            />
                          </div>
                          
                          {/* Time validation error */}
                          {hasTimeError && (
                            <div className="text-red-500 text-xs text-center mt-2">
                              {timeValidation.error}
                            </div>
                          )}
                        </>
                      )}
                      
                      {dayOperation.isClosed && (
                        <div className="text-center text-xs text-muted-foreground py-4">
                          This day is closed
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Day doesn't have operation hours */
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="text-red-600 mb-3">
                          <span className="text-xs font-medium">Required</span>
                        </div>
                        <Button
                          onClick={() => addSpecificDay(dayName)}
                          variant="outline"
                          size="sm"
                          type="button"
                          className="border-dashed border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Hours
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
