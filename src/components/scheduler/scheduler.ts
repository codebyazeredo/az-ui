import { Component } from "../../javascript/core/component";
import { startPointerDrag } from "../../javascript/dom/pointer-drag";
import { parseIsoDate } from "../datepicker/calendar";
import { addMinutes, formatDateTime, minutesBetween, parseDateTime } from "./time";

export type SchedulerVariant = "default" | "success" | "warning" | "danger" | "info";

export interface SchedulerResource {
  id: string;
  label: string;
}

export interface SchedulerEvent {
  id: string;
  resource: string;
  start: string;
  end: string;
  title: string;
  variant?: SchedulerVariant;
}

export interface SchedulerLabels {
  moved: string;
  resized: string;
}

export interface SchedulerOptions {
  resources: SchedulerResource[];
  events?: SchedulerEvent[];
  date: string;
  startHour?: number;
  endHour?: number;
  slotMinutes?: number;
  slotWidth?: number;
  allowOverlap?: boolean;
  labels?: Partial<SchedulerLabels>;
}

interface ResolvedOptions {
  resources: SchedulerResource[];
  events: SchedulerEvent[];
  date: string;
  startHour: number;
  endHour: number;
  slotMinutes: number;
  slotWidth: number;
  allowOverlap: boolean;
  labels: SchedulerLabels;
}

interface Proposal {
  resource: string;
  start: Date;
  end: Date;
}

const DEFAULT_LABELS: SchedulerLabels = {
  moved: "{title} moved to {resource}, {start} to {end}",
  resized: "{title} now ends at {end}",
};
const VARIANTS: SchedulerVariant[] = ["default", "success", "warning", "danger", "info"];
const MINUTES_PER_HOUR = 60;
const DRAG_THRESHOLD = 3;
const EVENT_CLASS = "az-scheduler-event";
const RESIZE_CLASS = "az-scheduler-resize";

function fail(message: string): never {
  throw new Error(`AZUI: ${message}`);
}

function validate(options: ResolvedOptions): void {
  const { date, startHour, endHour, slotMinutes, resources, events } = options;

  if (!parseIsoDate(date)) fail(`scheduler date "${date}" is not valid (expected YYYY-MM-DD).`);
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour) || startHour < 0 || endHour > 24) {
    fail("scheduler startHour and endHour must be whole hours from 0 to 24.");
  }
  if (endHour <= startHour) fail("scheduler endHour must be greater than startHour.");
  if (!Number.isInteger(slotMinutes) || slotMinutes < 1 || MINUTES_PER_HOUR % slotMinutes !== 0) {
    fail("scheduler slotMinutes must be a whole number of minutes that divides 60.");
  }

  const resourceIds = new Set(resources.map((resource) => resource.id));
  const eventIds = new Set<string>();
  for (const event of events) {
    const start = parseDateTime(event.start);
    const end = parseDateTime(event.end);
    if (eventIds.has(event.id)) fail(`scheduler event "${event.id}" is duplicated.`);
    eventIds.add(event.id);
    if (!start || !end) fail(`scheduler event "${event.id}" has an invalid start or end.`);
    if (end <= start) fail(`scheduler event "${event.id}" must end after it starts.`);
    if (!resourceIds.has(event.resource)) {
      fail(`scheduler event "${event.id}" uses the unknown resource "${event.resource}".`);
    }
  }
}

function resolveOptions(options: SchedulerOptions): ResolvedOptions {
  const resolved: ResolvedOptions = {
    resources: options.resources.map((resource) => ({ ...resource })),
    events: (options.events ?? []).map((event) => ({ ...event })),
    date: options.date,
    startHour: options.startHour ?? 6,
    endHour: options.endHour ?? 20,
    slotMinutes: options.slotMinutes ?? 30,
    slotWidth: options.slotWidth ?? 48,
    allowOverlap: options.allowOverlap ?? false,
    labels: { ...DEFAULT_LABELS, ...options.labels },
  };
  validate(resolved);

  return resolved;
}

export class Scheduler extends Component<ResolvedOptions> {
  private resources: SchedulerResource[];
  private eventList: SchedulerEvent[];
  private date: string;
  private readonly status = document.createElement("div");
  private readonly addedClass: boolean;
  private suppressClick = false;

