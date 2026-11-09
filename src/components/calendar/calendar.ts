import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  formatIsoDate,
  isSameDay,
  parseIsoDate,
} from "../datepicker/calendar";
import { Icon } from "../icon";

export type CalendarVariant = "default" | "success" | "warning" | "danger" | "info";

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  variant?: CalendarVariant;
}

export interface CalendarLabels {
  previousMonth: string;
  nextMonth: string;
  today: string;
  more: string;
}

export interface CalendarOptions {
  locale?: string;
  firstDayOfWeek?: number;
  maxEventsPerDay?: number;
  labels?: Partial<CalendarLabels>;
}

interface ResolvedOptions {
  locale: string;
  firstDayOfWeek: number;
  maxEventsPerDay: number;
  labels: CalendarLabels;
}

const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  today: "Today",
  more: "+{count} more",
};
const VARIANTS: CalendarVariant[] = ["default", "success", "warning", "danger", "info"];
const DAYS_IN_WEEK = 7;
const FIRST_SUNDAY = new Date(2024, 0, 7);

function resolveOptions(element: HTMLElement, options: CalendarOptions): ResolvedOptions {
  const { azLocale, azFirstDay, azMaxEvents } = element.dataset;

  return {
    locale: options.locale ?? azLocale ?? (document.documentElement.lang || "en"),
    firstDayOfWeek: options.firstDayOfWeek ?? Number(azFirstDay ?? 0),
    maxEventsPerDay: options.maxEventsPerDay ?? Number(azMaxEvents ?? 3),
    labels: { ...DEFAULT_LABELS, ...options.labels },
  };
}

export class Calendar extends Component<ResolvedOptions> {
  private readonly title = document.createElement("span");
  private readonly body = document.createElement("tbody");
  private readonly addedClass: boolean;
  private year: number;
  private monthIndex: number;
  private focusedDate: Date;
  private events: CalendarEvent[] = [];

  constructor(target: string | HTMLElement, options: CalendarOptions = {}) {
    super("calendar", target, resolveOptions(resolveElement(target), options));

    this.addedClass = !this.element.classList.contains("az-calendar");
    this.element.classList.add("az-calendar");
    const today = new Date();
    this.year = today.getFullYear();
    this.monthIndex = today.getMonth();
    this.focusedDate = today;

    this.build();
    this.render();
    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.listen(this.element, "keydown", (event) => this.handleKey(event));
  }

  get month(): { year: number; month: number } {
    return { year: this.year, month: this.monthIndex };
  }

  setEvents(events: CalendarEvent[]): void {
    for (const event of events) {
      if (!parseIsoDate(event.date)) {
        throw new Error(
          `AZUI: calendar event "${event.id}" has an invalid date (expected YYYY-MM-DD).`,
        );
      }
    }
    this.events = events.map((event) => ({ ...event }));
    this.render();
  }

  setMonth(date: string): void {
    const parsed = parseIsoDate(date);
    if (!parsed) {
      throw new Error(`AZUI: calendar month "${date}" is not a valid date (expected YYYY-MM-DD).`);
    }

    this.showMonth(parsed.getFullYear(), parsed.getMonth());
  }

  previous(): void {
    this.shiftMonth(-1);
  }

  next(): void {
    this.shiftMonth(1);
  }

  today(): void {
    const today = new Date();
    this.focusedDate = today;
    this.showMonth(today.getFullYear(), today.getMonth());
  }

  override destroy(): void {
    this.element.replaceChildren();
    if (this.addedClass) this.element.classList.remove("az-calendar");
    super.destroy();
  }

  private build(): void {
    const { locale, firstDayOfWeek, labels } = this.options;

    const header = document.createElement("div");
    header.className = "az-calendar-header";
    this.title.className = "az-calendar-title";
    this.title.setAttribute("aria-live", "polite");
    header.append(
      this.createNavButton("previous", labels.previousMonth, Icon.create("chevron-left")),
      this.title,
      this.createTodayButton(labels.today),
      this.createNavButton("next", labels.nextMonth, Icon.create("chevron-right")),
    );

    const weekdays = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const headRow = document.createElement("tr");
    for (let index = 0; index < DAYS_IN_WEEK; index += 1) {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = weekdays.format(addDays(FIRST_SUNDAY, firstDayOfWeek + index));
      headRow.append(cell);
    }
    const head = document.createElement("thead");
    head.append(headRow);

    const grid = document.createElement("table");
    grid.className = "az-calendar-grid";
    grid.setAttribute("role", "grid");
    grid.append(head, this.body);

    this.element.replaceChildren(header, grid);
  }

  private createNavButton(action: string, label: string, icon: Node): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-btn az-btn-ghost az-btn-sm";
    button.dataset.action = action;
    button.setAttribute("aria-label", label);
    button.append(icon);

