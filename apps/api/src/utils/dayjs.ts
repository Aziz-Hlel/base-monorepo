import dayjs from 'dayjs';

export const parseCalendarDate = (dateStr: string | null) => (dateStr ? dayjs(dateStr, 'YYYY-MM-DD').toDate() : null);

export const parseTime = (timeStr: string | null): Date | null =>
  timeStr ? dayjs(`1970-01-01 ${timeStr}`, 'YYYY-MM-DD HH:mm').toDate() : null;

export const toCalendarDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const toCalendarDateOrNull = (date: Date | null) => (date ? toCalendarDate(date) : null);

export const toTime = (date: Date | null) => (date ? dayjs(date).format('HH:mm') : null);
