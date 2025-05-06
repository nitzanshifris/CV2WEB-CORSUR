interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  format?: 'short' | 'medium' | 'long' | 'full';
}

const DEFAULT_LOCALE = 'he-IL';
const DEFAULT_TIMEZONE = 'Asia/Jerusalem';

export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TIMEZONE, format = 'medium' } = options;

  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: format,
  });

  return formatter.format(dateObj);
}

export function formatDateTime(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TIMEZONE, format = 'medium' } = options;

  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: format,
    timeStyle: format,
  });

  return formatter.format(dateObj);
}

export function formatTime(date: Date | string | number, options: DateFormatOptions = {}): string {
  const { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TIMEZONE, format = 'medium' } = options;

  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeStyle: format,
  });

  return formatter.format(dateObj);
}

export function getRelativeTime(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const { locale = DEFAULT_LOCALE } = options;
  const dateObj = new Date(date);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'לפני מספר שניות';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `לפני ${diffInDays} ימים`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `לפני ${diffInWeeks} שבועות`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `לפני ${diffInMonths} חודשים`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `לפני ${diffInYears} שנים`;
}

export function isToday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

export function isThisWeek(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();
  const diffInDays = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  return diffInDays < 7;
}

export function isThisMonth(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
}

export function isThisYear(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.getFullYear() === today.getFullYear();
}

export function addDays(date: Date | string | number, days: number): Date {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

export function addMonths(date: Date | string | number, months: number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

export function addYears(date: Date | string | number, years: number): Date {
  const dateObj = new Date(date);
  dateObj.setFullYear(dateObj.getFullYear() + years);
  return dateObj;
}

export function getStartOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

export function getEndOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

export function getStartOfWeek(date: Date | string | number, firstDayOfWeek: number = 0): Date {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const diff = day - firstDayOfWeek;
  dateObj.setDate(dateObj.getDate() - diff);
  return getStartOfDay(dateObj);
}

export function getEndOfWeek(date: Date | string | number, firstDayOfWeek: number = 0): Date {
  const startOfWeek = getStartOfWeek(date, firstDayOfWeek);
  return getEndOfDay(addDays(startOfWeek, 6));
}

export function getStartOfMonth(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setDate(1);
  return getStartOfDay(dateObj);
}

export function getEndOfMonth(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(dateObj.getMonth() + 1);
  dateObj.setDate(0);
  return getEndOfDay(dateObj);
}

export function getStartOfYear(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(0, 1);
  return getStartOfDay(dateObj);
}

export function getEndOfYear(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(11, 31);
  return getEndOfDay(dateObj);
}
