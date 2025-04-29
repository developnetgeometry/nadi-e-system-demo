/**
 * Hook for formatting duration values from days to a human-readable string
 * showing days, hours, and minutes.
 */
export function useFormatDuration() {
  /**
   * Converts a duration in days to a formatted string with days, hours, and minutes
   * @param duration - The duration in days (can be decimal, e.g. 1.5 days)
   * @returns A formatted string like "1 day 12 hours" or "30 minutes"
   */
  const formatDuration = (duration: number | null | undefined) => {
    if (duration === null || duration === undefined) return 'N/A';
    
    const totalMinutes = duration * 24 * 60;
    const days = Math.floor(duration);
    const remainingHoursInMinutes = (duration - days) * 24 * 60;
    const hours = Math.floor(remainingHoursInMinutes / 60);
    const minutes = Math.round(remainingHoursInMinutes % 60);

    let result = '';

    if (days > 0) {
      result += `${days} day${days !== 1 ? 's' : ''}`;
    }

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
