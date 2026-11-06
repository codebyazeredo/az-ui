import { CIRCLE, SQUARE, circlePath } from "./shapes";
import type { IconSet } from "./shapes";

const WHEEL_RADIUS = 1.75;

function wheel(centerX: number, centerY = 17.5): string {
  return circlePath(centerX, centerY, WHEEL_RADIUS);
}

const BOX_TRUCK_CAB = "M14 9h4l3 3v3h-7";

export const LOGISTICS_ICONS = {
  barcode: ["M4 6v12", "M7 6v12", "M10 6v12", "M14 6v12", "M17 6v12", "M20 6v12"],
  boxes: ["M4 13h7v7H4z", "M13 13h7v7h-7z", "M8.5 5h7v8h-7z"],
  bus: [
    "M4 5h16a1 1 0 0 1 1 1v9H3V6a1 1 0 0 1 1-1z",
    "M3 11h18",
    "M9 5v6",
    "M15 5v6",
    wheel(7),
    wheel(17),
  ],
  car: [
    "M3 15v-4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4z",
    "M6 10l2-3.5h7l3 3.5",
    wheel(7, 16.5),
    wheel(17, 16.5),
  ],
  container: ["M3 6h18v12H3z", "M7 9v6", "M10.5 9v6", "M14 9v6", "M17.5 9v6"],
  "dump-truck": [
    "M2 6h11l-1.5 8h-8z",
    "M14 8h4l3 3.5V14h-7z",
    "M3.5 14H21",
    wheel(6.5, 16.5),
    wheel(17.5, 16.5),
  ],
  flatbed: ["M2 12h12v3H2z", "M5 8h6v4H5z", BOX_TRUCK_CAB, wheel(6), wheel(17.5)],
  forklift: [
    "M5 3v15",
    "M5 16.5H2",
    "M7 17h13v-5h-4V7h-4l-1.5 5H7z",
    circlePath(10, 18.5, WHEEL_RADIUS),
    circlePath(17, 18.5, WHEEL_RADIUS),
  ],
  fragile: ["M8 3h8l-.7 6a3.3 3.3 0 0 1-6.6 0z", "M12 12.5V20", "M8.5 20h7"],
  fuel: [
    "M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16",
    "M4 21h12",
    "M7 8h6v4H7z",
    "M15 10h2a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 0 3 0V9l-2.5-2.5",
  ],
  hazard: ["M12 2.5l9.5 9.5-9.5 9.5L2.5 12z", "M12 8v5", "M12 16h.01"],
  "license-plate": [
    "M3 7h18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z",
    "M2 10h20",
    "M7 14h10",
  ],
  motorcycle: [circlePath(6, 16, 3), circlePath(18, 16, 3), "M6 16l3-6h5l4 6", "M14 10l-1.5-4h3"],
  navigation: ["M4 11L20 4l-7 16-2-7z"],
  package: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M4 7.5l8 4.5 8-4.5", "M12 12v9"],
  pallet: ["M5 6h14v11H5z", "M3 17h18v3H3z", "M9 17v3", "M15 17v3"],
  parking: [SQUARE, "M10 17V7h3a3 3 0 0 1 0 6h-3"],
  plane: [
    "M12 3a1.5 1.5 0 0 1 1.5 1.5V9l7.5 4.5V15l-7.5-2v4l2 1.5V22L12 21l-3.5 1v-1.5l2-1.5v-4L3 15v-1.5L10.5 9V4.5A1.5 1.5 0 0 1 12 3z",
  ],
  "refrigerated-truck": [
    "M2 6h12v9H2z",
    BOX_TRUCK_CAB,
    "M8 8v5",
    "M5.8 9.25l4.4 2.5",
    "M5.8 11.75l4.4-2.5",
    wheel(6),
    wheel(17.5),
  ],
  road: ["M8 3L5 21", "M16 3l3 18", "M12 5v3", "M12 11v3", "M12 17v3"],
  route: [
    "M4 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    "M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16",
    "M16 4a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  ],
  scale: [
    "M12 4v16",
    "M7 20h10",
    "M4 7h16",
    "M4 7l-2.5 6a2.5 2.5 0 0 0 5 0z",
    "M20 7l-2.5 6a2.5 2.5 0 0 0 5 0z",
  ],
  scan: [
    "M4 8V5a1 1 0 0 1 1-1h3",
    "M16 4h3a1 1 0 0 1 1 1v3",
    "M20 16v3a1 1 0 0 1-1 1h-3",
    "M8 20H5a1 1 0 0 1-1-1v-3",
    "M4 12h16",
  ],
  "semi-truck": [
    "M12 15V7a1 1 0 0 1 1-1h4l4 4.5V15",
    "M2 15h19",
    "M3 15v-2h8v2",
    "M14.5 8.5h2.5l1.8 2.2H14.5z",
    "M9 13V4",
    wheel(5.5),
    wheel(9.5),
    wheel(17.5),
  ],
  ship: ["M3 15h18l-2.5 5h-13z", "M5 15v-5h14v5", "M9 10V6h6v4", "M12 6V3"],
  snowflake: ["M12 3v18", "M4.2 7.5l15.6 9", "M4.2 16.5l15.6-9", "M10 5l2 2 2-2", "M10 19l2-2 2 2"],
  "steering-wheel": [CIRCLE, circlePath(12, 12, 2), "M3 12h7", "M14 12h7", "M12 14v7"],
  tanker: [
    "M4.5 6h8a3.5 3.5 0 0 1 0 7h-8a3.5 3.5 0 0 1 0-7z",
    "M2 15h15",
    "M6 13v2",
    "M12 13v2",
    "M17 9h2l2 3v3h-4z",
    wheel(6),
    wheel(18),
  ],
  temperature: ["M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z", "M12 9v7"],
  "this-side-up": [
    "M4 20h16",
    "M8 17V6",
    "M5.5 8.5L8 6l2.5 2.5",
    "M16 17V6",
    "M13.5 8.5L16 6l2.5 2.5",
  ],
  "traffic-cone": ["M9.5 4h5l4 16h-13z", "M7.7 12h8.6", "M3.5 20h17"],
  trailer: ["M2 5h20v10H2z", "M5.5 15v2.5", "M3.5 17.5h4", wheel(15.5), wheel(19.5)],
  train: [
    "M7 3h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    "M5 11h14",
    "M8 21l2.5-4",
    "M16 21l-2.5-4",
    "M9 14h.01",
    "M15 14h.01",
  ],
  truck: ["M2 6h12v9H2z", BOX_TRUCK_CAB, wheel(6), wheel(17.5)],
  "truck-check": ["M2 6h12v9H2z", BOX_TRUCK_CAB, "M5.5 10.5l2 2 4-4", wheel(6), wheel(17.5)],
  "truck-trailer": [
    "M1.5 5h11v9h-11z",
    "M12.5 14h2",
    "M14.5 8h3.5l3.5 3.5V14h-7z",
    wheel(5, 16.5),
    wheel(9, 16.5),
    wheel(18.5, 16.5),
  ],
  van: ["M3 15V8a1 1 0 0 1 1-1h10l4.5 4.5H21V15z", "M14 7v4.5", wheel(7), wheel(17)],
  warehouse: ["M3 9l9-5 9 5", "M5 9v11", "M19 9v11", "M8 20v-8h8v8", "M8 16h8"],
  wrench: [
    "M15 3.5a4.5 4.5 0 0 0-4.2 6.1L3.8 16.6a2 2 0 0 0 2.8 2.8l7-7A4.5 4.5 0 0 0 20.5 9L17.7 11.8 15 11 14.2 8.3 17 5.5z",
  ],
} as const satisfies IconSet;
