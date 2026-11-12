/**
 * Converts a time string (HH:mm) to UTC format (HH:mm:ss)
 * @param timeString - Time in format "HH:mm" (e.g., "08:30")
 * @returns Time in UTC format "HH:mm:ss" (e.g., "08:30:00")
 */
export function convertToUTCFormat(timeString: string): string {
  if (!timeString) return '';
  
  // If already in HH:mm:ss format, return as is
  if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString;
  }
  
  // Convert HH:mm to HH:mm:ss
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    return `${timeString}:00`;
  }
  
  return timeString;
}
