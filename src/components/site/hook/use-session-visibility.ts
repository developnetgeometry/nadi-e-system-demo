import { useMemo } from "react";

export const useSessionVisibility = (sessionId: string) => {
  const visibility = useMemo(() => {
    switch (sessionId) {
      case "1": // Halfday AM
        return { showTimeInputs: true, timeRange: { min: "08:00", max: "11:59" } };
      case "2": // Halfday PM
        return { showTimeInputs: true, timeRange: { min: "12:00", max: "18:00" } };
      case "3": // Fullday
        return { showTimeInputs: false, timeRange: { min: "08:00", max: "18:00" } };
      default:
        return { showTimeInputs: false, timeRange: null };
    }
  }, [sessionId]);

  return visibility;
};
