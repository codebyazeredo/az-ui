const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const MILLISECONDS_PER_MINUTE = 60_000;

export function parseDateTime(text: string): Date | null {
  const match = DATE_TIME.exec(text.trim());
  if (!match) return null;

  const [year = 0, month = 0, day = 0, hour = 0, minute = 0] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  const isReal =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute;

  return isReal ? date : null;
}

export function formatDateTime(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes() + minutes,
  );
}

export function minutesBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MILLISECONDS_PER_MINUTE);
}