  constructor(target: string | HTMLElement, options: SchedulerOptions) {
    super("scheduler", target, resolveOptions(options));

    this.resources = this.options.resources;
    this.eventList = this.options.events;
    this.date = this.options.date;
    this.addedClass = !this.element.classList.contains("az-scheduler");
    this.element.classList.add("az-scheduler");
    this.status.className = "az-scheduler-status";
    this.status.setAttribute("role", "status");
    this.status.setAttribute("aria-live", "polite");

    this.render();
    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.listen(this.element, "keydown", (event) => this.handleKey(event));
    this.listen(this.element, "pointerdown", (event) => this.handlePointerDown(event));
  }

  get events(): SchedulerEvent[] {
    return this.eventList.map((event) => ({ ...event }));
  }

  setEvents(events: SchedulerEvent[]): void {
    const next = events.map((event) => ({ ...event }));
    validate({ ...this.options, resources: this.resources, events: next, date: this.date });
    this.eventList = next;
    this.render();
  }

  setResources(resources: SchedulerResource[]): void {
    const next = resources.map((resource) => ({ ...resource }));
    validate({ ...this.options, resources: next, events: this.eventList, date: this.date });
    this.resources = next;
    this.render();
  }

  setDate(date: string): void {
    validate({ ...this.options, resources: this.resources, events: this.eventList, date });
    this.date = date;
    this.render();
  }

  override destroy(): void {
    this.element.replaceChildren();
    this.element.style.removeProperty("--az-scheduler-slot-width");
    this.element.style.removeProperty("--az-scheduler-slots");
    if (this.addedClass) this.element.classList.remove("az-scheduler");
    super.destroy();
  }

