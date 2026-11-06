import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import { trapTabKey } from "../../javascript/dom/focus";
import { positionFloating } from "../../javascript/dom/position";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { uniqueId } from "../../javascript/dom/unique-id";
import { Icon } from "../icon";
import type { IconName } from "../icon";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  formatIsoDate,
  isSameDay,
  parseIsoDate,
} from "./calendar";

export interface DatepickerLabels {
  dialog: string;
  previousMonth: string;
  nextMonth: string;
}

export interface DatepickerOptions {
  min: string;
  max: string;
  locale: string;
  firstDayOfWeek: number;
  labels: DatepickerLabels;
}

export type DatepickerConfig = Partial<Omit<DatepickerOptions, "labels">> & {
  labels?: Partial<DatepickerLabels>;
};

interface CalendarParts {
  popup: HTMLElement;
  title: HTMLElement;
  body: HTMLElement;
}

const DEFAULT_LABELS: DatepickerLabels = {
  dialog: "Choose date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
};
const DAYS_IN_WEEK = 7;
const FIRST_SUNDAY = new Date(2024, 0, 7);

function resolveOptions(target: string | HTMLElement, config: DatepickerConfig): DatepickerOptions {
  const { azMin = "", azMax = "", azLocale, azFirstDay } = resolveElement(target).dataset;

  return {
    min: config.min ?? azMin,
    max: config.max ?? azMax,
    locale: config.locale ?? azLocale ?? (document.documentElement.lang || "en"),
    firstDayOfWeek: config.firstDayOfWeek ?? Number(azFirstDay ?? 0),
    labels: { ...DEFAULT_LABELS, ...config.labels },
  };
}

export class Datepicker extends Component<DatepickerOptions> {
  private readonly input: HTMLInputElement;
  private readonly minDate: Date | null;
  private readonly maxDate: Date | null;
  private parts: CalendarParts | null = null;
  private focusedDate = new Date();
  private removeDismiss: (() => void) | null = null;

