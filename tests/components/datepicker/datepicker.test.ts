import { afterEach, describe, expect, it, vi } from "vitest";
import { Datepicker } from "../../../src/components/datepicker";
import type { DatepickerConfig } from "../../../src/components/datepicker";

function render(value = "2026-03-10", config: DatepickerConfig = {}): HTMLInputElement {
  document.body.innerHTML = `<p id="outside">outside</p><input id="date" class="az-control" value="${value}" />`;
  const input = document.getElementById("date") as HTMLInputElement;
  new Datepicker(input, { locale: "en", ...config });

  return input;
}

function day(isoDate: string): HTMLButtonElement {
  return document.querySelector<HTMLButtonElement>(`[data-az-date="${isoDate}"]`)!;
}

function press(key: string, target: Element = document.activeElement ?? document.body): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Datepicker", () => {
  it("opens a dialog with a 42-day grid for the month of the current value", () => {
    const input = render();

    input.click();

    const popup = document.querySelector(".az-datepicker")!;
    expect(popup.getAttribute("role")).toBe("dialog");
    expect(popup.getAttribute("aria-label")).toBe("Choose date");
    expect(document.querySelector(".az-datepicker-title")!.textContent).toBe("March 2026");
    expect(popup.querySelectorAll(".az-datepicker-day")).toHaveLength(42);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(popup.id);
    expect(document.querySelectorAll(".az-datepicker-grid th")).toHaveLength(7);
  });

  it("focuses the current value and marks it as selected", () => {
    render("2026-03-10").click();

    expect(document.activeElement).toBe(day("2026-03-10"));
    expect(day("2026-03-10").closest("td")!.getAttribute("aria-selected")).toBe("true");
    expect(day("2026-03-11").tabIndex).toBe(-1);
    expect(day("2026-03-10").getAttribute("aria-label")).toBe("Tuesday, March 10, 2026");
  });

  it("selects a day: updates the value, fires input and change, closes and restores focus", () => {
    const input = render();
    const events: string[] = [];
    input.addEventListener("input", () => events.push("input"));
    input.addEventListener("change", () => events.push("change"));
    const select = vi.fn();
    document.addEventListener("az:datepicker:select", select);
    input.click();

    day("2026-03-15").click();

    expect(input.value).toBe("2026-03-15");
    expect(events).toEqual(["input", "change"]);
    expect(select).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".az-datepicker")).toBeNull();
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute("aria-expanded")).toBe("false");
    document.removeEventListener("az:datepicker:select", select);
  });

  it("changes month with the navigation buttons", () => {
    render().click();

    document.querySelector<HTMLElement>('[aria-label="Next month"]')!.click();
    expect(document.querySelector(".az-datepicker-title")!.textContent).toBe("April 2026");

    document.querySelector<HTMLElement>('[aria-label="Previous month"]')!.click();
    document.querySelector<HTMLElement>('[aria-label="Previous month"]')!.click();
    expect(document.querySelector(".az-datepicker-title")!.textContent).toBe("February 2026");
  });

  it("moves focus with the keyboard across weeks and months", () => {
    render("2026-03-10").click();

    press("ArrowRight");
    expect(document.activeElement).toBe(day("2026-03-11"));
    press("ArrowDown");
    expect(document.activeElement).toBe(day("2026-03-18"));
    press("ArrowLeft");
    press("ArrowUp");
    expect(document.activeElement).toBe(day("2026-03-10"));
    press("Home");
    expect(document.activeElement).toBe(day("2026-03-08"));
    press("End");
    expect(document.activeElement).toBe(day("2026-03-14"));
    press("PageDown");
    expect(document.querySelector(".az-datepicker-title")!.textContent).toBe("April 2026");
    expect(document.activeElement).toBe(day("2026-04-14"));
    press("PageUp");
    expect(document.activeElement).toBe(day("2026-03-14"));
  });

  it("honours firstDayOfWeek", () => {
    render("2026-03-10", { firstDayOfWeek: 1 }).click();

    expect(document.querySelector(".az-datepicker-grid th")!.textContent).toBe("M");
    press("Home");
    expect(document.activeElement).toBe(day("2026-03-09"));
  });

  it("closes with Escape returning focus, outside and with ArrowDown reopening", () => {
    const input = render();

    input.click();
    press("Escape");
    expect(document.querySelector(".az-datepicker")).toBeNull();
    expect(document.activeElement).toBe(input);

    press("ArrowDown", input);
    expect(document.querySelector(".az-datepicker")).not.toBeNull();

    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(document.querySelector(".az-datepicker")).toBeNull();
  });

  it("disables days outside min and max and clamps keyboard movement", () => {
    render("2026-03-10", { min: "2026-03-05", max: "2026-03-20" }).click();

    expect(day("2026-03-04").disabled).toBe(true);
    expect(day("2026-03-21").disabled).toBe(true);
    expect(day("2026-03-05").disabled).toBe(false);

    press("End");
    press("ArrowDown");
    press("ArrowDown");
    expect(document.activeElement).toBe(day("2026-03-20"));
  });

  it("opens on the clamped current date when the input is empty or invalid", () => {
    render("not a date", { min: "2030-06-01", max: "2030-06-30" }).click();

    expect(document.querySelector(".az-datepicker-title")!.textContent).toBe("June 2030");
  });

  it("reads options from data attributes", () => {
    document.body.innerHTML =
      '<input id="date" value="2026-03-10" data-az-locale="pt-BR" data-az-min="2026-03-02" data-az-first-day="1" />';
    const input = document.getElementById("date") as HTMLInputElement;
    new Datepicker(input);

    input.click();

    expect(document.querySelector(".az-datepicker-title")!.textContent?.toLowerCase()).toBe(
      "março de 2026",
    );
    expect(day("2026-03-01").disabled).toBe(true);
  });

  it("supports custom labels", () => {
    render("2026-03-10", { labels: { dialog: "Pick", nextMonth: "Avançar" } }).click();

    expect(document.querySelector(".az-datepicker")!.getAttribute("aria-label")).toBe("Pick");
    expect(document.querySelector('[aria-label="Avançar"]')).not.toBeNull();
  });

  it("emits a cancelable show event", () => {
    const input = render();
    const prevent = (event: Event): void => event.preventDefault();

    document.addEventListener("az:datepicker:show", prevent);
    input.click();
    document.removeEventListener("az:datepicker:show", prevent);

    expect(document.querySelector(".az-datepicker")).toBeNull();
  });

  it("only works on inputs and can be initialized again after a failure", () => {
    document.body.innerHTML = '<div id="not-input"></div>';
    const element = document.getElementById("not-input")!;

    expect(() => new Datepicker(element)).toThrow("<input>");
    expect(() => new Datepicker(element)).toThrow("<input>");
  });

  it("removes the popup, attributes and listeners on destroy", () => {
    document.body.innerHTML = '<input id="date" value="2026-03-10" />';
    const input = document.getElementById("date") as HTMLInputElement;
    const picker = new Datepicker(input, { locale: "en" });
    input.click();

    picker.destroy();
    input.click();

    expect(document.querySelector(".az-datepicker")).toBeNull();
    expect(input.hasAttribute("aria-haspopup")).toBe(false);
    expect(input.hasAttribute("aria-controls")).toBe(false);
  });
});
