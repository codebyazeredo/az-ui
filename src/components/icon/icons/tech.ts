import type { IconSet } from "./shapes";

const WIFI = [
  "M3 9a13 13 0 0 1 18 0",
  "M6 12.5a9 9 0 0 1 12 0",
  "M9 16a5 5 0 0 1 6 0",
  "M12 19.5h.01",
] as const;

export const TECH_ICONS = {
  battery: [
    "M4 8h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z",
    "M21 11v2",
    "M6 12h7",
  ],
  braces: [
    "M9 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3",
    "M15 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3",
  ],
  code: ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 5l-4 14"],
  cpu: [
    "M7 7h10v10H7z",
    "M10 10h4v4h-4z",
    "M9 3v4",
    "M15 3v4",
    "M9 17v4",
    "M15 17v4",
    "M3 9h4",
    "M3 15h4",
    "M17 9h4",
    "M17 15h4",
  ],
  "git-branch": [
    "M4 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    "M16 6a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    "M6 3v13",
    "M18 8v1a6 6 0 0 1-6 6H6",
  ],
  laptop: ["M5 5h14a1 1 0 0 1 1 1v9H4V6a1 1 0 0 1 1-1z", "M2 19h20"],
  monitor: [
    "M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
    "M8 20h8",
    "M12 16v4",
  ],
  plug: ["M9 3v5", "M15 3v5", "M6 8h12v3a6 6 0 0 1-12 0z", "M12 17v4"],
  smartphone: [
    "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
    "M11 18h2",
  ],
  terminal: [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
    "M7 10l3 2-3 2",
    "M12 15h5",
  ],
  wifi: [...WIFI],
  "wifi-off": [...WIFI, "M4 4l16 16"],
} as const satisfies IconSet;
