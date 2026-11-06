import { Component } from "../../javascript/core/component";
import { normalizeText } from "../../javascript/dom/normalize-text";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { Pagination } from "../pagination";
import { sortRows } from "./sort";
import type { SortDirection, SortType } from "./sort";

export interface DataTableOptions {
  search: string | HTMLElement | null;
  pagination: string | HTMLElement | null;
  pageSize: number;
}

interface SortState {
  column: number;
  direction: SortDirection;
}

const DEFAULT_PAGE_SIZE = 10;
const SORT_BUTTON_SELECTOR = ".az-table-sort";

function resolveOptions(
  target: string | HTMLElement,
  options: Partial<DataTableOptions>,
): DataTableOptions {
  const { azSearch = null, azPagination = null, azPageSize } = resolveElement(target).dataset;

  return {
    search: azSearch,
    pagination: azPagination,
    pageSize: Number(azPageSize ?? DEFAULT_PAGE_SIZE),
    ...options,
  };
}

export class DataTable extends Component<DataTableOptions> {
  private readonly table: HTMLTableElement;
  private readonly body: HTMLTableSectionElement;
  private readonly sortHeaders: HTMLTableCellElement[];
  private readonly selectAll: HTMLInputElement | null;
  private readonly emptyState: HTMLElement | null;
  private readonly pagination: Pagination | null;
  private readonly hiddenColumns = new Set<number>();
  private ordered: HTMLTableRowElement[] = [];
  private sort: SortState | null = null;
  private query = "";

  constructor(target: string | HTMLElement, options: Partial<DataTableOptions> = {}) {
    super("datatable", target, resolveOptions(target, options));

    const table = this.element.querySelector("table");
    if (!table?.tBodies[0]) {
      super.destroy();
      throw new Error("AZUI: datatable requires a <table> with a <tbody>.");
    }
    this.table = table;
    this.body = table.tBodies[0];
    this.emptyState = this.element.querySelector(".az-table-empty");
    this.selectAll = this.element.querySelector("[data-az-select-all]");
    this.sortHeaders = [...table.querySelectorAll<HTMLTableCellElement>("th")].filter((header) =>
      header.querySelector(SORT_BUTTON_SELECTOR),
    );
    this.pagination = this.createPagination();

    this.setUpSorting();
    this.setUpSelection();
    this.setUpSearch();
    this.refresh();
  }

  get selectedRows(): HTMLTableRowElement[] {
    return [...this.body.rows].filter((row) => row.getAttribute("aria-selected") === "true");
  }

  refresh(): void {
    const matching = [...this.body.rows].filter((row) => this.matchesQuery(row));
    this.ordered = this.sort ? this.sortAndAppend(matching, this.sort) : matching;
    for (const row of this.body.rows) row.hidden = true;

    this.pagination?.update({ total: this.ordered.length });
    this.showCurrentPage();
  }

  clearSelection(): void {
    for (const row of this.selectedRows) this.setRowSelected(row, false);
    this.syncSelectAll();
    this.emit("select", { detail: { count: 0 } });
  }

  setColumnVisible(column: number, visible: boolean): void {
    if (visible) this.hiddenColumns.delete(column);
    else this.hiddenColumns.add(column);
    this.applyColumnVisibility();
  }

  setLoading(loading: boolean): void {
    this.element.setAttribute("aria-busy", String(loading));
  }

  override destroy(): void {
    this.element.removeAttribute("aria-busy");
    for (const cell of this.table.querySelectorAll<HTMLElement>("th, td")) cell.hidden = false;
    for (const row of this.body.rows) row.hidden = false;
    if (this.emptyState) this.emptyState.hidden = true;
    super.destroy();
  }

  private createPagination(): Pagination | null {
    const { pagination, pageSize } = this.options;
    if (!pagination) return null;

    const element = resolveElement(pagination);
    const existing = Component.find("pagination", element);
    const instance =
      existing instanceof Pagination ? existing : new Pagination(element, { pageSize });
    if (instance !== existing) this.track(() => instance.destroy());

    const showPage = (): void => this.showCurrentPage();
    element.addEventListener("az:pagination:change", showPage);
    this.track(() => element.removeEventListener("az:pagination:change", showPage));

    return instance;
  }

