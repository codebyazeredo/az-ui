import { describe, expect, it } from "vitest";
import { diffInDays } from "../../../src/components/datepicker/calendar";

describe("diffInDays", () => {
  it("counts whole days inside a month and between months", () => {
    expect(diffInDays(new Date(2026, 10, 8), new Date(2026, 10, 22))).toBe(14);
    expect(diffInDays(new Date(2026, 10, 28), new Date(2026, 11, 3))).toBe(5);
  });

  it("counts across years and in leap years", () => {
    expect(diffInDays(new Date(2026, 11, 30), new Date(2027, 0, 2))).toBe(3);
    expect(diffInDays(new Date(2028, 1, 28), new Date(2028, 2, 1))).toBe(2);
    expect(diffInDays(new Date(2027, 1, 28), new Date(2027, 2, 1))).toBe(1);
  });

  it("is negative when the second date is earlier and zero for the same day", () => {
    expect(diffInDays(new Date(2026, 10, 10), new Date(2026, 10, 8))).toBe(-2);
    expect(diffInDays(new Date(2026, 10, 10, 1), new Date(2026, 10, 10, 23))).toBe(0);
  });

  it("ignores the time of day and daylight saving changes", () => {
    expect(diffInDays(new Date(2026, 2, 7, 23, 0), new Date(2026, 2, 9, 1, 0))).toBe(2);
    expect(diffInDays(new Date(2026, 9, 31, 12), new Date(2026, 10, 2, 12))).toBe(2);
  });
});
