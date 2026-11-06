import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  formatIsoDate,
  isSameDay,
  parseIsoDate,
} from "../../../src/components/datepicker/calendar";

describe("parseIsoDate", () => {
  it("parses valid ISO dates in local time", () => {
    const date = parseIsoDate("2026-03-15")!;

    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 2, 15]);
  });

  it.each(["", "15/03/2026", "2026-3-5", "2026-02-30", "2026-13-01", "2026-00-10", "abc"])(
    "rejects %j",
    (text) => {
      expect(parseIsoDate(text)).toBeNull();
    },
  );

  it("accepts leap days only in leap years", () => {
    expect(parseIsoDate("2024-02-29")).not.toBeNull();
    expect(parseIsoDate("2026-02-29")).toBeNull();
  });
});

describe("formatIsoDate", () => {
  it("pads month and day and round-trips with parseIsoDate", () => {
    expect(formatIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(formatIsoDate(parseIsoDate("2026-12-31")!)).toBe("2026-12-31");
  });
});

describe("date arithmetic", () => {
  it("adds days across month and year boundaries", () => {
    expect(formatIsoDate(addDays(new Date(2026, 11, 31), 1))).toBe("2027-01-01");
    expect(formatIsoDate(addDays(new Date(2026, 2, 1), -1))).toBe("2026-02-28");
  });

  it("adds months clamping the day to the target month length", () => {
    expect(formatIsoDate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
    expect(formatIsoDate(addMonths(new Date(2026, 0, 15), -1))).toBe("2025-12-15");
    expect(formatIsoDate(addMonths(new Date(2024, 0, 31), 1))).toBe("2024-02-29");
  });

  it("compares calendar days ignoring the time", () => {
    expect(isSameDay(new Date(2026, 4, 1, 8), new Date(2026, 4, 1, 22))).toBe(true);
    expect(isSameDay(new Date(2026, 4, 1), new Date(2026, 4, 2))).toBe(false);
  });
});

describe("buildMonthGrid", () => {
  it("returns 42 consecutive days starting on the first day of the week", () => {
    const grid = buildMonthGrid(2026, 2, 0);

    expect(grid).toHaveLength(42);
    expect(grid[0]!.getDay()).toBe(0);
    expect(formatIsoDate(grid[0]!)).toBe("2026-03-01");
    expect(formatIsoDate(grid[41]!)).toBe("2026-04-11");
  });

  it("starts on Monday when requested and includes leading days of the previous month", () => {
    const grid = buildMonthGrid(2026, 2, 1);

    expect(grid[0]!.getDay()).toBe(1);
    expect(formatIsoDate(grid[0]!)).toBe("2026-02-23");
    expect(grid.some((date) => formatIsoDate(date) === "2026-03-31")).toBe(true);
  });
});
