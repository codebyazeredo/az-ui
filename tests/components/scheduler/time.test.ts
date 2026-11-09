import { describe, expect, it } from "vitest";
import {
  addMinutes,
  formatDateTime,
  minutesBetween,
  parseDateTime,
} from "../../../src/components/scheduler/time";

describe("parseDateTime", () => {
  it("reads a local date and time", () => {
    const date = parseDateTime("2026-11-10T08:30");

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(10);
    expect(date?.getDate()).toBe(10);
    expect(date?.getHours()).toBe(8);
    expect(date?.getMinutes()).toBe(30);
  });

  it("refuses dates and times that do not exist", () => {
    expect(parseDateTime("2026-02-30T08:00")).toBeNull();
    expect(parseDateTime("2026-11-10T25:00")).toBeNull();
    expect(parseDateTime("2026-11-10T08:60")).toBeNull();
  });

  it("refuses text in another format", () => {
    expect(parseDateTime("tomorrow")).toBeNull();
    expect(parseDateTime("2026-11-10")).toBeNull();
    expect(parseDateTime("2026-11-10 08:30")).toBeNull();
    expect(parseDateTime("")).toBeNull();
  });
});

describe("formatDateTime", () => {
  it("is the inverse of parseDateTime", () => {
    expect(formatDateTime(parseDateTime("2026-11-10T08:05")!)).toBe("2026-11-10T08:05");
    expect(formatDateTime(new Date(2026, 0, 2, 3, 4))).toBe("2026-01-02T03:04");
  });
});

describe("addMinutes", () => {
  it("adds and subtracts minutes", () => {
    expect(formatDateTime(addMinutes(parseDateTime("2026-11-10T08:30")!, 45))).toBe(
      "2026-11-10T09:15",
    );
    expect(formatDateTime(addMinutes(parseDateTime("2026-11-10T08:30")!, -30))).toBe(
      "2026-11-10T08:00",
    );
  });

  it("crosses midnight and the end of the year", () => {
    expect(formatDateTime(addMinutes(parseDateTime("2026-12-31T23:30")!, 60))).toBe(
      "2027-01-01T00:30",
    );
  });
});

describe("minutesBetween", () => {
  it("returns the signed difference in minutes", () => {
    const start = parseDateTime("2026-11-10T08:00")!;
    const end = parseDateTime("2026-11-10T09:30")!;

    expect(minutesBetween(start, end)).toBe(90);
    expect(minutesBetween(end, start)).toBe(-90);
  });
});
