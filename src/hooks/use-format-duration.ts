/**
 * Hook for formatting duration values from days to a human-readable string
 * showing days, hours, and minutes.
 */
export function useFormatDuration() {
  /**
   * Converts a duration in days to a formatted string with days, hours, and minutes
   * @param duration - The duration in days (can be decimal, e.g. 1.5 days)
   * @returns A formatted string like "1 day 12 hours" or "30 minutes", or empty string if duration is invalid
   */  const formatDuration = (duration: number | null | undefined) => {
    // Return empty string for null, undefined, zero or negative values
    if (duration === null || duration === undefined || duration <= 0) {
      return '';
    }
    
    // Constants for time conversions
    const DAYS_IN_YEAR = 365;
    const DAYS_IN_MONTH = 30; // Using 30 as average month length for simplicity
    
    // Calculate years, months, and remaining days
    let years = 0;
    let months = 0;
    let days = 0;
    let remainingDays = Math.floor(duration);
    
    // Extract years if duration is 365 days or more
    if (remainingDays >= DAYS_IN_YEAR) {
      years = Math.floor(remainingDays / DAYS_IN_YEAR);
      remainingDays = remainingDays % DAYS_IN_YEAR;
    }
    
    // Extract months if remaining days is 30 days or more
    if (remainingDays >= DAYS_IN_MONTH) {
      months = Math.floor(remainingDays / DAYS_IN_MONTH);
      remainingDays = remainingDays % DAYS_IN_MONTH;
    }
    
    // Remaining days
    days = remainingDays;
    
    // Calculate hours and minutes from fractional part of duration
    const fractionalDay = duration - Math.floor(duration);
    const totalMinutesInFraction = fractionalDay * 24 * 60;
    const hours = Math.floor(totalMinutesInFraction / 60);
    const minutes = Math.round(totalMinutesInFraction % 60);

    let result = '';

    // Add years if any
    if (years > 0) {
      result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    // Add months if any
    if (months > 0) {
      if (result) result += ' ';
      result += `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    // Add days if any
    if (days > 0 || (years === 0 && months === 0)) {
      if (result) result += ' ';
      result += `${days} day${days !== 1 ? 's' : ''}`;
    }

    // For PDF reports, we probably don't need hours and minutes for insurance durations
    // But keeping them for other potential uses of this hook
    if (hours > 0) {
      if (result) result += ' ';
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
      if (result) result += ' ';
      result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    if (!result) {
      result = '< 1 minute';
    }

    return result;
  };

  return { formatDuration };
}
