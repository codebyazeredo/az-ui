const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_IN_GRID = 42;

export function parseIsoDate(text: string): Date | null {
  const match = ISO_DATE.exec(text.trim());
  if (!match) return null;

  const [year = 0, month = 0, day = 0] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealDate ? date : null;
}

export function formatIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
  const firstOfTarget = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const daysInTarget = new Date(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth(),
    Math.min(date.getDate(), daysInTarget),
  );
}

export function isSameDay(first: Date, second: Date): boolean {
  return formatIsoDate(first) === formatIsoDate(second);
}

export function buildMonthGrid(year: number, month: number, firstDayOfWeek: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingDays = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
  const start = new Date(year, month, 1 - leadingDays);

  return Array.from({ length: DAYS_IN_GRID }, (_, index) => addDays(start, index));
}
