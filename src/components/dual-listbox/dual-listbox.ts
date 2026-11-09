import { Component } from "../../javascript/core/component";
import { normalizeText } from "../../javascript/dom/normalize-text";
import { uniqueId } from "../../javascript/dom/unique-id";
import { Sortable } from "../sortable";

export interface DualListboxLabels {
  available: string;
  selected: string;
  search: string;
  add: string;
  addAll: string;
  remove: string;
  removeAll: string;
}

export interface DualListboxOptions {
  labels?: Partial<DualListboxLabels>;
}

interface Pane {
  element: HTMLElement;
  list: HTMLElement;
}

const DEFAULT_LABELS: DualListboxLabels = {
  available: "Available",
  selected: "Selected",
  search: "Search {list}",
  add: "Add selected",
  addAll: "Add all",
  remove: "Remove selected",
  removeAll: "Remove all",
};
const ITEM_SELECTOR = '[role="option"]';

export class DualListbox extends Component<DualListboxOptions> {
  private readonly select: HTMLSelectElement;
  private readonly labels: DualListboxLabels;
  private readonly root = document.createElement("div");
  private readonly available: Pane;
  private readonly chosen: Pane;
  private readonly sortables: Sortable[];

  constructor(target: string | HTMLElement, options: DualListboxOptions = {}) {
    super("duallistbox", target, options);

    if (!(this.element instanceof HTMLSelectElement) || !this.element.multiple) {
      super.destroy();
      throw new Error("AZUI: dual listbox must be initialized on a <select multiple> element.");
    }
    this.select = this.element;
    this.labels = { ...DEFAULT_LABELS, ...options.labels };

    this.root.className = "az-dual-listbox";
    this.available = this.createPane(this.labels.available);
    this.chosen = this.createPane(this.labels.selected);
    this.root.append(this.available.element, this.createActions(), this.chosen.element);
    this.select.after(this.root);
    this.select.hidden = true;

    const group = uniqueId("az-dual-listbox");
    this.sortables = [this.available.list, this.chosen.list].map(
      (list) => new Sortable(list, { group, items: ITEM_SELECTOR }),
    );
    this.render();

    this.listen(this.root, "click", (event) => this.handleClick(event));
    this.listen(this.root, "dblclick", (event) => this.handleDoubleClick(event));
    this.listen(this.root, "input", (event) => this.handleSearch(event));
    this.root.addEventListener("az:sortable:drop", this.handleDrop);
    this.track(() => this.root.removeEventListener("az:sortable:drop", this.handleDrop));
  }

  get values(): string[] {
    return this.itemsOf(this.chosen).map((item) => item.dataset.value ?? "");
  }

  refresh(): void {
    this.render();
  }

  override destroy(): void {
    for (const sortable of this.sortables) sortable.destroy();
    this.root.remove();
    this.select.hidden = false;
    super.destroy();
  }

  private createPane(title: string): Pane {
    const element = document.createElement("div");
    element.className = "az-dual-listbox-pane";

    const heading = document.createElement("span");
    heading.className = "az-dual-listbox-title";
    heading.id = uniqueId("az-dual-listbox-title");
    heading.textContent = title;

    const search = document.createElement("input");
    search.type = "search";
    search.className = "az-control az-control-sm az-dual-listbox-search";
    search.setAttribute("aria-label", this.labels.search.replace("{list}", title));

    const list = document.createElement("ul");
    list.className = "az-dual-listbox-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-multiselectable", "true");
    list.setAttribute("aria-labelledby", heading.id);

    element.append(heading, search, list);

