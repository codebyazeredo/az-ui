import { Component } from "../../javascript/core/component";
import { startPointerDrag } from "../../javascript/dom/pointer-drag";
import { uniqueId } from "../../javascript/dom/unique-id";
import { addDays, diffInDays, formatIsoDate, parseIsoDate } from "../datepicker/calendar";

export type GanttZoom = "day" | "week";
export type GanttVariant = "default" | "success" | "warning" | "danger" | "info";

export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress?: number;
  dependsOn?: string[];
  variant?: GanttVariant;
}

export interface GanttLabels {
  task: string;
  start: string;
  end: string;
  moved: string;
}

export interface GanttOptions {
  tasks: GanttTask[];
  zoom?: GanttZoom;
  dayWidth?: number;
  rowHeight?: number;
  locale?: string;
  labels?: Partial<GanttLabels>;
}

interface ResolvedOptions {
  tasks: GanttTask[];
  zoom: GanttZoom;
  dayWidth: number | undefined;
  rowHeight: number;
  locale: string;
  labels: GanttLabels;
}

interface Range {
  start: Date;
  days: number;
}

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const DEFAULT_LABELS: GanttLabels = {
  task: "Task",
  start: "Start",
  end: "End",
  moved: "{name} now runs from {start} to {end}",
};
const VARIANTS: GanttVariant[] = ["default", "success", "warning", "danger", "info"];
const DEFAULT_DAY_WIDTH: Record<GanttZoom, number> = { day: 32, week: 12 };
const DAYS_IN_WEEK = 7;
const PADDING_DAYS = 2;
const HEADER_HEIGHT = 48;
const DRAG_THRESHOLD = 3;
const LINK_GAP = 8;
const BAR_CLASS = "az-gantt-bar";

function fail(message: string): never {
  throw new Error(`AZUI: ${message}`);
}

function validate(tasks: GanttTask[], zoom: GanttZoom): void {
  if (zoom !== "day" && zoom !== "week")
    fail(`gantt zoom "${String(zoom)}" must be "day" or "week".`);

  const ids = new Set<string>();
  for (const task of tasks) {
    const start = parseIsoDate(task.start);
    const end = parseIsoDate(task.end);
    if (ids.has(task.id)) fail(`gantt task "${task.id}" is duplicated.`);
    ids.add(task.id);
    if (!start || !end)
      fail(`gantt task "${task.id}" has an invalid start or end (expected YYYY-MM-DD).`);
    if (end < start) fail(`gantt task "${task.id}" ends before it starts.`);
    if (task.progress !== undefined && !(task.progress >= 0 && task.progress <= 100)) {
      fail(`gantt task "${task.id}" progress must be from 0 to 100.`);
    }
  }
}

function resolveOptions(options: GanttOptions): ResolvedOptions {
  const zoom = options.zoom ?? "day";
  const tasks = options.tasks.map((task) => ({ ...task }));
  validate(tasks, zoom);

  return {
    tasks,
    zoom,
    dayWidth: options.dayWidth,
    rowHeight: options.rowHeight ?? 40,
    locale: options.locale ?? (document.documentElement.lang || "en"),
    labels: { ...DEFAULT_LABELS, ...options.labels },
  };
}

export class Gantt extends Component<ResolvedOptions> {
  private taskList: GanttTask[];
  private bounds: { start: Date; end: Date } | null = null;
  private zoomLevel: GanttZoom;
  private readonly status = document.createElement("div");
  private readonly addedClass: boolean;
  private readonly markerId = uniqueId("az-gantt-arrow");
  private suppressClick = false;

  constructor(target: string | HTMLElement, options: GanttOptions) {
    super("gantt", target, resolveOptions(options));

    this.taskList = this.options.tasks;
    this.zoomLevel = this.options.zoom;
    this.addedClass = !this.element.classList.contains("az-gantt");
    this.element.classList.add("az-gantt");
    this.status.className = "az-gantt-status";
    this.status.setAttribute("role", "status");
    this.status.setAttribute("aria-live", "polite");

    this.render();
    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.listen(this.element, "keydown", (event) => this.handleKey(event));
    this.listen(this.element, "pointerdown", (event) => this.handlePointerDown(event));
  }

  get tasks(): GanttTask[] {
    return this.taskList.map((task) => ({
      ...task,
      dependsOn: task.dependsOn && [...task.dependsOn],
    }));
  }

  setTasks(tasks: GanttTask[]): void {
    const next = tasks.map((task) => ({ ...task }));
    validate(next, this.zoomLevel);
    this.taskList = next;
    this.bounds = null;
    this.render();
  }

