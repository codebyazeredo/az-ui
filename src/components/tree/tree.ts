import { Component } from "../../javascript/core/component";

const ITEM_SELECTOR = ".az-tree-item";
const LABEL_SELECTOR = ".az-tree-label";
const TOGGLE_CLASS = "az-tree-toggle";

export class Tree extends Component {
  private selectedItem: HTMLElement | null = null;

  constructor(target: string | HTMLElement) {
    super("tree", target, {});

    this.element.setAttribute("role", "tree");
    for (const item of this.allItems()) {
      item.setAttribute("role", "treeitem");
      item.tabIndex = -1;

      const group = this.groupOf(item);
      if (!group) continue;

      group.setAttribute("role", "group");
      this.applyExpanded(item, item.getAttribute("aria-expanded") === "true");
      item.prepend(this.createToggle());
    }

    const initial = this.element.querySelector<HTMLElement>('[role="treeitem"][aria-selected="true"]');
    if (initial) this.selectedItem = initial;
    (this.selectedItem ?? this.visibleItems()[0])?.setAttribute("tabindex", "0");

    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.listen(this.element, "keydown", (event) => this.handleKey(event));
  }

  get selected(): HTMLElement | null {
    return this.selectedItem;
  }

  expand(item: HTMLElement): void {
    this.setExpanded(item, true);
  }

  collapse(item: HTMLElement): void {
    this.setExpanded(item, false);
  }

  select(item: HTMLElement): void {
    if (item === this.selectedItem) return;

    this.selectedItem?.setAttribute("aria-selected", "false");
    item.setAttribute("aria-selected", "true");
    this.selectedItem = item;
    this.emit("select", { detail: { item } });
  }

  override destroy(): void {
    this.element.removeAttribute("role");
    for (const toggle of this.element.querySelectorAll(`.${TOGGLE_CLASS}`)) toggle.remove();
    for (const item of this.allItems()) {
      for (const attribute of ["role", "tabindex", "aria-expanded", "aria-selected"]) {
        item.removeAttribute(attribute);
      }
      const group = this.groupOf(item);
      if (group) {
        group.removeAttribute("role");
        group.hidden = false;
      }
    }
    super.destroy();
  }

  private allItems(): HTMLElement[] {
    return [...this.element.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
  }

  private groupOf(item: HTMLElement): HTMLElement | null {
    return item.querySelector<HTMLElement>(":scope > ul");
  }

  private parentOf(item: HTMLElement): HTMLElement | null {
    return item.parentElement?.closest<HTMLElement>(ITEM_SELECTOR) ?? null;
  }

  private isExpanded(item: HTMLElement): boolean {
    return item.getAttribute("aria-expanded") === "true";
  }

  private visibleItems(): HTMLElement[] {
    return this.allItems().filter((item) => {
      for (let ancestor = this.parentOf(item); ancestor; ancestor = this.parentOf(ancestor)) {
        if (!this.isExpanded(ancestor)) return false;
      }
      return true;
    });
  }

  private createToggle(): HTMLElement {
    const toggle = document.createElement("span");
    toggle.className = TOGGLE_CLASS;
    toggle.setAttribute("aria-hidden", "true");

    return toggle;
  }

  private applyExpanded(item: HTMLElement, expanded: boolean): void {
    item.setAttribute("aria-expanded", String(expanded));
    const group = this.groupOf(item);
    if (group) group.hidden = !expanded;
  }

  private setExpanded(item: HTMLElement, expanded: boolean): void {
    if (!this.groupOf(item) || this.isExpanded(item) === expanded) return;

    this.applyExpanded(item, expanded);
    this.emit("toggle", { detail: { item, expanded } });
  }

  private focusItem(item: HTMLElement): void {
    for (const other of this.allItems()) other.tabIndex = -1;
    item.tabIndex = 0;
    item.focus();
  }

  private itemFrom(target: EventTarget | null): HTMLElement | null {
    return target instanceof Element ? target.closest<HTMLElement>(ITEM_SELECTOR) : null;
  }

  private handleClick(event: MouseEvent): void {
    const item = this.itemFrom(event.target);
    if (!item || !(event.target instanceof Element)) return;

    if (event.target.closest(`.${TOGGLE_CLASS}`)) {
      this.setExpanded(item, !this.isExpanded(item));
      this.focusItem(item);
    } else if (event.target.closest(LABEL_SELECTOR)) {
      this.select(item);
      this.focusItem(item);
    }
  }

  private handleKey(event: KeyboardEvent): void {
    const item = this.itemFrom(event.target);
    if (!item || event.target !== item) return;

    const rtl = this.element.closest("[dir]")?.getAttribute("dir") === "rtl";
    const openKey = rtl ? "ArrowLeft" : "ArrowRight";
    const closeKey = rtl ? "ArrowRight" : "ArrowLeft";
    const visible = this.visibleItems();
    const position = visible.indexOf(item);
    const hasChildren = this.groupOf(item) !== null;

    let next: HTMLElement | null | undefined;
    if (event.key === "ArrowDown") next = visible[position + 1];
    else if (event.key === "ArrowUp") next = visible[position - 1];
    else if (event.key === "Home") next = visible[0];
    else if (event.key === "End") next = visible[visible.length - 1];
    else if (event.key === openKey && hasChildren) {
      if (!this.isExpanded(item)) this.setExpanded(item, true);
      else next = visible[position + 1];
    } else if (event.key === closeKey) {
      if (hasChildren && this.isExpanded(item)) this.setExpanded(item, false);
      else next = this.parentOf(item);
    } else if (event.key === "Enter" || event.key === " ") this.select(item);
    else return;

    event.preventDefault();
    if (next) this.focusItem(next);
  }
}
