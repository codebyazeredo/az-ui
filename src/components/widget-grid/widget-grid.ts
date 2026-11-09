import { Component } from "../../javascript/core/component";
import { startPointerDrag } from "../../javascript/dom/pointer-drag";
import { Sortable } from "../sortable";

export interface WidgetLayoutItem {
  id: string;
  span: number;
}

export interface WidgetGridLabels {
  resize: string;
}

export interface WidgetGridOptions {
  columns?: number;
  labels?: Partial<WidgetGridLabels>;
}

const WIDGET_SELECTOR = ".az-widget";
const HANDLE_CLASS = "az-widget-resize";
const DEFAULT_COLUMNS = 4;
const DEFAULT_LABELS: WidgetGridLabels = { resize: "Resize {widget}" };

export class WidgetGrid extends Component<WidgetGridOptions> {
  private readonly columns: number;
  private readonly labels: WidgetGridLabels;
  private readonly sortable: Sortable;

  constructor(target: string | HTMLElement, options: WidgetGridOptions = {}) {
    super("widgetgrid", target, options);

    this.columns = options.columns ?? (Number(this.element.dataset.azColumns) || DEFAULT_COLUMNS);
    this.labels = { ...DEFAULT_LABELS, ...options.labels };
    this.validate();

    this.element.style.setProperty("--az-widget-columns", String(this.columns));
    for (const widget of this.widgets()) {
      this.setSpan(widget, Number(widget.dataset.azSpan) || 1);
      this.addHandle(widget);
    }

    this.sortable = new Sortable(this.element, { items: WIDGET_SELECTOR, direction: "grid" });
    this.element.addEventListener("az:sortable:drop", this.handleDrop);
    this.track(() => this.element.removeEventListener("az:sortable:drop", this.handleDrop));
  }

  get layout(): WidgetLayoutItem[] {
    return this.widgets().map((widget) => ({
      id: widget.dataset.azWidget ?? "",
      span: this.spanOf(widget),
    }));
  }

  setLayout(layout: WidgetLayoutItem[]): void {
    const widgets = this.widgets();
    const ordered: HTMLElement[] = [];

    for (const item of layout) {
      const widget = widgets.find((candidate) => candidate.dataset.azWidget === item.id);
      if (!widget || ordered.includes(widget)) continue;

      this.setSpan(widget, item.span);
      ordered.push(widget);
    }
    const remaining = widgets.filter((widget) => !ordered.includes(widget));
    this.element.append(...ordered, ...remaining);
  }

  resize(id: string, span: number): void {
    const widget = this.widgets().find((candidate) => candidate.dataset.azWidget === id);
    if (!widget) return;

    const before = this.spanOf(widget);
    this.setSpan(widget, span);
    if (this.spanOf(widget) !== before) this.emit("change", { detail: { layout: this.layout } });
  }

  override destroy(): void {
    this.sortable.destroy();
    this.element.style.removeProperty("--az-widget-columns");
    for (const handle of this.element.querySelectorAll(`.${HANDLE_CLASS}`)) handle.remove();
    for (const widget of this.widgets()) widget.style.removeProperty("--az-widget-span");
    super.destroy();
  }

  private validate(): void {
    const widgets = this.widgets();
    const fail = (message: string): never => {
      super.destroy();
      throw new Error(`AZUI: ${message}`);
    };

    if (!Number.isInteger(this.columns) || this.columns < 1) {
      fail("widget grid columns must be a whole number of 1 or more.");
    }
    if (widgets.length === 0) fail("widget grid requires at least one .az-widget.");
    if (widgets.some((widget) => !widget.dataset.azWidget)) {
      fail("every .az-widget needs a data-az-widget id.");
    }
  }

  private widgets(): HTMLElement[] {
    return [...this.element.children].filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.matches(WIDGET_SELECTOR),
    );
  }

  private spanOf(widget: HTMLElement): number {
    return Number(widget.dataset.azSpan) || 1;
  }

  private clampSpan(span: number): number {
    return Math.min(this.columns, Math.max(1, Math.round(span)));
  }

  private setSpan(widget: HTMLElement, span: number): void {
    const next = this.clampSpan(span);
    widget.dataset.azSpan = String(next);
    widget.style.setProperty("--az-widget-span", String(next));
    widget.querySelector(`.${HANDLE_CLASS}`)?.setAttribute("aria-valuenow", String(next));
  }

  private isRtl(): boolean {
    return this.element.closest("[dir]")?.getAttribute("dir") === "rtl";
  }

  private addHandle(widget: HTMLElement): void {
    const title = widget.dataset.azTitle ?? widget.dataset.azWidget ?? "";
    const handle = document.createElement("span");
    handle.className = HANDLE_CLASS;
    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-orientation", "vertical");
    handle.setAttribute("aria-valuemin", "1");
    handle.setAttribute("aria-valuemax", String(this.columns));
    handle.setAttribute("aria-valuenow", String(this.spanOf(widget)));
    handle.setAttribute("aria-label", this.labels.resize.replace("{widget}", title));
    handle.tabIndex = 0;
    widget.append(handle);

    this.listen(handle, "pointerdown", (event) => this.startResize(event, widget, handle));
    this.listen(handle, "keydown", (event) => this.handleHandleKey(event, widget));
  }

  private startResize(event: PointerEvent, widget: HTMLElement, handle: HTMLElement): void {
    const startSpan = this.spanOf(widget);
    const columnWidth = this.element.getBoundingClientRect().width / this.columns;
    const direction = this.isRtl() ? -1 : 1;
    if (columnWidth <= 0) return;

    startPointerDrag(handle, event, {
      move: (dx) => this.setSpan(widget, startSpan + Math.round((dx * direction) / columnWidth)),
      end: () => {
        if (this.spanOf(widget) !== startSpan)
          this.emit("change", { detail: { layout: this.layout } });
      },
      cancel: () => this.setSpan(widget, startSpan),
    });
  }

  private handleHandleKey(event: KeyboardEvent, widget: HTMLElement): void {
    const id = widget.dataset.azWidget ?? "";
    const span = this.spanOf(widget);
    const growKey = this.isRtl() ? "ArrowLeft" : "ArrowRight";
    const shrinkKey = this.isRtl() ? "ArrowRight" : "ArrowLeft";

    if (event.key === growKey) this.resize(id, span + 1);
    else if (event.key === shrinkKey) this.resize(id, span - 1);
    else if (event.key === "Home") this.resize(id, 1);
    else if (event.key === "End") this.resize(id, this.columns);
    else return;

    event.preventDefault();
  }

  private readonly handleDrop = (event: Event): void => {
    queueMicrotask(() => {
      if (!event.defaultPrevented) this.emit("change", { detail: { layout: this.layout } });
    });
  };
}