    return { element, list };
  }

  private createActions(): HTMLElement {
    const actions = document.createElement("div");
    actions.className = "az-dual-listbox-actions";
    const buttons: [string, string, string][] = [
      ["add", "›", this.labels.add],
      ["add-all", "»", this.labels.addAll],
      ["remove", "‹", this.labels.remove],
      ["remove-all", "«", this.labels.removeAll],
    ];

    for (const [action, symbol, label] of buttons) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "az-btn az-btn-sm";
      button.dataset.action = action;
      button.textContent = symbol;
      button.setAttribute("aria-label", label);
      button.title = label;
      actions.append(button);
    }

    return actions;
  }

  private render(): void {
    this.available.list.replaceChildren();
    this.chosen.list.replaceChildren();

    [...this.select.options].forEach((option, index) => {
      const item = document.createElement("li");
      item.className = "az-dual-listbox-item";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      item.dataset.value = option.value;
      item.dataset.index = String(index);
      item.textContent = option.label;
      if (option.disabled) item.setAttribute("aria-disabled", "true");

      (option.selected ? this.chosen : this.available).list.append(item);
    });
  }

  private itemsOf(pane: Pane): HTMLElement[] {
    return [...pane.list.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
  }

  private paneOf(item: HTMLElement): Pane {
    return this.chosen.list.contains(item) ? this.chosen : this.available;
  }

  private isDisabled(item: HTMLElement): boolean {
    return item.getAttribute("aria-disabled") === "true";
  }

  private isMovable(item: HTMLElement): boolean {
    return !this.isDisabled(item) && !item.hidden;
  }

  private moveItems(items: HTMLElement[], target: Pane): void {
    const movable = items.filter((item) => this.isMovable(item));
    if (movable.length === 0) return;

    for (const item of movable) {
      item.setAttribute("aria-selected", "false");
      if (target === this.chosen) this.chosen.list.append(item);
      else this.insertInOriginalOrder(item);
      this.applyFilter(target);
    }
    this.commit();
  }

  private insertInOriginalOrder(item: HTMLElement): void {
    const index = Number(item.dataset.index);
    const next = this.itemsOf(this.available).find((other) => Number(other.dataset.index) > index);

    this.available.list.insertBefore(item, next ?? null);
  }

  private applyFilter(pane: Pane): void {
    const query = pane.element.querySelector<HTMLInputElement>(".az-dual-listbox-search")?.value;
    const needle = normalizeText(query ?? "");

    for (const item of this.itemsOf(pane)) {
      item.hidden = !normalizeText(item.textContent ?? "").includes(needle);
    }
  }

  private commit(): void {
    const ordered = this.itemsOf(this.chosen).map((item) => item.dataset.value);
    const byValue = new Map([...this.select.options].map((option) => [option.value, option]));
    const chosenOptions = ordered.flatMap((value) => byValue.get(value ?? "") ?? []);
    const others = [...this.select.options].filter((option) => !chosenOptions.includes(option));

    for (const option of others) option.selected = false;
    for (const option of chosenOptions) option.selected = true;
    this.select.append(...chosenOptions, ...others);
    this.emit("change", { detail: { values: this.values } });
  }

  private readonly handleDrop = (event: Event): void => {
    const item = (event as CustomEvent<{ item: HTMLElement }>).detail.item;
    if (this.isDisabled(item)) {
      event.preventDefault();
      return;
    }

    queueMicrotask(() => {
      this.applyFilter(this.available);
      this.applyFilter(this.chosen);
      this.commit();
    });
  };

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLElement>("[data-action]");
    if (button) {
      this.runAction(button.dataset.action ?? "");
      return;
    }

    const item = event.target.closest<HTMLElement>(ITEM_SELECTOR);
    if (!item || this.isDisabled(item)) return;

    const marked = item.getAttribute("aria-selected") === "true";
    item.setAttribute("aria-selected", String(!marked));
  }

  private handleDoubleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const item = event.target.closest<HTMLElement>(ITEM_SELECTOR);
    if (!item) return;

    const origin = this.paneOf(item);
    this.moveItems([item], origin === this.chosen ? this.available : this.chosen);
  }

  private handleSearch(event: Event): void {
    const field = event.target;
    if (!(field instanceof HTMLInputElement)) return;

    this.applyFilter(this.available.element.contains(field) ? this.available : this.chosen);
  }

  private runAction(action: string): void {
    const marked = (pane: Pane): HTMLElement[] =>
      this.itemsOf(pane).filter((item) => item.getAttribute("aria-selected") === "true");

    if (action === "add") this.moveItems(marked(this.available), this.chosen);
    else if (action === "add-all") this.moveItems(this.itemsOf(this.available), this.chosen);
    else if (action === "remove") this.moveItems(marked(this.chosen), this.available);
    else if (action === "remove-all") this.moveItems(this.itemsOf(this.chosen), this.available);
  }
}
