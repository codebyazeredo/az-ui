import { BELL, MICROPHONE } from "./shapes";
import type { IconSet } from "./shapes";

export const COMMUNICATION_ICONS = {
  bell: [...BELL],
  "bell-off": ["M8.5 5.5A6 6 0 0 1 18 11v3", "M6 11v5l-1.5 2H16", "M10 21h4", "M3 3l18 18"],
  "bell-ring": [...BELL, "M3 8a9 9 0 0 1 2.5-4", "M21 8a9 9 0 0 0-2.5-4"],
  mail: ["M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M4 7l8 6 8-6"],
  "mail-open": ["M4 10l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z", "M4 10l8 6 8-6"],
  "message-circle": ["M4 20l1.2-4A8.5 8.5 0 1 1 8 18.8z"],
  "message-square": ["M5 4h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z"],
  mic: [...MICROPHONE],
  "mic-off": [...MICROPHONE, "M4 4l16 16"],
  phone: [
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z",
  ],
  video: [
    "M4 7h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z",
    "M15 11l6-3v8l-6-3z",
  ],
} as const satisfies IconSet;
