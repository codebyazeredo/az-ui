import { Component } from "../../javascript/core/component";

export interface VirtualTableOptions {
  rowCount: number;
  rowHeight: number;
  renderRow: (index: number) => HTMLTableRowElement;
  overscan?: number;
}

type ResolvedOptions = Required<VirtualTableOptions>;

const DEFAULT_OVERSCAN = 5;

export class VirtualTable extends Component<ResolvedOptions> {
  private readonly table: HTMLTableElement;
  private readonly body: HTMLTableSectionElement;
  private readonly topSpacer: HTMLTableRowElement;
  private readonly bottomSpacer: HTMLTableRowElement;
  private count: number;
  private first = 0;
  private last = 0;

  constructor(target: string | HTMLElement, options: VirtualTableOptions) {
    super("virtualtable", target, { overscan: DEFAULT_OVERSCAN, ...options });

    const table = this.element.querySelector("table");
    if (!table?.tBodies[0]) {
      super.destroy();
      throw new Error("AZUI: virtual table requires a <table> with a <tbody>.");
    }
    if (!(options.rowHeight > 0) || !Number.isInteger(options.rowCount) || options.rowCount < 0) {
      super.destroy();
      throw new Error("AZUI: virtual table requires rowHeight > 0 and a rowCount of 0 or more.");
    }
    this.table = table;
    this.body = table.tBodies[0];
    this.count = options.rowCount;
    this.topSpacer = this.createSpacer();
    this.bottomSpacer = this.createSpacer();

    this.listen(this.element, "scroll", () => this.render(false));
    this.render(true);
  }

  get range(): { start: number; end: number } {
    return { start: this.first, end: this.last };
  }

  setRowCount(count: number): void {
    if (!Number.isInteger(count) || count < 0) return;

    this.count = count;
    const maxScroll = Math.max(0, count * this.options.rowHeight - this.element.clientHeight);
    if (this.element.scrollTop > maxScroll) this.element.scrollTop = maxScroll;
    this.render(true);
  }

  refresh(): void {
    this.render(true);
  }

  scrollToRow(index: number): void {
    if (this.count === 0) return;

    const row = Math.min(Math.max(0, Math.floor(index)), this.count - 1);
    this.element.scrollTop = row * this.options.rowHeight;
    this.render(false);
  }

  override destroy(): void {
    this.body.replaceChildren();
    this.table.removeAttribute("aria-rowcount");
    super.destroy();
  }

  private headerRowCount(): number {
    return this.table.tHead?.rows.length ?? 0;
  }

  private createSpacer(): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.className = "az-table-spacer";
    row.setAttribute("aria-hidden", "true");

    const cell = document.createElement("td");
    cell.colSpan = this.table.tHead?.rows[0]?.cells.length ?? 1;
    row.append(cell);

    return row;
  }

  private window(): { start: number; end: number } {
    const { rowHeight, overscan } = this.options;
    const headHeight = this.table.tHead?.offsetHeight ?? 0;
    const top = Math.max(0, this.element.scrollTop - headHeight);
    const bottom = Math.max(0, this.element.scrollTop + this.element.clientHeight - headHeight);
    const end = Math.min(this.count, Math.ceil(bottom / rowHeight) + overscan);
    const start = Math.min(Math.max(0, Math.floor(top / rowHeight) - overscan), end);

    return { start, end };
  }

  private render(force: boolean): void {
    const { start, end } = this.window();
    if (!force && start === this.first && end === this.last) return;

    this.first = start;
    this.last = end;
    this.table.setAttribute("aria-rowcount", String(this.count + this.headerRowCount()));

    const rows: HTMLTableRowElement[] = [];
    for (let index = start; index < end; index += 1) {
      const row = this.options.renderRow(index);
      row.setAttribute("aria-rowindex", String(index + 1 + this.headerRowCount()));
      rows.push(row);
    }

    const { rowHeight } = this.options;
    const topCell = this.topSpacer.firstElementChild as HTMLElement;
    const bottomCell = this.bottomSpacer.firstElementChild as HTMLElement;
    topCell.style.height = `${start * rowHeight}px`;
    bottomCell.style.height = `${(this.count - end) * rowHeight}px`;
    this.body.replaceChildren(this.topSpacer, ...rows, this.bottomSpacer);
  }
}
