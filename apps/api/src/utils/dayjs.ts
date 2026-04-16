import dayjs from 'dayjs';

export const parseCalendarDate = (dateStr: string) => dayjs(dateStr, 'YYYY-MM-DD').toDate();

export const parseTime = (timeStr: string): Date => dayjs(`1970-01-01 ${timeStr}`, 'YYYY-MM-DD HH:mm').toDate();

export const toCalendarDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const toCalendarDateOrNull = (date: Date | null) => (date ? toCalendarDate(date) : null);

export const toTime = (date: Date) => dayjs(date).format('HH:mm');
