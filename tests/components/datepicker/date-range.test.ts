import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateRange, Datepicker } from "../../../src/components/datepicker";
import type { DatepickerConfig } from "../../../src/components/datepicker";
import { Component } from "../../../src/javascript/core/component";

function render(startValue = "", endValue = "", config: DatepickerConfig = {}): DateRange {
  document.body.innerHTML = `
    <input id="start" value="${startValue}" />
    <input id="end" value="${endValue}" />`;

  return new DateRange("#start", "#end", { locale: "en", ...config });
}

function input(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function day(isoDate: string): HTMLButtonElement {
  return document.querySelector<HTMLButtonElement>(`[data-az-date="${isoDate}"]`)!;
}

function changeValue(id: string, value: string): void {
  input(id).value = value;
  input(id).dispatchEvent(new Event("change", { bubbles: true }));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 2, 15));
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("DateRange", () => {
  it("limits the end field when the start is chosen in the calendar", () => {
    render();

    input("start").click();
    day("2026-03-12").click();
    input("end").click();

    expect(day("2026-03-11").disabled).toBe(true);
    expect(day("2026-03-12").disabled).toBe(false);
  });

  it("limits the start field when the end is chosen in the calendar", () => {
    render();

    input("end").click();
    day("2026-03-20").click();
    input("start").click();

    expect(day("2026-03-21").disabled).toBe(true);
    expect(day("2026-03-20").disabled).toBe(false);
  });

  it("uses the initial values as limits", () => {
    render("2026-03-10", "2026-03-20");

    input("start").click();
    expect(day("2026-03-21").disabled).toBe(true);
    expect(day("2026-03-20").disabled).toBe(false);
    input("start").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    input("end").click();
    expect(day("2026-03-09").disabled).toBe(true);
    expect(day("2026-03-10").disabled).toBe(false);
  });

  it("clears the end when the start is moved after it", () => {
    const range = render("2026-03-10", "2026-03-12");

    changeValue("start", "2026-03-20");

    expect(range.start).toBe("2026-03-20");
    expect(range.end).toBe("");
    expect(input("end").value).toBe("");
  });

  it("keeps the end when the start moves but stays before it", () => {
    const range = render("2026-03-10", "2026-03-20");

    changeValue("start", "2026-03-15");

    expect(range.end).toBe("2026-03-20");
  });

  it("removes the lower limit of the end when the start is cleared", () => {
    render("2026-03-10", "2026-03-20");

    changeValue("start", "");
    input("end").click();

    expect(day("2026-03-01").disabled).toBe(false);
  });

  it("emits az:daterange:change once per change with start and end", () => {
    render("2026-03-10", "2026-03-12");
    const changed = vi.fn();
    input("start").addEventListener("az:daterange:change", (event) => {
      changed((event as CustomEvent).detail);
    });

    changeValue("start", "2026-03-20");

    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed).toHaveBeenCalledWith({ start: "2026-03-20", end: "" });
  });

  it("returns an empty string for a value that is not a valid date", () => {
    const range = render("not a date", "2026-02-31");

    expect([range.start, range.end]).toEqual(["", ""]);
  });

  it("destroy destroys both datepickers", () => {
    const range = render();

    range.destroy();

    expect(Component.find("datepicker", input("start"))).toBeUndefined();
    expect(Component.find("datepicker", input("end"))).toBeUndefined();
    expect(() => new Datepicker(input("start"))).not.toThrow();
  });

  it("throws without the end field and leaves nothing initialized", () => {
    document.body.innerHTML = `<input id="start" /><input id="end" />`;

    expect(() => new DateRange("#start", "")).toThrow("requires the end field");
    expect(Component.find("daterange", input("start"))).toBeUndefined();
    expect(() => new DateRange("#start", "#end")).not.toThrow();
  });

  it("cleans up when the end field already has a datepicker", () => {
    document.body.innerHTML = `<input id="start" /><input id="end" />`;
    new Datepicker(input("end"));

    expect(() => new DateRange("#start", "#end")).toThrow("already initialized");
    expect(Component.find("datepicker", input("start"))).toBeUndefined();
    expect(Component.find("daterange", input("start"))).toBeUndefined();
  });
});
