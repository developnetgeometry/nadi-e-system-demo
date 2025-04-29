import { useMemo } from "react";

interface TimeRange {
  min: string;
  max: string;
  defaultStart?: string;
  defaultEnd?: string;
  isFixed?: boolean;
}

export const useSessionVisibility = (sessionId: string) => {
  const visibility = useMemo(() => {
    switch (sessionId) {
      case "1": // Halfday AM
        return { 
          showTimeInputs: true, 
          timeRange: { min: "08:00", max: "11:59" } 
        };
      case "2": // Halfday PM
        return { 
          showTimeInputs: true, 
          timeRange: { min: "12:00", max: "18:00" } 
        };
      case "3": // Fullday
        return { 
          showTimeInputs: true,  // Changed to true to show the fields
          timeRange: { 
            min: "08:00", 
            max: "18:00",
            defaultStart: "08:00",  // Default start time
            defaultEnd: "18:00",    // Default end time
            isFixed: true           // Mark as fixed
          } as TimeRange
        };
      default:
        return { showTimeInputs: false, timeRange: null };
    }
  }, [sessionId]);

  return visibility;
};
