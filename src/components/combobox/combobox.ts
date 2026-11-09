import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import { normalizeText } from "../../javascript/dom/normalize-text";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { uniqueId } from "../../javascript/dom/unique-id";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxLabels {
  loading: string;
  empty: string;
  error: string;
}

export type ComboboxSource = (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>;

export interface ComboboxOptions {
  options: ComboboxOption[];
  source: ComboboxSource | null;
  minChars: number;
  debounce: number;
  labels: ComboboxLabels;
}

export type ComboboxConfig = Partial<Omit<ComboboxOptions, "labels">> & {
  labels?: Partial<ComboboxLabels>;
};

const DEFAULT_LABELS: ComboboxLabels = {
  loading: "Loading...",
  empty: "No results",
  error: "Could not load the options",
};
const DEFAULT_DEBOUNCE = 250;

function parseOptions(json: string | undefined): ComboboxOption[] {
  if (!json) return [];

  try {
    return JSON.parse(json) as ComboboxOption[];
  } catch {
    throw new Error("AZUI: combobox data-az-options must be a valid JSON array.");
  }
}

function resolveOptions(target: string | HTMLElement, config: ComboboxConfig): ComboboxOptions {
  const source = config.source ?? null;

  return {
    options: config.options ?? parseOptions(resolveElement(target).dataset.azOptions),
    source,
    minChars: config.minChars ?? (source ? 1 : 0),
    debounce: config.debounce ?? DEFAULT_DEBOUNCE,
    labels: { ...DEFAULT_LABELS, ...config.labels },
  };
}

export class Combobox extends Component<ComboboxOptions> {
  private readonly input: HTMLInputElement;
  private readonly wrapper: HTMLElement;
  private readonly storage: HTMLInputElement;
  private readonly menu: HTMLElement;
  private readonly originalName: string;
  private selected: ComboboxOption | null = null;
  private results: ComboboxOption[] = [];
  private activeIndex = -1;
  private requestId = 0;
  private controller: AbortController | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private removeDismiss: (() => void) | null = null;

  constructor(target: string | HTMLElement, config: ComboboxConfig = {}) {
    super("combobox", target, resolveOptions(target, config));

    if (!(this.element instanceof HTMLInputElement)) {
      super.destroy();
      throw new Error("AZUI: combobox must be initialized on an <input> element.");
    }
    this.input = this.element;
    this.originalName = this.input.name;
    this.wrapper = document.createElement("div");
    this.storage = document.createElement("input");
    this.menu = document.createElement("ul");
    this.build();

    this.listen(this.input, "input", () => this.handleInput());
    this.listen(this.input, "keydown", (event) => this.handleKey(event));
    this.listen(this.menu, "mousedown", (event) => event.preventDefault());
    this.listen(this.menu, "click", (event) => this.handleMenuClick(event));
  }

  get value(): string | null {
    return this.selected?.value ?? null;
  }

  get isOpen(): boolean {
    return !this.menu.hidden;
  }

  select(option: ComboboxOption): void {
    this.selected = option;
    this.input.value = option.label;
    this.storage.value = option.value;
    this.cancelPending();
    this.close();
    this.storage.dispatchEvent(new Event("change", { bubbles: true }));
    this.emit("select", { detail: { option } });
  }

  clear(): void {
    this.cancelPending();
    this.resetSelection();
    this.input.value = "";
    this.close();
  }

  override destroy(): void {
    this.cancelPending();
    this.close();
    this.wrapper.replaceWith(this.input);
    if (this.originalName) this.input.name = this.originalName;
    for (const attribute of [
      "role",
      "aria-autocomplete",
      "aria-expanded",
      "aria-controls",
      "aria-activedescendant",
    ]) {
      this.input.removeAttribute(attribute);
    }
    super.destroy();
  }

  private build(): void {
    this.wrapper.className = "az-combobox";
    this.storage.type = "hidden";
    this.storage.name = this.originalName;
    this.input.removeAttribute("name");

    this.menu.className = "az-combobox-menu";
    this.menu.id = uniqueId("az-combobox-menu");
    this.menu.setAttribute("role", "listbox");
    this.menu.hidden = true;

    this.input.setAttribute("role", "combobox");
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-expanded", "false");
    this.input.setAttribute("aria-controls", this.menu.id);

    this.input.replaceWith(this.wrapper);
    this.wrapper.append(this.input, this.storage, this.menu);
  }

  private open(): void {
    if (this.isOpen) return;

    this.menu.hidden = false;
    this.input.setAttribute("aria-expanded", "true");
    this.removeDismiss = this.track(onDismiss([this.wrapper], () => this.close()));
  }

  private close(): void {
    if (!this.isOpen) return;

    this.menu.hidden = true;
    this.activeIndex = -1;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-activedescendant");
    this.removeDismiss?.();
    this.removeDismiss = null;
  }

  private resetSelection(): void {
    if (!this.selected) return;

    this.selected = null;
    this.storage.value = "";
    this.storage.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private cancelPending(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.controller?.abort();
    this.controller = null;
    this.requestId += 1;
  }

  private handleInput(): void {
    if (this.selected && this.input.value !== this.selected.label) this.resetSelection();
    this.search(this.input.value);
  }

  private search(query: string): void {
    this.emit("search", { detail: { query } });
    this.cancelPending();
    if (query.length < this.options.minChars) {
      this.close();
      return;
    }

    const { source, debounce } = this.options;
    if (!source) {
      this.showResults(this.filterLocal(query));
      return;
    }
    this.timer = setTimeout(() => void this.runSource(source, query), debounce);
  }

  private filterLocal(query: string): ComboboxOption[] {
    const needle = normalizeText(query);

    return this.options.options.filter((option) => normalizeText(option.label).includes(needle));
  }

  private async runSource(source: ComboboxSource, query: string): Promise<void> {
    const controller = new AbortController();
    this.controller = controller;
    this.requestId += 1;
    const id = this.requestId;
    this.showStatus(this.options.labels.loading);

    try {
      const results = await source(query, controller.signal);
      if (id === this.requestId) this.showResults(results);
    } catch {
      if (id === this.requestId && !controller.signal.aborted) {
        this.showStatus(this.options.labels.error);
      }
    }
  }

  private showStatus(message: string): void {
    this.results = [];
    this.activeIndex = -1;
    const status = document.createElement("li");
    status.className = "az-combobox-status";
    status.setAttribute("role", "presentation");
    status.textContent = message;
    this.menu.replaceChildren(status);
    this.open();
  }

  private showResults(results: ComboboxOption[]): void {
    if (results.length === 0) {
      this.showStatus(this.options.labels.empty);
      return;
    }

    this.results = results;
    this.activeIndex = -1;
    this.menu.replaceChildren(
      ...results.map((option, index) => {
        const item = document.createElement("li");
        item.className = "az-combobox-option";
        item.id = `${this.menu.id}-${index}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", "false");
        item.dataset.index = String(index);
        item.textContent = option.label;

        return item;
      }),
    );
    this.input.removeAttribute("aria-activedescendant");
    this.open();
  }

  private setActive(index: number): void {
    this.activeIndex = index;
    const items = [...this.menu.querySelectorAll<HTMLElement>('[role="option"]')];
    items.forEach((item, itemIndex) => {
      item.setAttribute("aria-selected", String(itemIndex === index));
    });

    const active = items[index];
    if (!active) return;

    this.input.setAttribute("aria-activedescendant", active.id);
    if (typeof active.scrollIntoView === "function") active.scrollIntoView({ block: "nearest" });
  }

  private move(delta: number): void {
    const total = this.results.length;
    if (total === 0) return;

    const next = this.activeIndex + delta;
    if (next < 0) this.setActive(total - 1);
    else this.setActive(next >= total ? 0 : next);
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (this.isOpen) this.move(event.key === "ArrowDown" ? 1 : -1);
      else this.search(this.input.value);
    } else if (event.key === "Enter" && this.isOpen && this.activeIndex >= 0) {
      event.preventDefault();
      const option = this.results[this.activeIndex];
      if (option) this.select(option);
    } else if (event.key === "Escape") {
      this.close();
    }
  }

  private handleMenuClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const item = event.target.closest<HTMLElement>('[role="option"]');
    const option = this.results[Number(item?.dataset.index)];
    if (option) this.select(option);
  }
}
