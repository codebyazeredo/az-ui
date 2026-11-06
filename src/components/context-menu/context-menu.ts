import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import {
  MENU_ITEM_SELECTOR,
  focusMenuItem,
  getMenuItems,
  handleMenuNavigation,
} from "../../javascript/dom/menu";
import { positionAtPoint } from "../../javascript/dom/position";
import { resolveElement } from "../../javascript/dom/resolve-element";

export interface ContextMenuOptions {
  menu: string | HTMLElement;
}

function resolveOptions(
  target: string | HTMLElement,
  options: Partial<ContextMenuOptions>,
): ContextMenuOptions {
  return { menu: resolveElement(target).dataset.azMenu ?? "", ...options };
}

export class ContextMenu extends Component<ContextMenuOptions> {
  private readonly menu: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private removeDismiss: (() => void) | null = null;

  constructor(target: string | HTMLElement, options: Partial<ContextMenuOptions> = {}) {
    super("context-menu", target, resolveOptions(target, options));

    const { menu } = this.options;
    const menuElement =
      typeof menu === "string" && menu ? document.querySelector<HTMLElement>(menu) : menu;
    if (!menuElement || typeof menuElement === "string") {
      throw new Error(`AZUI: context menu "${String(menu)}" was not found.`);
    }
    this.menu = menuElement;

    this.menu.setAttribute("role", "menu");
    this.menu.hidden = true;
    for (const item of this.menu.querySelectorAll(".az-dropdown-item")) {
      item.setAttribute("role", "menuitem");
    }

    this.listen(this.element, "contextmenu", (event) => {
      event.preventDefault();
      const fromKeyboard = event.clientX === 0 && event.clientY === 0;
      const area = this.element.getBoundingClientRect();
      this.show(fromKeyboard ? area.left : event.clientX, fromKeyboard ? area.top : event.clientY);
    });
    this.listen(this.menu, "keydown", (event) => this.handleMenuKey(event));
    this.listen(this.menu, "click", (event) => {
      if (event.target instanceof Element && event.target.closest(MENU_ITEM_SELECTOR)) {
        this.hide();
        this.previousFocus?.focus();
      }
    });
  }

  get isOpen(): boolean {
    return !this.menu.hidden;
  }

  show(x: number, y: number): void {
    if (this.isOpen) this.close();
    if (!this.emit("show", { cancelable: true })) return;

    this.previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.menu.hidden = false;
    positionAtPoint(this.menu, x, y);
    this.removeDismiss = this.track(onDismiss([this.menu], () => this.hide()));
    focusMenuItem(getMenuItems(this.menu), "first");
    this.emit("shown");
  }

  hide(): void {
    if (!this.isOpen || !this.emit("hide", { cancelable: true })) return;

    this.close();
    this.emit("hidden");
  }

  override destroy(): void {
    this.close();
    this.menu.removeAttribute("role");
    for (const item of this.menu.querySelectorAll(".az-dropdown-item")) {
      item.removeAttribute("role");
    }
    super.destroy();
  }

  private close(): void {
    this.menu.hidden = true;
    this.removeDismiss?.();
    this.removeDismiss = null;
  }

  private handleMenuKey(event: KeyboardEvent): void {
    if (handleMenuNavigation(event, getMenuItems(this.menu))) return;

    if (event.key === "Escape") {
      this.hide();
      this.previousFocus?.focus();
    } else if (event.key === "Tab") {
      this.hide();
    }
  }
}
