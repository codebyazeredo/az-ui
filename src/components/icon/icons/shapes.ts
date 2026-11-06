export type IconSet = Record<string, readonly string[]>;

export const CIRCLE = "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0";
export const SQUARE = "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z";
export const SEARCH = ["M5 11a6 6 0 1 0 12 0a6 6 0 1 0-12 0", "M15.5 15.5L20 20"] as const;
export const FILE = [
  "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
  "M14 3v5h5",
] as const;
export const FOLDER = "M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z";
export const CALENDAR = [
  "M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
  "M4 10h16",
  "M8 3v4",
  "M16 3v4",
] as const;
export const CLIPBOARD = [
  "M8 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2",
  "M9 3h6v4H9z",
] as const;
export const SHIELD = "M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z";
export const USER_HEAD = "M6 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0";
export const USER_BODY = "M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1";
export const CLOUD = "M8 18H7a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6-1A4.5 4.5 0 0 1 17.5 18H16";
export const PILL = "M8 7h8a5 5 0 0 1 0 10H8a5 5 0 0 1 0-10z";
export const MICROPHONE = [
  "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z",
  "M5 11a7 7 0 0 0 14 0",
  "M12 18v3",
] as const;
export const SPEAKER = "M4 9v6h4l5 4V5L8 9z";
export const EYE = [
  "M2.5 12C4.5 8 8 5.5 12 5.5S19.5 8 21.5 12C19.5 16 16 18.5 12 18.5S4.5 16 2.5 12z",
  "M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
] as const;
export const BELL = ["M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z", "M10 21h4"] as const;
export const LOCK_BODY = "M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z";

export function circlePath(centerX: number, centerY: number, radius: number): string {
  const diameter = radius * 2;
  return `M${centerX - radius} ${centerY}a${radius} ${radius} 0 1 0 ${diameter} 0a${radius} ${radius} 0 1 0 ${-diameter} 0`;
}
