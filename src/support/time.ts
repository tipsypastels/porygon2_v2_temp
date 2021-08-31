import { format, formatDistance, isToday } from 'date-fns';

export const Milliseconds = (time: number) => time;
export const Seconds = (time: number) => time * 1000;
export const Minutes = (time: number) => Seconds(time) * 60;
export const Hours = (time: number) => Minutes(time) * 60;
export const Days = (time: number) => Hours(time) * 24;
export const Weeks = (time: number) => Days(time) * 7;

export function timeAgoInWords(date: Date) {
  return formatDistance(date, new Date());
}

enum Format {
  Full = "yyyy'/'MM'/'dd hh:mm b",
  Today = 'hh:mm b',
}

export function formatEventTime(date: Date) {
  const today = isToday(date);
  const code = Format[today ? 'Today' : 'Full'];
  return format(date, code);
}
