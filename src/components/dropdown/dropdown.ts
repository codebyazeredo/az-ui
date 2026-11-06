import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import { ensureId } from "../../javascript/dom/unique-id";

const ITEM_SELECTOR = '.az-dropdown-item:not(:disabled):not([aria-disabled="true"])';

export class Dropdown extends Component {
  private readonly toggleButton: HTMLElement;
  private readonly menu: HTMLElement;
  private removeDismiss: (() => void) | null = null;

  constructor(target: string | HTMLElement) {
    super("dropdown", target, {});

    const toggleButton = this.element.querySelector<HTMLElement>(".az-dropdown-toggle");
    const menu = this.element.querySelector<HTMLElement>(".az-dropdown-menu");
    if (!toggleButton || !menu) {
      throw new Error("AZUI: dropdown requires .az-dropdown-toggle and .az-dropdown-menu.");
    }
    this.toggleButton = toggleButton;
    this.menu = menu;

    this.toggleButton.setAttribute("aria-haspopup", "menu");
    this.toggleButton.setAttribute("aria-expanded", "false");
    this.toggleButton.setAttribute("aria-controls", ensureId(this.menu, "az-dropdown-menu"));
    this.menu.setAttribute("role", "menu");
    this.menu.hidden = true;
    for (const item of this.menu.querySelectorAll(".az-dropdown-item")) {
      item.setAttribute("role", "menuitem");
    }

    this.listen(this.toggleButton, "click", () => this.toggle());
    this.listen(this.toggleButton, "keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      this.show();
      this.focusItem(event.key === "ArrowDown" ? "first" : "last");
    });
    this.listen(this.menu, "keydown", (event) => this.handleMenuKey(event));
    this.listen(this.menu, "click", (event) => {
      if (event.target instanceof Element && event.target.closest(ITEM_SELECTOR)) {
        this.hide();
        this.toggleButton.focus();
      }
    });
  }

  get isOpen(): boolean {
    return !this.menu.hidden;
  }

  show(): void {
    if (this.isOpen || !this.emit("show", { cancelable: true })) return;

    this.menu.hidden = false;
    this.toggleButton.setAttribute("aria-expanded", "true");
    this.removeDismiss = this.track(onDismiss([this.element], () => this.hide()));
    this.emit("shown");
  }

  hide(): void {
    if (!this.isOpen || !this.emit("hide", { cancelable: true })) return;

    this.close();
    this.emit("hidden");
  }

  toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  override destroy(): void {
    this.close();
    for (const attribute of ["aria-haspopup", "aria-expanded", "aria-controls"]) {
      this.toggleButton.removeAttribute(attribute);
    }
    this.menu.removeAttribute("role");
    for (const item of this.menu.querySelectorAll(".az-dropdown-item")) {
      item.removeAttribute("role");
    }
    super.destroy();
  }

  private close(): void {
    this.menu.hidden = true;
    this.toggleButton.setAttribute("aria-expanded", "false");
    this.removeDismiss?.();
    this.removeDismiss = null;
  }

  private getItems(): HTMLElement[] {
    return [...this.menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
  }

  private focusItem(position: "first" | "last" | number): void {
    const items = this.getItems();
    const index = position === "first" ? 0 : position === "last" ? items.length - 1 : position;
    items[index]?.focus();
  }

  private handleMenuKey(event: KeyboardEvent): void {
    const items = this.getItems();
    const current = items.findIndex((item) => item === document.activeElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusItem((current + 1) % items.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusItem((current - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        this.focusItem("first");
        break;
      case "End":
        event.preventDefault();
        this.focusItem("last");
        break;
      case "Escape":
        this.hide();
        this.toggleButton.focus();
        break;
      case "Tab":
        this.hide();
        break;
    }
  }
}
