import { format, isToday, isYesterday } from 'date-fns';

export const useFormattedTimestamp = (timestamp: string | Date) => {
  const date = new Date(timestamp);

  const displayTime = format(date, 'hh:mm a');

  const dateLabel = isToday(date)
    ? 'Today'
    : isYesterday(date)
    ? 'Yesterday'
    : format(date, 'dd MMM yyyy');

  return { displayTime, dateLabel };
};
