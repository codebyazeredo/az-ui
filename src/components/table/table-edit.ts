import { Component } from "../../javascript/core/component";

const CELL_SELECTOR = "td[data-az-edit]";

interface EditingState {
  cell: HTMLTableCellElement;
  input: HTMLInputElement;
  oldValue: string;
  originalNodes: Node[];
}

export class TableEdit extends Component {
  private editing: EditingState | null = null;

  constructor(target: string | HTMLElement) {
    super("tableedit", target, {});

    this.refresh();
    this.listen(this.element, "dblclick", (event) => this.handleDoubleClick(event));
    this.listen(this.element, "keydown", (event) => this.handleCellKey(event));
  }

  get isEditing(): boolean {
    return this.editing !== null;
  }

  refresh(): void {
    for (const cell of this.cells()) cell.tabIndex = 0;
  }

  edit(cell: HTMLTableCellElement): void {
    if (!cell.matches(CELL_SELECTOR) || this.editing?.cell === cell) return;

    this.commit();
    const oldValue = cell.dataset.azValue ?? (cell.textContent ?? "").trim();
    const input = this.createInput(cell, oldValue);
    const state: EditingState = { cell, input, oldValue, originalNodes: [...cell.childNodes] };

    this.editing = state;
    cell.classList.add("az-table-editing");
    cell.replaceChildren(input);
    input.focus();
    input.select();

    input.addEventListener("keydown", (event) => this.handleInputKey(event, state));
    input.addEventListener("blur", () => {
      if (this.editing === state) this.commit();
    });
  }

  commit(): void {
    const state = this.editing;
    if (!state) return;

    const newValue = state.input.value.trim();
    this.finish(state);
    if (newValue === state.oldValue) {
      this.restore(state);
      return;
    }

    const { cell } = state;
    const detail = {
      cell,
      row: cell.parentElement,
      column: cell.cellIndex,
      oldValue: state.oldValue,
      newValue,
    };
    if (this.emit("commit", { cancelable: true, detail })) {
      cell.textContent = newValue;
      cell.dataset.azValue = newValue;
    } else {
      this.restore(state);
    }
    cell.focus();
  }

  cancel(): void {
    const state = this.editing;
    if (!state) return;

    this.finish(state);
    this.restore(state);
  }

  override destroy(): void {
    this.cancel();
    for (const cell of this.cells()) cell.removeAttribute("tabindex");
    super.destroy();
  }

  private cells(): HTMLTableCellElement[] {
    return [...this.element.querySelectorAll<HTMLTableCellElement>(CELL_SELECTOR)];
  }

  private createInput(cell: HTMLTableCellElement, value: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = cell.dataset.azEdit === "number" ? "number" : "text";
    input.className = "az-control az-control-sm";
    input.value = value;
    if (input.type === "number") input.step = "any";

    const header = cell.closest("table")?.tHead?.rows[0]?.cells[cell.cellIndex];
    const label = cell.dataset.azLabel ?? header?.textContent?.trim();
    if (label) input.setAttribute("aria-label", label);

    return input;
  }

  private finish(state: EditingState): void {
    this.editing = null;
    state.cell.classList.remove("az-table-editing");
  }

  private restore(state: EditingState): void {
    state.cell.replaceChildren(...state.originalNodes);
    state.cell.focus();
  }

  private handleInputKey(event: KeyboardEvent, state: EditingState): void {
    if (this.editing !== state) return;

    if (event.key === "Enter") {
      event.preventDefault();
      this.commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.cancel();
    }
  }

  private handleDoubleClick(event: MouseEvent): void {
    const cell = event.target instanceof Element ? event.target.closest("td") : null;
    if (cell) this.edit(cell);
  }

  private handleCellKey(event: KeyboardEvent): void {
    const isEditKey = event.key === "Enter" || event.key === "F2";
    if (!isEditKey || !(event.target instanceof HTMLTableCellElement)) return;
    if (!event.target.matches(CELL_SELECTOR)) return;

    event.preventDefault();
    this.edit(event.target);
  }
}