    return button;
  }

  private createTodayButton(label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-btn az-btn-sm";
    button.dataset.action = "today";
    button.textContent = label;

    return button;
  }

  private eventsByDate(): Map<string, CalendarEvent[]> {
    const grouped = new Map<string, CalendarEvent[]>();
    for (const event of this.events) {
      grouped.set(event.date, [...(grouped.get(event.date) ?? []), event]);
    }

    return grouped;
  }

  private render(): void {
    const { locale, firstDayOfWeek } = this.options;
    const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
    const days = buildMonthGrid(this.year, this.monthIndex, firstDayOfWeek);
    const byDate = this.eventsByDate();
    const today = new Date();
    const focusKey = formatIsoDate(this.focusedDate);
    const focusInGrid = days.some((day) => formatIsoDate(day) === focusKey);

    this.title.textContent = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(new Date(this.year, this.monthIndex, 1));

    const rows: HTMLElement[] = [];
    for (let start = 0; start < days.length; start += DAYS_IN_WEEK) {
      const row = document.createElement("tr");
      for (const day of days.slice(start, start + DAYS_IN_WEEK)) {
        const key = formatIsoDate(day);
        const tabStop = focusInGrid
          ? key === focusKey
          : day.getDate() === 1 && day.getMonth() === this.monthIndex;
        row.append(
          this.createDayCell(
            day,
            key,
            fullDate.format(day),
            tabStop,
            isSameDay(day, today),
            byDate.get(key) ?? [],
          ),
        );
      }
      rows.push(row);
    }
    this.body.replaceChildren(...rows);
  }

  private createDayCell(
    day: Date,
    key: string,
    label: string,
    tabStop: boolean,
    isToday: boolean,
    events: CalendarEvent[],
  ): HTMLTableCellElement {
    const cell = document.createElement("td");
    cell.setAttribute("role", "gridcell");
    cell.dataset.date = key;
    if (day.getMonth() !== this.monthIndex) cell.classList.add("az-calendar-cell-outside");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-calendar-day";
    if (isToday) button.classList.add("az-calendar-day-today");
    button.textContent = String(day.getDate());
    button.setAttribute("aria-label", label);
    button.tabIndex = tabStop ? 0 : -1;

    const list = document.createElement("ul");
    list.className = "az-calendar-events";
    const { maxEventsPerDay, labels } = this.options;
    for (const event of events.slice(0, maxEventsPerDay)) list.append(this.createEventItem(event));
    if (events.length > maxEventsPerDay) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "az-calendar-more";
      more.textContent = labels.more.replace("{count}", String(events.length - maxEventsPerDay));
      const item = document.createElement("li");
      item.append(more);
      list.append(item);
    }

    cell.append(button, list);

    return cell;
  }

  private createEventItem(event: CalendarEvent): HTMLLIElement {
    const variant = VARIANTS.find((value) => value === event.variant) ?? "default";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `az-calendar-event az-calendar-event-${variant}`;
    button.dataset.eventId = event.id;
    button.textContent = event.title;
    button.title = event.title;

    const item = document.createElement("li");
    item.append(button);

    return item;
  }

  private shiftMonth(delta: number): void {
    const target = addMonths(new Date(this.year, this.monthIndex, 1), delta);
    this.focusedDate = addMonths(this.focusedDate, delta);
    this.showMonth(target.getFullYear(), target.getMonth());
  }

  private showMonth(year: number, month: number): void {
    const changed = year !== this.year || month !== this.monthIndex;
    this.year = year;
    this.monthIndex = month;
    if (this.focusedDate.getFullYear() !== year || this.focusedDate.getMonth() !== month) {
      this.focusedDate = new Date(year, month, 1);
    }
    this.render();
    if (changed) this.emit("navigate", { detail: { year, month } });
  }

  private selectDate(key: string): void {
    const date = parseIsoDate(key);
    if (date) this.focusedDate = date;
    this.emit("select", { detail: { date: key } });
  }

  private moveFocus(date: Date): void {
    this.focusedDate = date;
    if (date.getFullYear() !== this.year || date.getMonth() !== this.monthIndex) {
      this.showMonth(date.getFullYear(), date.getMonth());
    } else {
      this.render();
    }
    this.element
      .querySelector<HTMLElement>(`[data-date="${formatIsoDate(date)}"] .az-calendar-day`)
      ?.focus();
  }

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const action = event.target.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (action === "previous") this.previous();
    else if (action === "next") this.next();
    else if (action === "today") this.today();
    if (action) return;

    const cell = event.target.closest<HTMLElement>("td[data-date]");
    const eventButton = event.target.closest<HTMLElement>(".az-calendar-event");
    if (eventButton) {
      const found = this.events.find((candidate) => candidate.id === eventButton.dataset.eventId);
      if (found) this.emit("eventclick", { detail: { event: { ...found } } });
    } else if (cell?.dataset.date) {
      this.selectDate(cell.dataset.date);
    }
  }

  private handleKey(event: KeyboardEvent): void {
    const button = event.target;
    if (!(button instanceof HTMLElement) || !button.classList.contains("az-calendar-day")) return;

    const key = button.closest<HTMLElement>("td[data-date]")?.dataset.date ?? "";
    const date = parseIsoDate(key);
    if (!date) return;

    const weekStart = (date.getDay() - this.options.firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
    const targets: Record<string, Date> = {
      ArrowLeft: addDays(date, -1),
      ArrowRight: addDays(date, 1),
      ArrowUp: addDays(date, -DAYS_IN_WEEK),
      ArrowDown: addDays(date, DAYS_IN_WEEK),
      PageUp: addMonths(date, -1),
      PageDown: addMonths(date, 1),
      Home: addDays(date, -weekStart),
      End: addDays(date, DAYS_IN_WEEK - 1 - weekStart),
    };

    const target = targets[event.key];
    if (target) {
      event.preventDefault();
      this.moveFocus(target);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectDate(key);
    }
  }
}
