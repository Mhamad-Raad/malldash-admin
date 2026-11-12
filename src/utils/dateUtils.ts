export const formatDate = (date: Date | string | number, formatStr: string): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';

  // Simple implementation for specific formats requested
  // 'MMM dd, yyyy' -> Jan 09, 2026
  if (formatStr === 'MMM dd, yyyy') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(d);
  }

  // 'hh:mm a' -> 06:05 PM
  if (formatStr === 'hh:mm a') {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  }

  // Default fallback
  return d.toLocaleDateString();
};
