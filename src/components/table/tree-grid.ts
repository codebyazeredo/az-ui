import { Component } from "../../javascript/core/component";

const ROW_SELECTOR = "tbody tr[data-az-level]";
const TOGGLE_CLASS = "az-treegrid-toggle";

export class TreeGrid extends Component {
  private readonly table: HTMLTableElement;

  constructor(target: string | HTMLElement) {
    super("treegrid", target, {});

    const table =
      this.element instanceof HTMLTableElement ? this.element : this.element.querySelector("table");
    if (!table) {
      super.destroy();
      throw new Error("AZUI: tree grid requires a <table>.");
    }
    this.table = table;
    table.setAttribute("role", "treegrid");

    for (const row of this.rows()) {
      const level = this.levelOf(row);
      row.setAttribute("aria-level", String(level));
      row.tabIndex = -1;

      const firstCell = row.cells[0];
      firstCell?.style.setProperty("--az-treegrid-level", String(level - 1));
      firstCell?.prepend(this.createToggle());
      if (this.hasChildren(row)) {
        row.setAttribute("aria-expanded", String(row.getAttribute("aria-expanded") === "true"));
      } else {
        row.removeAttribute("aria-expanded");
      }
    }
    this.applyVisibility();
    this.visibleRows()[0]?.setAttribute("tabindex", "0");

    this.listen(this.table, "click", (event) => this.handleClick(event));
    this.listen(this.table, "keydown", (event) => this.handleKey(event));
  }

  isExpanded(row: HTMLTableRowElement): boolean {
    return row.getAttribute("aria-expanded") === "true";
  }

  expand(row: HTMLTableRowElement): void {
    this.setExpanded(row, true);
  }

  collapse(row: HTMLTableRowElement): void {
    this.setExpanded(row, false);
  }

  expandAll(): void {
    for (const row of this.rows()) this.setExpanded(row, true);
  }

  collapseAll(): void {
    for (const row of this.rows()) this.setExpanded(row, false);
  }

  override destroy(): void {
    this.table.removeAttribute("role");
    for (const toggle of this.table.querySelectorAll(`.${TOGGLE_CLASS}`)) toggle.remove();
    for (const row of this.rows()) {
      row.hidden = false;
      row.cells[0]?.style.removeProperty("--az-treegrid-level");
      for (const attribute of ["aria-level", "aria-expanded", "tabindex"]) {
        row.removeAttribute(attribute);
      }
    }
    super.destroy();
  }

  private rows(): HTMLTableRowElement[] {
    return [...this.table.querySelectorAll<HTMLTableRowElement>(ROW_SELECTOR)];
  }

  private visibleRows(): HTMLTableRowElement[] {
    return this.rows().filter((row) => !row.hidden);
  }

  private levelOf(row: HTMLTableRowElement): number {
    const level = Number(row.dataset.azLevel);

    return Number.isInteger(level) && level >= 1 ? level : 1;
  }

  private hasChildren(row: HTMLTableRowElement): boolean {
    const next = row.nextElementSibling;

    return (
      next instanceof HTMLTableRowElement &&
      next.matches(ROW_SELECTOR) &&
      this.levelOf(next) > this.levelOf(row)
    );
  }

  private parentOf(row: HTMLTableRowElement): HTMLTableRowElement | null {
    const level = this.levelOf(row);

    for (
      let sibling = row.previousElementSibling;
      sibling;
      sibling = sibling.previousElementSibling
    ) {
      if (sibling instanceof HTMLTableRowElement && this.levelOf(sibling) < level) return sibling;
    }

    return null;
  }

  private createToggle(): HTMLElement {
    const toggle = document.createElement("span");
    toggle.className = TOGGLE_CLASS;
    toggle.setAttribute("aria-hidden", "true");

    return toggle;
  }

  private applyVisibility(): void {
    let hideBelow: number | null = null;

    for (const row of this.rows()) {
      const level = this.levelOf(row);
      if (hideBelow !== null && level > hideBelow) {
        row.hidden = true;
        continue;
      }

      hideBelow = null;
      row.hidden = false;
      if (this.hasChildren(row) && !this.isExpanded(row)) hideBelow = level;
    }
  }

  private setExpanded(row: HTMLTableRowElement, expanded: boolean): void {
    if (!this.hasChildren(row) || this.isExpanded(row) === expanded) return;

    row.setAttribute("aria-expanded", String(expanded));
    this.applyVisibility();
    this.emit("toggle", { detail: { row, expanded } });
  }

  private focusRow(row: HTMLTableRowElement): void {
    for (const other of this.rows()) other.tabIndex = -1;
    row.tabIndex = 0;
    row.focus();
  }

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element) || !event.target.closest(`.${TOGGLE_CLASS}`)) return;

    const row = event.target.closest("tr");
    if (!(row instanceof HTMLTableRowElement) || !this.rows().includes(row)) return;

    this.setExpanded(row, !this.isExpanded(row));
    this.focusRow(row);
  }

  private handleKey(event: KeyboardEvent): void {
    const row = event.target;
    if (!(row instanceof HTMLTableRowElement) || !this.rows().includes(row)) return;

    const rtl = this.table.closest("[dir]")?.getAttribute("dir") === "rtl";
    const openKey = rtl ? "ArrowLeft" : "ArrowRight";
    const closeKey = rtl ? "ArrowRight" : "ArrowLeft";
    const visible = this.visibleRows();
    const position = visible.indexOf(row);
    const branch = this.hasChildren(row);

    let next: HTMLTableRowElement | null | undefined;
    if (event.key === "ArrowDown") next = visible[position + 1];
    else if (event.key === "ArrowUp") next = visible[position - 1];
    else if (event.key === "Home") next = visible[0];
    else if (event.key === "End") next = visible[visible.length - 1];
    else if (event.key === openKey && branch) {
      if (!this.isExpanded(row)) this.setExpanded(row, true);
      else next = visible[position + 1];
    } else if (event.key === closeKey) {
      if (branch && this.isExpanded(row)) this.setExpanded(row, false);
      else next = this.parentOf(row);
    } else return;

    event.preventDefault();
    if (next) this.focusRow(next);
  }
}