  private showCurrentPage(): void {
    const start = this.pagination ? (this.pagination.page - 1) * this.pagination.pageSize : 0;
    const end = this.pagination ? start + this.pagination.pageSize : this.ordered.length;

    this.ordered.forEach((row, index) => {
      row.hidden = index < start || index >= end;
    });
    if (this.emptyState) this.emptyState.hidden = this.ordered.length > 0;
    this.applyColumnVisibility();
    this.syncSelectAll();
  }

  private matchesQuery(row: HTMLTableRowElement): boolean {
    return normalizeText(row.textContent ?? "").includes(this.query);
  }

  private sortAndAppend(
    rows: HTMLTableRowElement[],
    { column, direction }: SortState,
  ): HTMLTableRowElement[] {
    const header = this.sortHeaders.find((candidate) => candidate.cellIndex === column);
    const type: SortType = header?.dataset.azSortType === "number" ? "number" : "text";
    const sorted = sortRows(rows, column, direction, type);
    this.body.append(...sorted);

    return sorted;
  }

  private applyColumnVisibility(): void {
    for (const row of this.table.rows) {
      [...row.cells].forEach((cell, index) => {
        cell.hidden = this.hiddenColumns.has(index);
      });
    }
  }

  private setUpSorting(): void {
    for (const header of this.sortHeaders) {
      if (!header.hasAttribute("aria-sort")) header.setAttribute("aria-sort", "none");
      const button = header.querySelector<HTMLElement>(SORT_BUTTON_SELECTOR);
      if (button) this.listen(button, "click", () => this.sortBy(header.cellIndex));
    }
  }

  private sortBy(column: number): void {
    const ascending = this.sort?.column !== column || this.sort.direction === "descending";
    const direction: SortDirection = ascending ? "ascending" : "descending";
    const clientSide = this.emit("sort", { cancelable: true, detail: { column, direction } });

    for (const header of this.sortHeaders) {
      header.setAttribute("aria-sort", header.cellIndex === column ? direction : "none");
    }
    this.sort = clientSide ? { column, direction } : null;
    this.refresh();
  }

  private setUpSelection(): void {
    this.listen(this.element, "change", (event) => {
      if (!(event.target instanceof HTMLInputElement)) return;

      if (event.target.matches("[data-az-select-all]")) {
        this.selectVisibleRows(event.target.checked);
      } else if (event.target.matches("[data-az-select-row]")) {
        const row = event.target.closest("tr");
        if (row) this.setRowSelected(row, event.target.checked);
      } else {
        return;
      }

      this.syncSelectAll();
      this.emit("select", { detail: { count: this.selectedRows.length } });
    });
  }

  private selectVisibleRows(selected: boolean): void {
    for (const row of this.body.rows) {
      if (!row.hidden) this.setRowSelected(row, selected);
    }
  }

  private setRowSelected(row: HTMLTableRowElement, selected: boolean): void {
    const checkbox = row.querySelector<HTMLInputElement>("[data-az-select-row]");
    if (checkbox) checkbox.checked = selected;
    row.setAttribute("aria-selected", String(selected));
  }

  private syncSelectAll(): void {
    if (!this.selectAll) return;

    const visible = [...this.body.rows].filter((row) => !row.hidden);
    const selected = visible.filter((row) => row.getAttribute("aria-selected") === "true");
    this.selectAll.checked = visible.length > 0 && selected.length === visible.length;
    this.selectAll.indeterminate = selected.length > 0 && selected.length < visible.length;
  }

  private setUpSearch(): void {
    const { search } = this.options;
    if (!search) return;

    const input = resolveElement(search);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("AZUI: the datatable search target must be an <input> element.");
    }

    this.listen(input, "input", () => {
      const query = input.value.trim();
      const clientSide = this.emit("search", { cancelable: true, detail: { query } });
      this.query = clientSide ? normalizeText(query) : "";
      this.refresh();
    });
  }
}
