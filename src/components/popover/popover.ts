import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import { isPlacement, positionFloating } from "../../javascript/dom/position";
import type { Placement } from "../../javascript/dom/position";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { ensureId } from "../../javascript/dom/unique-id";

export interface PopoverOptions {
  target: string | HTMLElement;
  placement: Placement;
}

function resolveOptions(
  trigger: string | HTMLElement,
  options: Partial<PopoverOptions>,
): PopoverOptions {
  const { azTarget = "", azPlacement } = resolveElement(trigger).dataset;

  return {
    target: azTarget,
    placement: isPlacement(azPlacement) ? azPlacement : "bottom",
    ...options,
  };
}

export class Popover extends Component<PopoverOptions> {
  private readonly popover: HTMLElement;
  private removeDismiss: (() => void) | null = null;

  constructor(trigger: string | HTMLElement, options: Partial<PopoverOptions> = {}) {
    super("popover", trigger, resolveOptions(trigger, options));

    const { target } = this.options;
    const popover =
      typeof target === "string" && target ? document.querySelector<HTMLElement>(target) : target;
    if (!popover || typeof popover === "string") {
      throw new Error(`AZUI: popover content "${String(target)}" was not found.`);
    }
    this.popover = popover;

    this.element.setAttribute("aria-expanded", "false");
    this.element.setAttribute("aria-controls", ensureId(this.popover, "az-popover"));
    this.popover.setAttribute("role", "dialog");
    this.popover.tabIndex = -1;
    this.popover.hidden = true;
    const title = this.popover.querySelector<HTMLElement>(".az-popover-title");
    if (title) this.popover.setAttribute("aria-labelledby", ensureId(title, "az-popover-title"));

    this.listen(this.element, "click", () => this.toggle());
    this.listen(this.popover, "keydown", (event) => {
      if (event.key !== "Escape") return;
      this.hide();
      this.element.focus();
    });
  }

  get isOpen(): boolean {
    return !this.popover.hidden;
  }

  show(): void {
    if (this.isOpen || !this.emit("show", { cancelable: true })) return;

    this.popover.hidden = false;
    positionFloating(this.popover, this.element, this.options.placement);
    this.element.setAttribute("aria-expanded", "true");
    this.removeDismiss = this.track(onDismiss([this.element, this.popover], () => this.hide()));
    this.popover.focus();
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
    this.element.removeAttribute("aria-expanded");
    this.element.removeAttribute("aria-controls");
    for (const attribute of ["role", "tabindex", "aria-labelledby"]) {
      this.popover.removeAttribute(attribute);
    }
    super.destroy();
  }

  private close(): void {
    this.popover.hidden = true;
    this.element.setAttribute("aria-expanded", "false");
    this.removeDismiss?.();
    this.removeDismiss = null;
  }
}
