import { SPEAKER, SQUARE } from "./shapes";
import type { IconSet } from "./shapes";

export const MEDIA_ICONS = {
  camera: [
    "M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z",
    "M9 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  ],
  image: [SQUARE, "M8 8.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0", "M4 17l5-5 4 4 3-3 4 4"],
  pause: ["M7 5h3v14H7z", "M14 5h3v14h-3z"],
  play: ["M8 5l11 7-11 7z"],
  "skip-back": ["M19 5L9 12l10 7z", "M5 5v14"],
  "skip-forward": ["M5 5l10 7-10 7z", "M19 5v14"],
  stop: ["M6 6h12v12H6z"],
  volume: [SPEAKER, "M16.5 9a4 4 0 0 1 0 6", "M19 6.5a8 8 0 0 1 0 11"],
  "volume-off": [SPEAKER, "M17 9.5l4 5", "M21 9.5l-4 5"],
} as const satisfies IconSet;
