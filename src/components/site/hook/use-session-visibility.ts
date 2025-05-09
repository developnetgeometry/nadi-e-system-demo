import { useMemo, useState, useEffect } from "react";
import operationTimeData from "@/data/operation-times.json";

interface TimeRange {
  min: string;
  max: string;
  defaultStart?: string;
  defaultEnd?: string;
  isFixed?: boolean;
}

interface SessionVisibility {
  showTimeInputs: boolean;
  timeRange: TimeRange | null;
}

export const useSessionVisibility = (sessionId: string): SessionVisibility => {
  const [operationTimes, setOperationTimes] = useState<any[]>(operationTimeData.operationTimes);

  // This function could be enhanced to fetch from an API instead of the JSON file
  const fetchOperationTimes = async () => {
    // In the future, replace this with a real API call:
    // const response = await fetch('/api/operation-times');
    // const data = await response.json();
    // setOperationTimes(data.operationTimes);
    
    // For now, we're using the imported JSON data
    setOperationTimes(operationTimeData.operationTimes);
  };

  useEffect(() => {
    fetchOperationTimes();
  }, []);

  const visibility = useMemo(() => {
    // Find the matching session configuration in our data
    const sessionConfig = operationTimes.find(item => item.sessionId === sessionId);
    
    if (sessionConfig && sessionConfig.timeRange) {
      // Add application-specific logic here instead of in the JSON
      const isFullDay = sessionId === "3";
      
      // Map from the simplified JSON properties to our app's required structure
      const timeRangeWithFlags: TimeRange = {
        min: sessionConfig.timeRange.startTime,
        max: sessionConfig.timeRange.endTime,
        defaultStart: sessionConfig.timeRange.startTime,
        defaultEnd: sessionConfig.timeRange.endTime,
        isFixed: isFullDay // Only Full Day sessions have fixed times
      };
      
      return {
        showTimeInputs: true, // Show time inputs for all sessions, controlled in UI
        timeRange: timeRangeWithFlags
      };
    }
    
    // Default fallback if no matching session is found
    return { showTimeInputs: false, timeRange: null };
  }, [sessionId, operationTimes]);

  return visibility;
};
