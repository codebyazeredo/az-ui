import { CIRCLE, SHIELD } from "./shapes";
import type { IconSet } from "./shapes";

export const STATUS_ICONS = {
  activity: ["M3 12h4l3-8 4 16 3-8h4"],
  "alert-octagon": ["M8 3h8l5 5v8l-5 5H8l-5-5V8z", "M12 8v5", "M12 16h.01"],
  ban: [CIRCLE, "M5.6 5.6l12.8 12.8"],
  bug: [
    "M8 10h8v6a4 4 0 0 1-8 0z",
    "M9 10V8a3 3 0 0 1 6 0v2",
    "M4 8l4 2",
    "M20 8l-4 2",
    "M3 14h5",
    "M16 14h5",
    "M4 20l4-3",
    "M20 20l-4-3",
  ],
  error: [CIRCLE, "M9 9l6 6", "M15 9l-6 6"],
  help: [CIRCLE, "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7", "M12 17h.01"],
  info: [CIRCLE, "M12 11v5", "M12 8h.01"],
  shield: [SHIELD],
  "shield-alert": [SHIELD, "M12 8v5", "M12 16h.01"],
  "shield-check": [SHIELD, "M8.5 12l2.5 2.5 4.5-5"],
  success: [CIRCLE, "M8 12.5l3 3 5-6"],
  warning: [
    "M10.3 4.5L2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0z",
    "M12 10v4",
    "M12 17.5h.01",
  ],
  zap: ["M13 3L5 14h6l-1 7 8-11h-6z"],
} as const satisfies IconSet;
