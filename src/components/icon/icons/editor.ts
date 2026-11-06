import type { IconSet } from "./shapes";

export const EDITOR_ICONS = {
  "align-center": ["M4 6h16", "M7 10h10", "M4 14h16", "M7 18h10"],
  "align-justify": ["M4 6h16", "M4 10h16", "M4 14h16", "M4 18h16"],
  "align-left": ["M4 6h16", "M4 10h10", "M4 14h16", "M4 18h10"],
  "align-right": ["M4 6h16", "M10 10h10", "M4 14h16", "M10 18h10"],
  bold: ["M7 4h6a4 4 0 0 1 0 8H7z", "M7 12h7a4 4 0 0 1 0 8H7z"],
  droplet: ["M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"],
  indent: ["M4 5h16", "M12 10h8", "M12 15h8", "M4 20h16", "M4 9l3 3-3 3"],
  italic: ["M10 4h8", "M6 20h8", "M15 4L9 20"],
  outdent: ["M4 5h16", "M12 10h8", "M12 15h8", "M4 20h16", "M7 9l-3 3 3 3"],
  palette: [
    "M12 3a9 9 0 1 0 0 18 2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.2H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z",
    "M7.5 11h.01",
    "M10 7.5h.01",
    "M14.5 7.5h.01",
  ],
  quote: [
    "M5 11a4 4 0 0 1 4-4v2.5A1.5 1.5 0 0 0 7.5 11H9v5H5z",
    "M14 11a4 4 0 0 1 4-4v2.5a1.5 1.5 0 0 0-1.5 1.5H18v5h-4z",
  ],
  strikethrough: [
    "M5 12h14",
    "M16 7.5C15.3 5.8 13.9 5 12 5c-2.4 0-4 1.2-4 3s1.4 2.4 4 4",
    "M8 16.5C8.7 18.2 10.1 19 12 19c2.4 0 4-1.2 4-3",
  ],
  type: ["M5 6V4h14v2", "M12 4v16", "M9 20h6"],
  underline: ["M7 4v7a5 5 0 0 0 10 0V4", "M5 20h14"],
} as const satisfies IconSet;
