import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";

export interface PaginationLabels {
  navigation: string;
  previous: string;
  next: string;
  page: string;
}

export interface PaginationOptions {
  total: number;
  pageSize: number;
  page: number;
  labels: PaginationLabels;
}

export type PaginationConfig = Partial<Omit<PaginationOptions, "labels">> & {
  labels?: Partial<PaginationLabels>;
};

const DEFAULT_LABELS: PaginationLabels = {
  navigation: "Pagination",
  previous: "Previous page",
  next: "Next page",
  page: "Page",
};
const DEFAULT_PAGE_SIZE = 10;

function resolveOptions(target: string | HTMLElement, config: PaginationConfig): PaginationOptions {
  const { azTotal, azPageSize, azPage } = resolveElement(target).dataset;

  return {
    total: config.total ?? Number(azTotal ?? 0),
    pageSize: config.pageSize ?? Number(azPageSize ?? DEFAULT_PAGE_SIZE),
    page: config.page ?? Number(azPage ?? 1),
    labels: { ...DEFAULT_LABELS, ...config.labels },
  };
}

function visiblePages(page: number, pageCount: number): (number | null)[] {
  const wanted = [1, page - 1, page, page + 1, pageCount].filter(
    (number) => number >= 1 && number <= pageCount,
  );
  const pages: (number | null)[] = [];

  for (const number of [...new Set(wanted)].sort((a, b) => a - b)) {
    const previous = pages.at(-1);
    if (previous && number - previous > 1) pages.push(null);
    pages.push(number);
  }

  return pages;
}

export class Pagination extends Component<PaginationOptions> {
  private current: number;
  private total: number;
  private size: number;
  private readonly addedLabel: boolean;

  constructor(target: string | HTMLElement, config: PaginationConfig = {}) {
    super("pagination", target, resolveOptions(target, config));

    this.total = this.options.total;
    this.size = Math.max(1, this.options.pageSize);
    this.current = this.clamp(this.options.page);
    this.addedLabel = !this.element.hasAttribute("aria-label");
    if (this.addedLabel) this.element.setAttribute("aria-label", this.options.labels.navigation);

    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.render();
  }

  get page(): number {
    return this.current;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  get pageSize(): number {
    return this.size;
  }

  goTo(page: number): void {
    const next = this.clamp(page);
    if (next === this.current) return;

    this.current = next;
    this.render();
    this.emit("change", { detail: { page: this.current, pageSize: this.size } });
  }

  update({ total = this.total, pageSize = this.size } = {}): void {
    this.total = total;
    this.size = Math.max(1, pageSize);
    this.current = this.clamp(this.current);
    this.render();
  }

  override destroy(): void {
    this.element.replaceChildren();
    if (this.addedLabel) this.element.removeAttribute("aria-label");
    super.destroy();
  }

  private clamp(page: number): number {
    return Math.min(Math.max(1, Math.trunc(page) || 1), this.pageCount);
  }

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLElement>("[data-az-page]");
    if (!button) return;

    this.goTo(Number(button.dataset.azPage));
    this.element.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
  }

  private render(): void {
    const { labels } = this.options;
    const items = [
      this.createButton("‹", this.current - 1, labels.previous, this.current === 1),
      ...visiblePages(this.current, this.pageCount).map((page) =>
        page === null ? this.createEllipsis() : this.createPageButton(page),
      ),
      this.createButton("›", this.current + 1, labels.next, this.current === this.pageCount),
    ];

    this.element.replaceChildren(...items);
  }

  private createButton(
    text: string,
    page: number,
    label: string,
    disabled: boolean,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-pagination-item";
    button.textContent = text;
    button.disabled = disabled;
    button.dataset.azPage = String(page);
    button.setAttribute("aria-label", label);

    return button;
  }

  private createPageButton(page: number): HTMLButtonElement {
    const button = this.createButton(
      String(page),
      page,
      `${this.options.labels.page} ${page}`,
      false,
    );
    if (page === this.current) button.setAttribute("aria-current", "page");

    return button;
  }

  private createEllipsis(): HTMLElement {
    const ellipsis = document.createElement("span");
    ellipsis.className = "az-pagination-ellipsis";
    ellipsis.textContent = "…";

    return ellipsis;
  }
}
