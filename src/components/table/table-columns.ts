import { Component } from "../../javascript/core/component";

const DEFAULT_MIN_WIDTH = 48;
const KEY_STEP = 10;
const KEY_STEP_LARGE = 50;
const HANDLE_CLASS = "az-table-resize";
const STICKY_CLASS = "az-table-sticky";
const FIXED_CLASS = "az-table-fixed";

export class TableColumns extends Component {
  private readonly table: HTMLTableElement;
  private readonly addedFixedClass: boolean;

  constructor(target: string | HTMLElement) {
    super("tablecolumns", target, {});

    const table =
      this.element instanceof HTMLTableElement ? this.element : this.element.querySelector("table");
    if (!table) {
      super.destroy();
      throw new Error("AZUI: table columns requires a <table>.");
    }
    this.table = table;
    this.addedFixedClass = !table.classList.contains(FIXED_CLASS);
    table.classList.add(FIXED_CLASS);

    for (const header of this.headers()) {
      if (header.dataset.azResizable !== undefined) this.addHandle(header);
    }
    this.refreshSticky();
  }

  resize(column: number, width: number): void {
    const header = this.headers()[column];
    if (!header) return;

    const next = Math.max(this.minWidthOf(header), Math.round(width));
    header.style.width = `${next}px`;
    header.querySelector(`.${HANDLE_CLASS}`)?.setAttribute("aria-valuenow", String(next));
    this.refreshSticky();
    this.emit("resize", { detail: { column, width: next } });
  }

  refreshSticky(): void {
    for (const cell of this.table.querySelectorAll<HTMLElement>(`.${STICKY_CLASS}`)) {
      cell.classList.remove(STICKY_CLASS);
      cell.style.removeProperty("inset-inline-start");
    }

    let offset = 0;
    this.headers().forEach((header, index) => {
      if (header.dataset.azSticky === undefined) return;

      for (const row of this.table.rows) {
        const cell = row.cells[index];
        cell?.classList.add(STICKY_CLASS);
        cell?.style.setProperty("inset-inline-start", `${offset}px`);
      }
      offset += this.widthOf(header);
    });
  }

  override destroy(): void {
    for (const handle of this.table.querySelectorAll(`.${HANDLE_CLASS}`)) handle.remove();
    for (const header of this.headers()) header.style.removeProperty("width");
    for (const cell of this.table.querySelectorAll<HTMLElement>(`.${STICKY_CLASS}`)) {
      cell.classList.remove(STICKY_CLASS);
      cell.style.removeProperty("inset-inline-start");
    }
    if (this.addedFixedClass) this.table.classList.remove(FIXED_CLASS);
    super.destroy();
  }

  private headers(): HTMLTableCellElement[] {
    return [...(this.table.tHead?.rows[0]?.cells ?? [])];
  }

  private minWidthOf(header: HTMLTableCellElement): number {
    return Number(header.dataset.azMinWidth) || DEFAULT_MIN_WIDTH;
  }

  private widthOf(header: HTMLTableCellElement): number {
    return header.getBoundingClientRect().width;
  }

  private isRtl(): boolean {
    return this.table.closest("[dir]")?.getAttribute("dir") === "rtl";
  }

  private addHandle(header: HTMLTableCellElement): void {
    const handle = document.createElement("span");
    handle.className = HANDLE_CLASS;
    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-orientation", "vertical");
    handle.setAttribute("aria-label", `Resize column ${(header.textContent ?? "").trim()}`);
    handle.setAttribute("aria-valuemin", String(this.minWidthOf(header)));
    handle.tabIndex = 0;
    header.append(handle);

    this.listen(handle, "pointerdown", (event) => this.startDrag(event, header, handle));
    this.listen(handle, "keydown", (event) => this.handleKey(event, header));
  }

  private startDrag(event: PointerEvent, header: HTMLTableCellElement, handle: HTMLElement): void {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startWidth = this.widthOf(header);
    const direction = this.isRtl() ? -1 : 1;
    const onMove = (move: PointerEvent): void => {
      this.resize(header.cellIndex, startWidth + (move.clientX - startX) * direction);
    };
    const stop = (): void => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    this.track(stop);
  }

  private handleKey(event: KeyboardEvent, header: HTMLTableCellElement): void {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const growKey = this.isRtl() ? "ArrowLeft" : "ArrowRight";
    const shrinkKey = this.isRtl() ? "ArrowRight" : "ArrowLeft";
    const delta = event.key === growKey ? step : event.key === shrinkKey ? -step : 0;
    if (delta === 0) return;

    event.preventDefault();
    this.resize(header.cellIndex, this.widthOf(header) + delta);
  }
}
