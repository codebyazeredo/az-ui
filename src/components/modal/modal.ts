import { Overlay } from "../../javascript/core/overlay";
import type { OverlayOptions } from "../../javascript/core/overlay";

export interface ModalOptions extends OverlayOptions {
  draggable: boolean;
}

interface DragSession {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, [data-az-dismiss]";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export class Modal extends Overlay {
  private readonly dialog: HTMLElement;
  private position = { x: 0, y: 0 };
  private drag: DragSession | null = null;

  constructor(target: string | HTMLElement, options: Partial<ModalOptions> = {}) {
    const { draggable = true, ...overlayOptions } = options;
    super("modal", target, ".az-modal-dialog", overlayOptions);

    this.dialog = this.element.querySelector<HTMLElement>(".az-modal-dialog")!;
    const header = this.dialog.querySelector<HTMLElement>(".az-modal-header");
    if (draggable && header) this.enableDragging(header);
  }

  override show(): void {
    if (!this.isOpen) this.moveTo(0, 0);
    super.show();
  }

  private enableDragging(header: HTMLElement): void {
    this.dialog.dataset.azDraggable = "";
    this.listen(header, "pointerdown", (event) => this.startDrag(header, event));
    this.listen(header, "pointermove", (event) => this.continueDrag(event));
    this.listen(header, "pointerup", () => (this.drag = null));
    this.listen(header, "pointercancel", () => (this.drag = null));
    this.track(() => {
      delete this.dialog.dataset.azDraggable;
      this.moveTo(0, 0);
    });
  }

  private startDrag(header: HTMLElement, event: PointerEvent): void {
    const isInteractive =
      event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR) !== null;
    if (event.button !== 0 || isInteractive) return;

    const rect = this.dialog.getBoundingClientRect();
    this.drag = {
      startX: event.clientX,
      startY: event.clientY,
      originX: this.position.x,
      originY: this.position.y,
      minX: this.position.x - rect.left,
      maxX: this.position.x + window.innerWidth - rect.right,
      minY: this.position.y - rect.top,
      maxY: this.position.y + window.innerHeight - rect.bottom,
    };
    header.setPointerCapture?.(event.pointerId);
  }

  private continueDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag) return;

    this.moveTo(
      clamp(drag.originX + event.clientX - drag.startX, drag.minX, drag.maxX),
      clamp(drag.originY + event.clientY - drag.startY, drag.minY, drag.maxY),
    );
  }

  private moveTo(x: number, y: number): void {
    this.position = { x, y };
    this.dialog.style.transform = x === 0 && y === 0 ? "" : `translate(${x}px, ${y}px)`;
  }
}