  constructor(target: string | HTMLElement, config: DatepickerConfig = {}) {
    super("datepicker", target, resolveOptions(target, config));

    if (!(this.element instanceof HTMLInputElement)) {
      super.destroy();
      throw new Error("AZUI: datepicker must be initialized on an <input> element.");
    }
    this.input = this.element;
    this.minDate = parseIsoDate(this.options.min);
    this.maxDate = parseIsoDate(this.options.max);

    this.input.setAttribute("aria-haspopup", "dialog");
    this.input.setAttribute("aria-expanded", "false");
    this.listen(this.input, "click", () => this.show());
    this.listen(this.input, "keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      this.show();
    });
  }

  get isOpen(): boolean {
    return this.parts !== null;
  }

  show(): void {
    if (this.isOpen || !this.emit("show", { cancelable: true })) return;

    const parts = this.buildPopup();
    this.parts = parts;
    this.focusedDate = this.clamp(parseIsoDate(this.input.value) ?? new Date());
    document.body.append(parts.popup);
    this.renderDays();
    positionFloating(parts.popup, this.input, "bottom", 4);

    this.input.setAttribute("aria-expanded", "true");
    this.input.setAttribute("aria-controls", parts.popup.id);
    this.removeDismiss = this.track(onDismiss([this.input, parts.popup], () => this.hide()));
    this.focusDay();
    this.emit("shown");
  }

  hide(): void {
    if (!this.parts || !this.emit("hide", { cancelable: true })) return;

    this.close();
    this.emit("hidden");
  }

  override destroy(): void {
    this.close();
    for (const attribute of ["aria-haspopup", "aria-expanded"]) {
      this.input.removeAttribute(attribute);
    }
    super.destroy();
  }

  private close(): void {
    this.parts?.popup.remove();
    this.parts = null;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-controls");
    this.removeDismiss?.();
    this.removeDismiss = null;
  }

  private clamp(date: Date): Date {
    if (this.minDate && date < this.minDate) return this.minDate;
    if (this.maxDate && date > this.maxDate) return this.maxDate;
    return date;
  }

  private buildPopup(): CalendarParts {
    const { labels, locale, firstDayOfWeek } = this.options;

    const popup = document.createElement("div");
    popup.className = "az-datepicker";
    popup.id = uniqueId("az-datepicker");
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", labels.dialog);

    const title = document.createElement("div");
    title.className = "az-datepicker-title";
    title.id = `${popup.id}-title`;
    title.setAttribute("aria-live", "polite");

    const header = document.createElement("div");
    header.className = "az-datepicker-header";
    header.append(
      this.createNavButton("chevron-left", labels.previousMonth, -1),
      title,
      this.createNavButton("chevron-right", labels.nextMonth, 1),
    );

    const weekdays = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    const weekdayNames = new Intl.DateTimeFormat(locale, { weekday: "long" });
    const headings = document.createElement("tr");
    for (let offset = 0; offset < DAYS_IN_WEEK; offset += 1) {
      const day = addDays(FIRST_SUNDAY, (firstDayOfWeek + offset) % DAYS_IN_WEEK);
      const heading = document.createElement("th");
      heading.scope = "col";
      heading.abbr = weekdayNames.format(day);
      heading.textContent = weekdays.format(day);
      headings.append(heading);
    }
    const head = document.createElement("thead");
    head.append(headings);

    const body = document.createElement("tbody");
    const grid = document.createElement("table");
    grid.className = "az-datepicker-grid";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-labelledby", title.id);
    grid.append(head, body);

    popup.append(header, grid);
    popup.addEventListener("click", (event) => this.handlePopupClick(event));
    popup.addEventListener("keydown", (event) => this.handlePopupKey(event));

    return { popup, title, body };
  }

  private createNavButton(icon: IconName, label: string, monthDelta: number): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-btn az-btn-ghost az-btn-sm";
    button.append(Icon.create(icon));
    button.setAttribute("aria-label", label);
    button.dataset.azMonthDelta = String(monthDelta);

    return button;
  }

  private renderDays(): void {
    if (!this.parts) return;

    const { locale, firstDayOfWeek } = this.options;
    const year = this.focusedDate.getFullYear();
    const month = this.focusedDate.getMonth();
    const selected = parseIsoDate(this.input.value);
    const today = new Date();
    const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
    const days = buildMonthGrid(year, month, firstDayOfWeek);

    this.parts.title.textContent = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(this.focusedDate);

    const rows: HTMLElement[] = [];
    for (let start = 0; start < days.length; start += DAYS_IN_WEEK) {
      const row = document.createElement("tr");
      for (const date of days.slice(start, start + DAYS_IN_WEEK)) {
        const cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        if (selected && isSameDay(date, selected)) cell.setAttribute("aria-selected", "true");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "az-datepicker-day";
        if (date.getMonth() !== month) button.classList.add("az-datepicker-day-outside");
        if (isSameDay(date, today)) button.classList.add("az-datepicker-day-today");
        button.textContent = String(date.getDate());
        button.dataset.azDate = formatIsoDate(date);
        button.setAttribute("aria-label", fullDate.format(date));
        button.tabIndex = isSameDay(date, this.focusedDate) ? 0 : -1;
        button.disabled = this.clamp(date) !== date;

        cell.append(button);
        row.append(cell);
      }
      rows.push(row);
    }
    this.parts.body.replaceChildren(...rows);
  }

  private focusDay(): void {
    this.parts?.body.querySelector<HTMLElement>('.az-datepicker-day[tabindex="0"]')?.focus();
  }

  private moveTo(date: Date, focusDay: boolean): void {
    this.focusedDate = this.clamp(date);
    this.renderDays();
    if (focusDay) this.focusDay();
  }

  private select(date: Date): void {
    this.input.value = formatIsoDate(date);
    this.input.dispatchEvent(new Event("input", { bubbles: true }));
    this.input.dispatchEvent(new Event("change", { bubbles: true }));
    this.emit("select", { detail: { value: this.input.value } });
    this.hide();
    this.input.focus();
  }

  private handlePopupClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const day = event.target.closest<HTMLElement>(".az-datepicker-day");
    const date = parseIsoDate(day?.dataset.azDate ?? "");
    if (date) {
      this.select(date);
      return;
    }

    const delta = event.target.closest<HTMLElement>("[data-az-month-delta]")?.dataset.azMonthDelta;
    if (delta) this.moveTo(addMonths(this.focusedDate, Number(delta)), false);
  }

  private handlePopupKey(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.hide();
      this.input.focus();
      return;
    }
    if (this.parts) trapTabKey(event, this.parts.popup);
    if (!(event.target instanceof Element) || !event.target.closest(".az-datepicker-day")) return;

    const weekStart =
      (this.focusedDate.getDay() - this.options.firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(this.focusedDate, -1),
      ArrowRight: addDays(this.focusedDate, 1),
      ArrowUp: addDays(this.focusedDate, -DAYS_IN_WEEK),
      ArrowDown: addDays(this.focusedDate, DAYS_IN_WEEK),
      PageUp: addMonths(this.focusedDate, -1),
      PageDown: addMonths(this.focusedDate, 1),
      Home: addDays(this.focusedDate, -weekStart),
      End: addDays(this.focusedDate, DAYS_IN_WEEK - 1 - weekStart),
    };
    const next = moves[event.key];
    if (!next) return;

    event.preventDefault();
    this.moveTo(next, true);
  }
}
