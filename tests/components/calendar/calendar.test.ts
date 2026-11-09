import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Calendar,
  type CalendarEvent,
  type CalendarOptions,
} from "../../../src/components/calendar";

function render(options: CalendarOptions = {}, attributes = ""): Calendar {
  document.body.innerHTML = `<div id="cal" ${attributes}></div>`;

  return new Calendar("#cal", { locale: "en", ...options });
}

function cell(date: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`td[data-date="${date}"]`);
}

function dayButton(date: string): HTMLButtonElement {
  return cell(date)!.querySelector<HTMLButtonElement>(".az-calendar-day")!;
}

function chips(date: string): string[] {
  return [...cell(date)!.querySelectorAll(".az-calendar-event")].map(
    (chip) => chip.textContent ?? "",
  );
}

function title(): string {
  return document.querySelector(".az-calendar-title")!.textContent ?? "";
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

const event = (id: string, date: string, extra: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id,
  date,
  title: `Event ${id}`,
  ...extra,
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 9));
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Calendar", () => {
  it("draws the month title, the weekday headers and 42 days", () => {
    render();

    expect(title()).toBe("November 2026");
    expect(
      [...document.querySelectorAll(".az-calendar-grid th")].map((th) => th.textContent),
    ).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    expect(document.querySelectorAll(".az-calendar-day")).toHaveLength(42);
    expect(document.querySelector(".az-calendar-grid")!.getAttribute("role")).toBe("grid");
  });

  it("starts the week on firstDayOfWeek", () => {
    render({ firstDayOfWeek: 1 });

    expect(document.querySelector(".az-calendar-grid th")!.textContent).toBe("Mon");
    expect(document.querySelector("td[data-date]")!.getAttribute("data-date")).toBe("2026-10-26");
  });

  it("reads the options from data attributes", () => {
    render({ locale: "en" }, 'data-az-first-day="1" data-az-max-events="1"');

    expect(document.querySelector("td[data-date]")!.getAttribute("data-date")).toBe("2026-10-26");
  });

  it("marks today and gives the focused day the single tab stop", () => {
    render();

    expect(dayButton("2026-11-09").classList.contains("az-calendar-day-today")).toBe(true);
    expect(dayButton("2026-11-09").tabIndex).toBe(0);
    expect(dayButton("2026-11-10").tabIndex).toBe(-1);
  });

  it("gives every day button the full date as its accessible name", () => {
    render();

    expect(dayButton("2026-11-09").getAttribute("aria-label")).toBe("Monday, November 9, 2026");
  });

  it("shows each event on its day, including days of the neighbor months", () => {
    const calendar = render({ firstDayOfWeek: 1 });

    calendar.setEvents([event("1", "2026-11-12"), event("2", "2026-10-28", { variant: "danger" })]);

    expect(chips("2026-11-12")).toEqual(["Event 1"]);
    expect(chips("2026-10-28")).toEqual(["Event 2"]);
    expect(cell("2026-10-28")!.querySelector(".az-calendar-event-danger")).not.toBeNull();
    expect(cell("2026-10-28")!.classList.contains("az-calendar-cell-outside")).toBe(true);
  });

  it("shows +N more when a day has more events than the limit and selects the day", () => {
    const calendar = render({ maxEventsPerDay: 2 });
    calendar.setEvents([
      event("1", "2026-11-12"),
      event("2", "2026-11-12"),
      event("3", "2026-11-12"),
    ]);
    const selected = vi.fn();
    document.getElementById("cal")!.addEventListener("az:calendar:select", (e) => {
      selected((e as CustomEvent).detail.date);
    });

    expect(chips("2026-11-12")).toHaveLength(2);
    const more = cell("2026-11-12")!.querySelector<HTMLElement>(".az-calendar-more")!;
    expect(more.textContent).toBe("+1 more");
    more.click();

    expect(selected).toHaveBeenCalledWith("2026-11-12");
  });

  it("does not show +N more when the events fit", () => {
    const calendar = render({ maxEventsPerDay: 2 });
    calendar.setEvents([event("1", "2026-11-12"), event("2", "2026-11-12")]);

    expect(document.querySelector(".az-calendar-more")).toBeNull();
  });

  it("goes from December to January of the next year and emits navigate", () => {
    const calendar = render();
    calendar.setMonth("2026-12-15");
    const navigated = vi.fn();
    document.getElementById("cal")!.addEventListener("az:calendar:navigate", (e) => {
      navigated((e as CustomEvent).detail);
    });

    calendar.next();

    expect(calendar.month).toEqual({ year: 2027, month: 0 });
    expect(title()).toBe("January 2027");
    expect(navigated).toHaveBeenCalledWith({ year: 2027, month: 0 });
  });

  it("goes back from January to December", () => {
    const calendar = render();
    calendar.setMonth("2027-01-10");

    calendar.previous();

    expect(calendar.month).toEqual({ year: 2026, month: 11 });
  });

  it("has the 29th of February in a leap year only", () => {
    const calendar = render();

    calendar.setMonth("2028-02-01");
    expect(cell("2028-02-29")).not.toBeNull();

    calendar.setMonth("2027-02-01");
    expect(cell("2027-02-29")).toBeNull();
    expect(cell("2027-02-28")).not.toBeNull();
  });

  it("does not emit navigate when the month does not change", () => {
    const calendar = render();
    const navigated = vi.fn();
    document.getElementById("cal")!.addEventListener("az:calendar:navigate", navigated);

    calendar.setMonth("2026-11-20");

    expect(navigated).not.toHaveBeenCalled();
  });

  it("today returns to the current month", () => {
    const calendar = render();
    calendar.setMonth("2030-05-01");

    calendar.today();

    expect(calendar.month).toEqual({ year: 2026, month: 10 });
  });

  it("navigates with the header buttons", () => {
    render();

    document.querySelector<HTMLElement>('[data-action="next"]')!.click();
    expect(title()).toBe("December 2026");

    document.querySelector<HTMLElement>('[data-action="previous"]')!.click();
    document.querySelector<HTMLElement>('[data-action="previous"]')!.click();
    expect(title()).toBe("October 2026");

    document.querySelector<HTMLElement>('[data-action="today"]')!.click();
    expect(title()).toBe("November 2026");
    expect(document.querySelector('[data-action="next"]')!.getAttribute("aria-label")).toBe(
      "Next month",
    );
  });

  it("moves the focus with the arrow keys, Home and End", () => {
    render();
    dayButton("2026-11-09").focus();

    press(dayButton("2026-11-09"), "ArrowRight");
    expect(document.activeElement).toBe(dayButton("2026-11-10"));

    press(dayButton("2026-11-10"), "ArrowDown");
    expect(document.activeElement).toBe(dayButton("2026-11-17"));

    press(dayButton("2026-11-17"), "Home");
    expect(document.activeElement).toBe(dayButton("2026-11-15"));

    press(dayButton("2026-11-15"), "End");
    expect(document.activeElement).toBe(dayButton("2026-11-21"));
  });

  it("moves to another month with PageUp and PageDown", () => {
    const calendar = render();
    dayButton("2026-11-09").focus();

    press(dayButton("2026-11-09"), "PageDown");

    expect(calendar.month).toEqual({ year: 2026, month: 11 });
    expect(document.activeElement).toBe(dayButton("2026-12-09"));
  });

  it("selects the focused day with Enter and with Space", () => {
    render();
    const selected = vi.fn();
    document.getElementById("cal")!.addEventListener("az:calendar:select", (e) => {
      selected((e as CustomEvent).detail.date);
    });

    press(dayButton("2026-11-09"), "Enter");
    press(dayButton("2026-11-09"), " ");

    expect(selected.mock.calls).toEqual([["2026-11-09"], ["2026-11-09"]]);
  });

  it("does not block Tab", () => {
    render();
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });

    dayButton("2026-11-09").dispatchEvent(tab);

    expect(tab.defaultPrevented).toBe(false);
  });

  it("emits select when a day is clicked and eventclick when an event is clicked", () => {
    const calendar = render();
    calendar.setEvents([event("a", "2026-11-12")]);
    const selected = vi.fn();
    const clicked = vi.fn();
    const root = document.getElementById("cal")!;
    root.addEventListener("az:calendar:select", (e) => selected((e as CustomEvent).detail.date));
    root.addEventListener("az:calendar:eventclick", (e) =>
      clicked((e as CustomEvent).detail.event.id),
    );

    dayButton("2026-11-13").click();
    cell("2026-11-12")!.querySelector<HTMLElement>(".az-calendar-event")!.click();

    expect(selected).toHaveBeenCalledTimes(1);
    expect(selected).toHaveBeenCalledWith("2026-11-13");
    expect(clicked).toHaveBeenCalledWith("a");
  });

  it("shows an event title with markup as text", () => {
    const calendar = render();

    calendar.setEvents([event("x", "2026-11-12", { title: "<b>Dock</b> <img src=x>" })]);

    expect(cell("2026-11-12")!.querySelector("b, img")).toBeNull();
    expect(chips("2026-11-12")).toEqual(["<b>Dock</b> <img src=x>"]);
  });

  it("setEvents replaces the previous events", () => {
    const calendar = render();
    calendar.setEvents([event("1", "2026-11-12")]);

    calendar.setEvents([event("2", "2026-11-14")]);

    expect(chips("2026-11-12")).toEqual([]);
    expect(chips("2026-11-14")).toEqual(["Event 2"]);
  });

  it("throws for an event or a month with an invalid date", () => {
    const calendar = render();

    expect(() => calendar.setEvents([event("bad", "2026-02-30")])).toThrow(
      'calendar event "bad" has an invalid date',
    );
    expect(() => calendar.setMonth("November")).toThrow("not a valid date");
  });

  it("destroy empties the element and removes the class it added", () => {
    const calendar = render();

    calendar.destroy();

    expect(document.getElementById("cal")!.children).toHaveLength(0);
    expect(document.getElementById("cal")!.classList.contains("az-calendar")).toBe(false);
  });

  it("throws when initialized twice", () => {
    const calendar = render();

    expect(() => new Calendar(calendar.element)).toThrow("already initialized");
  });
});
