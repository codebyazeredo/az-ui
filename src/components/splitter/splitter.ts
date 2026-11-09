import { Component } from "../../javascript/core/component";
import { ensureId } from "../../javascript/dom/unique-id";

const HANDLE_SELECTOR = ".az-splitter-handle";
const DEFAULT_PERCENT = 50;
const KEY_STEP = 2;
const KEY_STEP_LARGE = 10;

export class Splitter extends Component {
  private readonly handle: HTMLElement;
  private readonly first: HTMLElement;
  private readonly second: HTMLElement;
  private readonly vertical: boolean;
  private percent = DEFAULT_PERCENT;

  constructor(target: string | HTMLElement) {
    super("splitter", target, {});

    const handle = this.element.querySelector<HTMLElement>(HANDLE_SELECTOR);
    const first = handle?.previousElementSibling;
    const second = handle?.nextElementSibling;
    if (!handle || !(first instanceof HTMLElement) || !(second instanceof HTMLElement)) {
      throw new Error("AZUI: splitter requires a .az-splitter-handle between two panes.");
    }

    this.handle = handle;
    this.first = first;
    this.second = second;
    this.vertical = this.element.classList.contains("az-splitter-vertical");

    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-orientation", this.vertical ? "horizontal" : "vertical");
    handle.setAttribute("aria-controls", ensureId(first, "az-splitter-pane"));
    handle.tabIndex = 0;

    this.listen(handle, "pointerdown", (event) => this.startDrag(event));
    this.listen(handle, "keydown", (event) => this.handleKey(event));
    this.resize(this.initialPercent());
  }

  get size(): number {
    return this.percent;
  }

  resize(percent: number): void {
    const { min, max } = this.limits();
    const next = Math.max(min, Math.min(percent, max));

    this.percent = next;
    this.first.style.flexBasis = `${next}%`;
    this.handle.setAttribute("aria-valuenow", String(Math.round(next)));
    this.handle.setAttribute("aria-valuemin", String(Math.round(min)));
    this.handle.setAttribute("aria-valuemax", String(Math.round(max)));
    this.emit("resize", { detail: { size: next } });
  }

  override destroy(): void {
    for (const attribute of [
      "role",
      "aria-orientation",
      "aria-controls",
      "aria-valuenow",
      "aria-valuemin",
      "aria-valuemax",
      "tabindex",
    ]) {
      this.handle.removeAttribute(attribute);
    }
    this.first.style.removeProperty("flex-basis");
    super.destroy();
  }

  private axisSize(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();

    return this.vertical ? rect.height : rect.width;
  }

  private availableSpace(): number {
    return Math.max(this.axisSize(this.element) - this.axisSize(this.handle), 0);
  }

  private limits(): { min: number; max: number } {
    const space = this.availableSpace();
    if (space === 0) return { min: 0, max: 100 };

    const minFirst = (Number(this.first.dataset.azMin) || 0) / space;
    const minSecond = (Number(this.second.dataset.azMin) || 0) / space;

    return { min: minFirst * 100, max: 100 - minSecond * 100 };
  }

  private initialPercent(): number {
    return Number(this.element.dataset.azSize) || DEFAULT_PERCENT;
  }

  private isRtl(): boolean {
    return this.element.closest("[dir]")?.getAttribute("dir") === "rtl";
  }

  private startDrag(event: PointerEvent): void {
    event.preventDefault();
    this.handle.setPointerCapture(event.pointerId);

    const onMove = (move: PointerEvent): void => this.dragTo(move);
    const stop = (): void => {
      this.handle.removeEventListener("pointermove", onMove);
      this.handle.removeEventListener("pointerup", stop);
      this.handle.removeEventListener("pointercancel", stop);
    };
    this.handle.addEventListener("pointermove", onMove);
    this.handle.addEventListener("pointerup", stop);
    this.handle.addEventListener("pointercancel", stop);
    this.track(stop);
  }

  private dragTo(event: PointerEvent): void {
    const space = this.availableSpace();
    if (space === 0) return;

    const rect = this.element.getBoundingClientRect();
    const handleHalf = this.axisSize(this.handle) / 2;
    let offset: number;
    if (this.vertical) offset = event.clientY - rect.top;
    else offset = this.isRtl() ? rect.right - event.clientX : event.clientX - rect.left;

    this.resize(((offset - handleHalf) / space) * 100);
  }

  private handleKey(event: KeyboardEvent): void {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const growKey = this.vertical ? "ArrowDown" : this.isRtl() ? "ArrowLeft" : "ArrowRight";
    const shrinkKey = this.vertical ? "ArrowUp" : this.isRtl() ? "ArrowRight" : "ArrowLeft";

    if (event.key === growKey) this.resize(this.percent + step);
    else if (event.key === shrinkKey) this.resize(this.percent - step);
    else if (event.key === "Home") this.resize(0);
    else if (event.key === "End") this.resize(100);
    else return;

    event.preventDefault();
  }
}
