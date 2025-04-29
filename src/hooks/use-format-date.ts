import { format } from "date-fns";

/**
 * Hook for formatting date strings to a specified format,
 * with proper handling of null/undefined/invalid dates.
 */
export function useFormatDate() {
  /**
   * Formats a date string to the specified format
   * @param dateString - The date string to format
   * @param dateFormat - The format to use (defaults to 'dd/MM/yyyy')
   * @param fallbackText - The text to return if the date is invalid (defaults to 'N/A')
   * @returns A formatted date string or the fallback text
   */
  const formatDate = (
    dateString: string | null | undefined,
    dateFormat: string = 'dd/MM/yyyy',
    fallbackText: string = 'N/A'
  ): string => {
    if (!dateString) return fallbackText;
    
    try {
      const date = new Date(dateString);
      
      // Check if date is invalid or very close to epoch start (1970-01-01)
      if (
        isNaN(date.getTime()) || 
        (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1)
      ) {
        return fallbackText;
      }
      
      return format(date, dateFormat);
    } catch (e) {
      return fallbackText;
    }
  };

  return { formatDate };
}
