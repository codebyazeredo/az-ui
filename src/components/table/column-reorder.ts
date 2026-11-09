import { Component } from "../../javascript/core/component";

const HEADER_SELECTOR = "th[data-az-reorderable]";
const DRAGGING_CLASS = "az-table-column-dragging";

export class ColumnReorder extends Component {
  private readonly table: HTMLTableElement;
  private dragged: HTMLTableCellElement | null = null;

  constructor(target: string | HTMLElement) {
    super("columnreorder", target, {});

    const table =
      this.element instanceof HTMLTableElement ? this.element : this.element.querySelector("table");
    if (!table) {
      super.destroy();
      throw new Error("AZUI: column reorder requires a <table>.");
    }
    this.table = table;

    for (const header of this.headers()) {
      header.draggable = true;
      header.tabIndex = 0;
    }

    this.listen(this.table, "dragstart", (event) => this.handleDragStart(event));
    this.listen(this.table, "dragover", (event) => this.handleDragOver(event));
    this.listen(this.table, "drop", (event) => this.handleDrop(event));
    this.listen(this.table, "dragend", () => this.endDrag());
    this.listen(this.table, "keydown", (event) => this.handleKey(event));
  }

  move(from: number, to: number): boolean {
    const count = this.table.tHead?.rows[0]?.cells.length ?? 0;
    const isValid = (index: number): boolean =>
      Number.isInteger(index) && index >= 0 && index < count;
    if (from === to || !isValid(from) || !isValid(to)) return false;
    if (!this.emit("reorder", { cancelable: true, detail: { from, to } })) return false;

    for (const row of this.table.rows) {
      const cells = [...row.cells];
      const moving = cells[from];
      const reference = cells[to];
      if (!moving || !reference) continue;

      row.insertBefore(moving, to > from ? reference.nextSibling : reference);
    }

    return true;
  }

  override destroy(): void {
    this.endDrag();
    for (const header of this.headers()) {
      header.removeAttribute("draggable");
      header.removeAttribute("tabindex");
    }
    super.destroy();
  }

  private headers(): HTMLTableCellElement[] {
    return [...this.table.querySelectorAll<HTMLTableCellElement>(HEADER_SELECTOR)];
  }

  private headerFrom(target: EventTarget | null): HTMLTableCellElement | null {
    const header = target instanceof Element ? target.closest("th") : null;

    return header?.matches(HEADER_SELECTOR) ? header : null;
  }

  private endDrag(): void {
    this.dragged?.classList.remove(DRAGGING_CLASS);
    this.dragged = null;
  }

  private handleDragStart(event: DragEvent): void {
    const header = this.headerFrom(event.target);
    if (!header) return;

    this.dragged = header;
    header.classList.add(DRAGGING_CLASS);
    event.dataTransfer?.setData("text/plain", "");
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  }

  private handleDragOver(event: DragEvent): void {
    if (this.dragged && this.headerFrom(event.target)) event.preventDefault();
  }

  private handleDrop(event: DragEvent): void {
    const target = this.headerFrom(event.target);
    const dragged = this.dragged;
    if (!dragged || !target) return;

    event.preventDefault();
    this.endDrag();
    this.move(dragged.cellIndex, target.cellIndex);
  }

  private handleKey(event: KeyboardEvent): void {
    const header = this.headerFrom(event.target);
    const isArrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
    if (!header || event.target !== header || !event.altKey || !isArrow) return;

    const rtl = this.table.closest("[dir]")?.getAttribute("dir") === "rtl";
    const forward = (event.key === "ArrowRight") !== rtl;
    event.preventDefault();
    if (this.move(header.cellIndex, header.cellIndex + (forward ? 1 : -1))) header.focus();
  }
}
