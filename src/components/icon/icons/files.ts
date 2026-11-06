import { CLOUD, FILE, FOLDER } from "./shapes";
import type { IconSet } from "./shapes";

export const FILE_ICONS = {
  cloud: [CLOUD],
  "cloud-download": [CLOUD, "M12 12v8", "M9 17l3 3 3-3"],
  "cloud-upload": [CLOUD, "M12 20v-8", "M9 15l3-3 3 3"],
  database: [
    "M5 6a7 3 0 1 0 14 0a7 3 0 1 0-14 0",
    "M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6",
    "M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3",
  ],
  file: [...FILE],
  "file-check": [...FILE, "M9 15l2 2 4-4"],
  "file-code": [...FILE, "M10 13l-2 2 2 2", "M14 13l2 2-2 2"],
  "file-image": [...FILE, "M8 18l3-3.5 2 2 1.5-1.5 2 3"],
  "file-minus": [...FILE, "M9 15h6"],
  "file-plus": [...FILE, "M12 12v6", "M9 15h6"],
  "file-text": [...FILE, "M9 13h6", "M9 17h6"],
  folder: [FOLDER],
  "folder-open": [
    "M4 19V6a1 1 0 0 1 1-1h4l2 2h7a1 1 0 0 1 1 1v2",
    "M4 19l2.4-8a1 1 0 0 1 1-.7H21l-2.4 8a1 1 0 0 1-1 .7z",
  ],
  "folder-plus": [FOLDER, "M12 11v6", "M9 14h6"],
  "hard-drive": [
    "M4 14l2-7.5a1 1 0 0 1 1-.5h10a1 1 0 0 1 1 .5L20 14",
    "M5 14h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
    "M8 17h.01",
  ],
  paperclip: [
    "M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.5 17a1.7 1.7 0 0 1-2.4-2.4L15 6.7",
  ],
  server: [
    "M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
    "M5 13h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z",
    "M8 7.5h.01",
    "M8 16.5h.01",
  ],
} as const satisfies IconSet;