  setZoom(zoom: GanttZoom): void {
    validate(this.taskList, zoom);
    this.zoomLevel = zoom;
    this.render();
  }

  scrollToToday(): void {
    const line = this.element.querySelector<HTMLElement>(".az-gantt-today");
    const scroll = this.element.querySelector<HTMLElement>(".az-gantt-scroll");
    if (!line || !scroll) return;

    const offset = line.getBoundingClientRect().left - scroll.getBoundingClientRect().left;
    scroll.scrollLeft = Math.max(0, scroll.scrollLeft + offset - scroll.clientWidth / 2);
  }

  override destroy(): void {
    this.element.replaceChildren();
    for (const name of ["day-width", "row-height", "days", "header-height"]) {
      this.element.style.removeProperty(`--az-gantt-${name}`);
    }
    if (this.addedClass) this.element.classList.remove("az-gantt");
    super.destroy();
  }

  private dayWidth(): number {
    return this.options.dayWidth ?? DEFAULT_DAY_WIDTH[this.zoomLevel];
  }

  private range(): Range {
    const dates = this.taskList.flatMap((task) => {
      const start = parseIsoDate(task.start);
      const end = parseIsoDate(task.end);

      return start && end ? [start, end] : [];
    });
    if (dates.length === 0) {
      const today = new Date();

      return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), days: 28 };
    }

    const first = new Date(Math.min(...dates.map((date) => date.getTime())));
    const last = new Date(Math.max(...dates.map((date) => date.getTime())));
    const start = addDays(first, -PADDING_DAYS);
    const end = addDays(last, PADDING_DAYS);
    const bounds = this.bounds
      ? {
          start: new Date(Math.min(start.getTime(), this.bounds.start.getTime())),
          end: new Date(Math.max(end.getTime(), this.bounds.end.getTime())),
        }
      : { start, end };
    this.bounds = bounds;

    return { start: bounds.start, days: diffInDays(bounds.start, bounds.end) + 1 };
  }

  private dateOf(text: string): Date {
    return parseIsoDate(text) ?? new Date();
  }

  private render(): void {
    const range = this.range();
    const dayWidth = this.dayWidth();
    const { rowHeight } = this.options;
    this.element.style.setProperty("--az-gantt-day-width", `${dayWidth}px`);
    this.element.style.setProperty("--az-gantt-row-height", `${rowHeight}px`);
    this.element.style.setProperty("--az-gantt-days", String(range.days));
    this.element.style.setProperty("--az-gantt-header-height", `${HEADER_HEIGHT}px`);

    const grid = document.createElement("div");
    grid.className = "az-gantt-grid";
    grid.setAttribute("role", "grid");
    grid.append(
      this.createHeader(range),
      ...this.taskList.map((task) => this.createRow(task, range)),
      this.createOverlay(range),
    );

    const scroll = document.createElement("div");
    scroll.className = "az-gantt-scroll";
    scroll.append(grid);
    this.element.replaceChildren(scroll, this.status);
  }

  private createHeader(range: Range): HTMLElement {
    const { labels, locale } = this.options;
    const dayWidth = this.dayWidth();
    const header = document.createElement("div");
    header.className = "az-gantt-header";
    header.setAttribute("role", "row");

    const corner = document.createElement("div");
    corner.className = "az-gantt-corner";
    corner.setAttribute("role", "columnheader");
    for (const text of [labels.task, labels.start, labels.end]) {
      const cell = document.createElement("span");
      cell.textContent = text;
      corner.append(cell);
    }

    const months = document.createElement("div");
    months.className = "az-gantt-months";
    const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    let segment: HTMLElement | null = null;
    let segmentKey = "";
    for (let index = 0; index < range.days; index += 1) {
      const day = addDays(range.start, index);
      const key = `${day.getFullYear()}-${day.getMonth()}`;
      if (key !== segmentKey || !segment) {
        segment = document.createElement("span");
        segment.className = "az-gantt-month";
        segment.textContent = monthName.format(day);
        segment.style.width = "0px";
        months.append(segment);
        segmentKey = key;
      }
      segment.style.width = `${Number.parseFloat(segment.style.width) + dayWidth}px`;
    }

    const days = document.createElement("div");
    days.className = "az-gantt-days";
    const step = this.zoomLevel === "week" ? DAYS_IN_WEEK : 1;
    const shortDate = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
    for (let index = 0; index < range.days; index += step) {
      const day = addDays(range.start, index);
      const cell = document.createElement("span");
      cell.className = "az-gantt-day";
      cell.style.width = `${Math.min(step, range.days - index) * dayWidth}px`;
      cell.textContent = this.zoomLevel === "week" ? shortDate.format(day) : String(day.getDate());
      days.append(cell);
    }

    const timeline = document.createElement("div");
    timeline.className = "az-gantt-timeline";
    timeline.append(months, days);
    header.append(corner, timeline);

    return header;
  }

  private createRow(task: GanttTask, range: Range): HTMLElement {
    const row = document.createElement("div");
    row.className = "az-gantt-row";
    row.setAttribute("role", "row");

    const name = document.createElement("div");
    name.className = "az-gantt-name";
    name.setAttribute("role", "rowheader");
    for (const [className, text] of [
      ["az-gantt-task-name", task.name],
      ["az-gantt-date", task.start],
      ["az-gantt-date", task.end],
    ] as const) {
      const cell = document.createElement("span");
      cell.className = className;
      cell.textContent = text;
      name.append(cell);
    }

    const track = document.createElement("div");
    track.className = "az-gantt-track";
    track.setAttribute("role", "gridcell");
    track.append(this.createBar(task, range));
    row.append(name, track);

    return row;
  }

  private createBar(task: GanttTask, range: Range): HTMLButtonElement {
    const dayWidth = this.dayWidth();
    const start = this.dateOf(task.start);
    const end = this.dateOf(task.end);
    const variant = VARIANTS.find((value) => value === task.variant) ?? "default";

    const bar = document.createElement("button");
    bar.type = "button";
    bar.className = `${BAR_CLASS} ${BAR_CLASS}-${variant}`;
    bar.dataset.taskId = task.id;
    bar.style.left = `${diffInDays(range.start, start) * dayWidth}px`;
    bar.style.width = `${(diffInDays(start, end) + 1) * dayWidth}px`;
    const progress = task.progress ?? 0;
    bar.setAttribute(
      "aria-label",
      `${task.name}, ${task.start} to ${task.end}, ${progress}% complete`,
    );

    const fill = document.createElement("span");
    fill.className = "az-gantt-progress";
    fill.style.width = `${progress}%`;

    bar.append(fill);
    for (const side of ["start", "end"]) {
      const handle = document.createElement("span");
      handle.className = `az-gantt-handle az-gantt-handle-${side}`;
      handle.dataset.side = side;
      handle.setAttribute("aria-hidden", "true");
      bar.append(handle);
    }

    return bar;
  }

  private createOverlay(range: Range): HTMLElement {
    const dayWidth = this.dayWidth();
    const overlay = document.createElement("div");
    overlay.className = "az-gantt-overlay";
    overlay.append(this.createLinks(range));

    const today = new Date();
    const offset = diffInDays(range.start, today);
    if (offset >= 0 && offset < range.days) {
      const line = document.createElement("div");
      line.className = "az-gantt-today";
      line.style.left = `${(offset + 0.5) * dayWidth}px`;
      overlay.append(line);
    }

    return overlay;
  }

  private createLinks(range: Range): SVGElement {
    const dayWidth = this.dayWidth();
    const { rowHeight } = this.options;
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("class", "az-gantt-links");
    svg.setAttribute("width", String(range.days * dayWidth));
    svg.setAttribute("height", String(this.taskList.length * rowHeight));
    svg.setAttribute("aria-hidden", "true");

    const marker = document.createElementNS(SVG_NAMESPACE, "marker");
    marker.setAttribute("id", this.markerId);
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS(SVG_NAMESPACE, "path");
    arrow.setAttribute("d", "M0,0 L6,3 L0,6 Z");
    arrow.setAttribute("fill", "currentColor");
    marker.append(arrow);
    const defs = document.createElementNS(SVG_NAMESPACE, "defs");
    defs.append(marker);
    svg.append(defs);

    this.taskList.forEach((task, targetIndex) => {
      for (const sourceId of task.dependsOn ?? []) {
        const sourceIndex = this.taskList.findIndex((candidate) => candidate.id === sourceId);
        const source = this.taskList[sourceIndex];
        if (!source) continue;

        const path = document.createElementNS(SVG_NAMESPACE, "path");
        path.setAttribute("class", "az-gantt-link");
        path.setAttribute("marker-end", `url(#${this.markerId})`);
        path.setAttribute("d", this.linkPath(source, task, sourceIndex, targetIndex, range));
        svg.append(path);
      }
    });

    return svg;
  }

  private linkPath(
    source: GanttTask,
    target: GanttTask,
    sourceIndex: number,
    targetIndex: number,
    range: Range,
  ): string {
    const dayWidth = this.dayWidth();
    const { rowHeight } = this.options;
    const fromX = (diffInDays(range.start, this.dateOf(source.end)) + 1) * dayWidth;
    const toX = diffInDays(range.start, this.dateOf(target.start)) * dayWidth;
    const fromY = sourceIndex * rowHeight + rowHeight / 2;
    const toY = targetIndex * rowHeight + rowHeight / 2;

    if (toX - fromX >= LINK_GAP * 2) {
      return `M${fromX},${fromY} H${fromX + LINK_GAP} V${toY} H${toX}`;
    }
    const middleY = (fromY + toY) / 2;

    return `M${fromX},${fromY} H${fromX + LINK_GAP} V${middleY} H${toX - LINK_GAP} V${toY} H${toX}`;
  }

  private findTask(id: string | undefined): GanttTask | undefined {
    return this.taskList.find((task) => task.id === id);
  }

  private taskAt(target: EventTarget | null): { bar: HTMLElement; task: GanttTask } | null {
    const bar = target instanceof Element ? target.closest<HTMLElement>(`.${BAR_CLASS}`) : null;
    const task = this.findTask(bar?.dataset.taskId);

    return bar && task ? { bar, task } : null;
  }

  private change(
    kind: "move" | "resize",
    task: GanttTask,
    proposal: { start: Date; end: Date },
  ): boolean {
    if (proposal.end < proposal.start) return false;

    const start = formatIsoDate(proposal.start);
    const end = formatIsoDate(proposal.end);
    if (start === task.start && end === task.end) return false;

    if (!this.emit(kind, { cancelable: true, detail: { task: { ...task }, start, end } })) {
      return false;
    }

    task.start = start;
    task.end = end;
    this.render();
    this.status.textContent = this.options.labels.moved
      .replace("{name}", task.name)
      .replace("{start}", start)
      .replace("{end}", end);
    this.element.querySelector<HTMLElement>(`[data-task-id="${task.id}"]`)?.focus();

    return true;
  }

  private moveBy(task: GanttTask, days: number): boolean {
    return this.change("move", task, {
      start: addDays(this.dateOf(task.start), days),
      end: addDays(this.dateOf(task.end), days),
    });
  }

  private resizeEndBy(task: GanttTask, days: number): boolean {
    const start = this.dateOf(task.start);
    const wanted = addDays(this.dateOf(task.end), days);

    return this.change("resize", task, { start, end: wanted < start ? start : wanted });
  }

  private resizeStartBy(task: GanttTask, days: number): boolean {
    const end = this.dateOf(task.end);
    const wanted = addDays(this.dateOf(task.start), days);

    return this.change("resize", task, { start: wanted > end ? end : wanted, end });
  }

  private daysOf(offset: number): number {
    return Math.round(offset / this.dayWidth());
  }

  private handleClick(event: MouseEvent): void {
    if (this.suppressClick) return;

    const hit = this.taskAt(event.target);
    if (hit) this.emit("select", { detail: { task: { ...hit.task } } });
  }

  private handleKey(event: KeyboardEvent): void {
    const hit = this.taskAt(event.target);
    if (!hit || event.target !== hit.bar) return;

    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (event.key === "Enter") {
      event.preventDefault();
      this.emit("select", { detail: { task: { ...hit.task } } });
    } else if (direction !== 0) {
      event.preventDefault();
      if (event.shiftKey) this.resizeEndBy(hit.task, direction);
      else this.moveBy(hit.task, direction);
    }
  }

  private handlePointerDown(event: PointerEvent): void {
    const hit = this.taskAt(event.target);
    if (!hit || event.button !== 0) return;

    const side = event.target instanceof HTMLElement ? event.target.dataset.side : undefined;
    const { bar, task } = hit;
    const dayWidth = this.dayWidth();
    const baseLeft = bar.offsetLeft;
    const baseWidth = bar.offsetWidth;

    startPointerDrag(bar, event, {
      move: (dx, dy) => {
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)
          this.suppressClick = true;
        const days = this.daysOf(dx);
        if (side === "end")
          bar.style.width = `${Math.max(dayWidth, baseWidth + days * dayWidth)}px`;
        else if (side === "start") {
          bar.style.left = `${baseLeft + days * dayWidth}px`;
          bar.style.width = `${Math.max(dayWidth, baseWidth - days * dayWidth)}px`;
        } else bar.style.left = `${baseLeft + days * dayWidth}px`;
      },
      end: (dx, dy) => {
        if (Math.abs(dx) <= DRAG_THRESHOLD && Math.abs(dy) <= DRAG_THRESHOLD) {
          this.suppressClick = false;
          return;
        }

        const days = this.daysOf(dx);
        let applied: boolean;
        if (side === "end") applied = this.resizeEndBy(task, days);
        else if (side === "start") applied = this.resizeStartBy(task, days);
        else applied = this.moveBy(task, days);
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
