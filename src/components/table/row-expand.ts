import { Component } from "../../javascript/core/component";
import { ensureId } from "../../javascript/dom/unique-id";

const BUTTON_SELECTOR = "[data-az-expand]";
const DETAIL_SELECTOR = ".az-table-detail";

export class RowExpand extends Component {
  constructor(target: string | HTMLElement) {
    super("rowexpand", target, {});

    for (const row of this.rows()) {
      const button = this.buttonOf(row);
      const detail = this.detailOf(row);
      if (!button || !detail) continue;

      button.setAttribute("aria-controls", ensureId(detail, "az-table-detail"));
      this.apply(row, button.getAttribute("aria-expanded") === "true");
    }

    this.listen(this.element, "click", (event) => this.handleClick(event));
  }

  isExpanded(row: HTMLTableRowElement): boolean {
    return this.buttonOf(row)?.getAttribute("aria-expanded") === "true";
  }

  expand(row: HTMLTableRowElement): void {
    this.setExpanded(row, true);
  }

  collapse(row: HTMLTableRowElement): void {
    this.setExpanded(row, false);
  }

  toggle(row: HTMLTableRowElement): void {
    this.setExpanded(row, !this.isExpanded(row));
  }

  expandAll(): void {
    for (const row of this.rows()) this.expand(row);
  }

  collapseAll(): void {
    for (const row of this.rows()) this.collapse(row);
  }

  override destroy(): void {
    for (const row of this.rows()) {
      const detail = this.detailOf(row);
      if (detail) detail.hidden = false;
      for (const attribute of ["aria-expanded", "aria-controls"]) {
        this.buttonOf(row)?.removeAttribute(attribute);
      }
    }
    super.destroy();
  }

  private rows(): HTMLTableRowElement[] {
    return [...this.element.querySelectorAll<HTMLTableRowElement>("tr")].filter((row) =>
      this.buttonOf(row),
    );
  }

  private buttonOf(row: HTMLTableRowElement): HTMLElement | null {
    return row.querySelector<HTMLElement>(BUTTON_SELECTOR);
  }

  private detailOf(row: HTMLTableRowElement): HTMLTableRowElement | null {
    const next = row.nextElementSibling;

    return next instanceof HTMLTableRowElement && next.matches(DETAIL_SELECTOR) ? next : null;
  }

  private apply(row: HTMLTableRowElement, expanded: boolean): void {
    this.buttonOf(row)?.setAttribute("aria-expanded", String(expanded));
    const detail = this.detailOf(row);
    if (detail) detail.hidden = !expanded;
  }

  private setExpanded(row: HTMLTableRowElement, expanded: boolean): void {
    const detail = this.detailOf(row);
    if (!detail || this.isExpanded(row) === expanded) return;

    this.apply(row, expanded);
    this.emit("toggle", { detail: { row, detail, expanded } });
  }

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const row = event.target.closest(BUTTON_SELECTOR)?.closest("tr");
    if (row instanceof HTMLTableRowElement && this.rows().includes(row)) this.toggle(row);
  }
}
