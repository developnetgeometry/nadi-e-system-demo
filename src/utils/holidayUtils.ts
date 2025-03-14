
import { format } from "date-fns";

export interface State {
  id: number;
  name: string;
  code?: string;
  abbr?: string;
  region_id?: number;
}

export interface Holiday {
  id: number;
  desc: string;
  date: string;
  year: number;
  status: number;
  states?: { id: number; name: string }[];
}

/**
 * Check if a date is a holiday
 * @param date The date to check
 * @param holidays List of holidays
 * @returns Boolean indicating if the date is a holiday
 */
export const isHoliday = (date: Date | undefined, holidays: Holiday[]): boolean => {
  if (!date) return false;
  const formattedDate = format(date, 'yyyy-MM-dd');
  return holidays.some(holiday => holiday.date === formattedDate);
};

/**
 * Get holidays for a specific date
 * @param date The date to get holidays for
 * @param holidays List of all holidays
 * @returns Array of holidays for the specified date
 */
export const getHolidaysForDate = (date: Date | undefined, holidays: Holiday[]): Holiday[] => {
  if (!date) return [];
  const formattedDate = format(date, 'yyyy-MM-dd');
  return holidays.filter(holiday => holiday.date === formattedDate);
};

/**
 * Format a holiday object for use in the form
 * @param holiday The holiday to format
 * @returns Formatted holiday object for the form
 */
export const formatHolidayForForm = (holiday: Holiday) => {
  const stateIds = holiday.states?.map(state => state.id) || [];
  
  return {
    desc: holiday.desc,
    date: new Date(holiday.date),
    states: stateIds,
    status: holiday.status
  };
};

/**
 * Format a date for database insertion
 * @param date The date to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export const formatDateForDB = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Check if a state is associated with a holiday
 * @param stateId The state ID to check
 * @param holiday The holiday to check
 * @returns Boolean indicating if the state is associated with the holiday
 */
export const isStateAssociatedWithHoliday = (stateId: number, holiday: Holiday): boolean => {
  return holiday.states?.some(state => state.id === stateId) || false;
};
