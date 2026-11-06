import { CIRCLE, LOCK_BODY, USER_BODY, USER_HEAD } from "./shapes";
import type { IconSet } from "./shapes";

export const USER_ICONS = {
  "id-card": [
    "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
    "M7 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    "M6.5 16a3 3 0 0 1 5 0",
    "M14 10h4",
    "M14 14h4",
  ],
  key: ["M4 15a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M11 12l9-9", "M17 6l3 3", "M15 8l2 2"],
  lock: [LOCK_BODY, "M8 11V8a4 4 0 0 1 8 0v3", "M12 15v2"],
  "lock-open": [LOCK_BODY, "M8 11V8a4 4 0 0 1 7.5-2", "M12 15v2"],
  "log-in": ["M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4", "M9 8l4 4-4 4", "M13 12H3"],
  "log-out": ["M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4", "M15 8l4 4-4 4", "M19 12H9"],
  user: ["M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"],
  "user-check": [USER_HEAD, USER_BODY, "M16 11.5l2 2 4-4"],
  "user-circle": [
    CIRCLE,
    "M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0",
    "M6.5 18.5a6 6 0 0 1 11 0",
  ],
  "user-minus": [USER_HEAD, USER_BODY, "M16 11h6"],
  "user-plus": [USER_HEAD, USER_BODY, "M19 8v6", "M16 11h6"],
  users: [USER_HEAD, USER_BODY, "M16 5.2a3 3 0 0 1 0 5.6", "M18 14a5 5 0 0 1 3 4.6V20"],
} as const satisfies IconSet;