  private windowStart(): Date {
    const day = parseIsoDate(this.date) ?? new Date();

    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), this.options.startHour);
  }

  private windowEnd(): Date {
    const start = this.windowStart();

    return new Date(start.getFullYear(), start.getMonth(), start.getDate(), this.options.endHour);
  }

  private slotCount(): number {
    const { startHour, endHour, slotMinutes } = this.options;

    return ((endHour - startHour) * MINUTES_PER_HOUR) / slotMinutes;
  }

  private labelOf(resourceId: string): string {
    return this.resources.find((resource) => resource.id === resourceId)?.label ?? resourceId;
  }

  private timeText(date: Date): string {
    return formatDateTime(date).slice(11);
  }

  private render(): void {
    const { slotWidth } = this.options;
    this.element.style.setProperty("--az-scheduler-slot-width", `${slotWidth}px`);
    this.element.style.setProperty("--az-scheduler-slots", String(this.slotCount()));

    const scroll = document.createElement("div");
    scroll.className = "az-scheduler-scroll";
    scroll.setAttribute("role", "grid");
    scroll.append(
      this.createHeader(),
      ...this.resources.map((resource) => this.createRow(resource)),
    );
    this.element.replaceChildren(scroll, this.status);
  }

  private createHeader(): HTMLElement {
    const { startHour, endHour, slotMinutes, slotWidth } = this.options;
    const header = document.createElement("div");
    header.className = "az-scheduler-header";
    header.setAttribute("role", "row");

    const corner = document.createElement("div");
    corner.className = "az-scheduler-corner";
    corner.setAttribute("role", "columnheader");

    const times = document.createElement("div");
    times.className = "az-scheduler-times";
    for (let hour = startHour; hour < endHour; hour += 1) {
      const cell = document.createElement("span");
      cell.className = "az-scheduler-hour";
      cell.style.width = `${(MINUTES_PER_HOUR / slotMinutes) * slotWidth}px`;
      cell.textContent = `${String(hour).padStart(2, "0")}:00`;
      times.append(cell);
    }
    header.append(corner, times);

    return header;
  }

  private createRow(resource: SchedulerResource): HTMLElement {
    const row = document.createElement("div");
    row.className = "az-scheduler-row";
    row.setAttribute("role", "row");

    const label = document.createElement("div");
    label.className = "az-scheduler-label";
    label.setAttribute("role", "rowheader");
    label.textContent = resource.label;

    const lane = document.createElement("div");
    lane.className = "az-scheduler-lane";
    lane.setAttribute("role", "gridcell");
    lane.dataset.resource = resource.id;
    for (const event of this.eventList) {
      if (event.resource !== resource.id) continue;

      const block = this.createEventBlock(event);
      if (block) lane.append(block);
    }
    row.append(label, lane);

    return row;
  }

  private createEventBlock(event: SchedulerEvent): HTMLButtonElement | null {
    const { slotMinutes, slotWidth } = this.options;
    const start = parseDateTime(event.start);
    const end = parseDateTime(event.end);
    if (!start || !end) return null;

    const visibleStart = new Date(Math.max(start.getTime(), this.windowStart().getTime()));
    const visibleEnd = new Date(Math.min(end.getTime(), this.windowEnd().getTime()));
    if (visibleEnd <= visibleStart) return null;

    const variant = VARIANTS.find((value) => value === event.variant) ?? "default";
    const block = document.createElement("button");
    block.type = "button";
    block.className = `${EVENT_CLASS} ${EVENT_CLASS}-${variant}`;
    block.dataset.eventId = event.id;
    block.style.left = `${(minutesBetween(this.windowStart(), visibleStart) / slotMinutes) * slotWidth}px`;
    block.style.width = `${(minutesBetween(visibleStart, visibleEnd) / slotMinutes) * slotWidth}px`;
    block.setAttribute(
      "aria-label",
      `${event.title}, ${this.labelOf(event.resource)}, ${this.timeText(start)} to ${this.timeText(end)}`,
    );

    const title = document.createElement("span");
    title.className = "az-scheduler-event-title";
    title.textContent = event.title;

    const handle = document.createElement("span");
    handle.className = RESIZE_CLASS;
    handle.setAttribute("aria-hidden", "true");
    block.append(title, handle);

    return block;
  }

  private findEvent(id: string | undefined): SchedulerEvent | undefined {
    return this.eventList.find((event) => event.id === id);
  }

  private eventAt(
    target: EventTarget | null,
  ): { block: HTMLElement; event: SchedulerEvent } | null {
    const block = target instanceof Element ? target.closest<HTMLElement>(`.${EVENT_CLASS}`) : null;
    const event = this.findEvent(block?.dataset.eventId);

    return block && event ? { block, event } : null;
  }

  private overlaps(resource: string, start: Date, end: Date, ignoreId: string): boolean {
    return this.eventList.some((other) => {
      if (other.id === ignoreId || other.resource !== resource) return false;

      const otherStart = parseDateTime(other.start);
      const otherEnd = parseDateTime(other.end);

      return otherStart !== null && otherEnd !== null && start < otherEnd && otherStart < end;
    });
  }

  private fitInWindow(start: Date, end: Date): { start: Date; end: Date } | null {
    const windowStart = this.windowStart();
    const windowEnd = this.windowEnd();
    const duration = minutesBetween(start, end);
    let fittedStart = start;
    let fittedEnd = end;

    if (fittedStart < windowStart) {
      fittedStart = windowStart;
      fittedEnd = addMinutes(windowStart, duration);
    }
    if (fittedEnd > windowEnd) {
      fittedEnd = windowEnd;
      fittedStart = addMinutes(windowEnd, -duration);
    }

    return fittedStart < windowStart ? null : { start: fittedStart, end: fittedEnd };
  }

  private change(kind: "move" | "resize", event: SchedulerEvent, proposal: Proposal): boolean {
    const originalStart = parseDateTime(event.start);
    const originalEnd = parseDateTime(event.end);
    const fitted =
      kind === "resize"
        ? {
            start: proposal.start,
            end: new Date(Math.min(proposal.end.getTime(), this.windowEnd().getTime())),
          }
        : this.fitInWindow(proposal.start, proposal.end);
    if (!originalStart || !originalEnd || !fitted) return false;

    const unchanged =
      proposal.resource === event.resource &&
      fitted.start.getTime() === originalStart.getTime() &&
      fitted.end.getTime() === originalEnd.getTime();
    if (unchanged) return false;
    if (
      !this.options.allowOverlap &&
      this.overlaps(proposal.resource, fitted.start, fitted.end, event.id)
    ) {
      return false;
    }

    const detail = {
      event: { ...event },
      resource: proposal.resource,
      start: formatDateTime(fitted.start),
      end: formatDateTime(fitted.end),
    };
    if (!this.emit(kind, { cancelable: true, detail })) return false;

    event.resource = proposal.resource;
    event.start = detail.start;
    event.end = detail.end;
    this.render();
    this.announce(kind, event, fitted);
    this.element.querySelector<HTMLElement>(`[data-event-id="${event.id}"]`)?.focus();

    return true;
  }

  private announce(
    kind: "move" | "resize",
    event: SchedulerEvent,
    fitted: { start: Date; end: Date },
  ): void {
    const { labels } = this.options;
    const template = kind === "move" ? labels.moved : labels.resized;
    this.status.textContent = template
      .replace("{title}", event.title)
      .replace("{resource}", this.labelOf(event.resource))
      .replace("{start}", this.timeText(fitted.start))
      .replace("{end}", this.timeText(fitted.end));
  }

  private slotsOf(offset: number): number {
    return Math.round(offset / this.options.slotWidth);
  }

  private resourceAt(clientY: number, fallback: string): string {
    const lanes = [...this.element.querySelectorAll<HTMLElement>(".az-scheduler-lane")];
    for (const lane of lanes) {
      const rect = lane.getBoundingClientRect();
      if (clientY >= rect.top && clientY < rect.bottom) return lane.dataset.resource ?? fallback;
    }

    return fallback;
  }

  private moveBy(event: SchedulerEvent, slots: number, resource: string): boolean {
    const start = parseDateTime(event.start);
    const end = parseDateTime(event.end);
    if (!start || !end) return false;

    const minutes = slots * this.options.slotMinutes;

    return this.change("move", event, {
      resource,
      start: addMinutes(start, minutes),
      end: addMinutes(end, minutes),
    });
  }

  private resizeBy(event: SchedulerEvent, slots: number): boolean {
    const start = parseDateTime(event.start);
    const end = parseDateTime(event.end);
    if (!start || !end) return false;

    const minimum = addMinutes(start, this.options.slotMinutes);
    const wanted = addMinutes(end, slots * this.options.slotMinutes);

    return this.change("resize", event, {
      resource: event.resource,
      start,
      end: wanted < minimum ? minimum : wanted,
    });
  }

  private handleClick(event: MouseEvent): void {
    if (this.suppressClick) return;

    const hit = this.eventAt(event.target);
    if (hit) {
      this.emit("select", { detail: { event: { ...hit.event } } });
      return;
    }

    const lane = event.target instanceof HTMLElement ? event.target : null;
    if (!lane?.classList.contains("az-scheduler-lane")) return;

    const x = event.clientX - lane.getBoundingClientRect().left;
    const slot = Math.min(
      this.slotCount() - 1,
      Math.max(0, Math.floor(x / this.options.slotWidth)),
    );
    const start = addMinutes(this.windowStart(), slot * this.options.slotMinutes);
    const end = addMinutes(start, this.options.slotMinutes);
    this.emit("create", {
      detail: {
        resource: lane.dataset.resource ?? "",
        start: formatDateTime(start),
        end: formatDateTime(end),
      },
    });
  }

  private handleKey(event: KeyboardEvent): void {
    const hit = this.eventAt(event.target);
    if (!hit || event.target !== hit.block) return;

    const horizontal = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const vertical = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;

    if (event.key === "Enter") {
      event.preventDefault();
      this.emit("select", { detail: { event: { ...hit.event } } });
    } else if (horizontal !== 0) {
      event.preventDefault();
      if (event.shiftKey) this.resizeBy(hit.event, horizontal);
      else this.moveBy(hit.event, horizontal, hit.event.resource);
    } else if (vertical !== 0) {
      event.preventDefault();
      const index = this.resources.findIndex((resource) => resource.id === hit.event.resource);
      const target = this.resources[index + vertical];
      if (target) this.moveBy(hit.event, 0, target.id);
    }
  }

  private handlePointerDown(event: PointerEvent): void {
    const hit = this.eventAt(event.target);
    if (!hit || event.button !== 0) return;

    const onHandle =
      event.target instanceof Element && event.target.classList.contains(RESIZE_CLASS);
    const { block } = hit;
    const subject = hit.event;
    const { slotWidth } = this.options;
    const baseLeft = block.offsetLeft;
    const baseWidth = block.offsetWidth;

    startPointerDrag(block, event, {
      move: (dx, dy) => {
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)
          this.suppressClick = true;
        if (onHandle)
          block.style.width = `${Math.max(slotWidth, baseWidth + this.slotsOf(dx) * slotWidth)}px`;
        else block.style.left = `${baseLeft + this.slotsOf(dx) * slotWidth}px`;
      },
      end: (dx, dy, up) => {
        if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) {
          this.suppressClick = false;
          return;
        }

        const slots = this.slotsOf(dx);
        const applied = onHandle
          ? this.resizeBy(subject, slots)
          : this.moveBy(subject, slots, this.resourceAt(up.clientY, subject.resource));
        if (!applied) this.render();
        setTimeout(() => {
          this.suppressClick = false;
        }, 0);
      },
      cancel: () => {
        this.suppressClick = false;
        this.render();
      },
    });
  }
}
