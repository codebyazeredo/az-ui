import { Component } from "../../javascript/core/component";
import { isPlacement, positionFloating } from "../../javascript/dom/position";
import type { Placement } from "../../javascript/dom/position";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { uniqueId } from "../../javascript/dom/unique-id";

export interface TooltipOptions {
  content: string;
  placement: Placement;
}

function resolveOptions(
  target: string | HTMLElement,
  options: Partial<TooltipOptions>,
): TooltipOptions {
  const { azContent = "", azPlacement } = resolveElement(target).dataset;

  return {
    content: azContent,
    placement: isPlacement(azPlacement) ? azPlacement : "top",
    ...options,
  };
}

export class Tooltip extends Component<TooltipOptions> {
  private tooltip: HTMLElement | null = null;

  constructor(target: string | HTMLElement, options: Partial<TooltipOptions> = {}) {
    super("tooltip", target, resolveOptions(target, options));

    this.listen(this.element, "mouseenter", () => this.show());
    this.listen(this.element, "focus", () => this.show());
    this.listen(this.element, "mouseleave", () => this.hide());
    this.listen(this.element, "blur", () => this.hide());
    this.listen(this.element, "keydown", (event) => {
      if (event.key === "Escape") this.hide();
    });
  }

  get isOpen(): boolean {
    return this.tooltip !== null;
  }

  show(): void {
    if (this.isOpen || !this.options.content || !this.emit("show", { cancelable: true })) return;

    const tooltip = document.createElement("div");
    tooltip.className = "az-tooltip";
    tooltip.id = uniqueId("az-tooltip");
    tooltip.setAttribute("role", "tooltip");
    tooltip.textContent = this.options.content;
    document.body.append(tooltip);

    this.element.setAttribute("aria-describedby", tooltip.id);
    positionFloating(tooltip, this.element, this.options.placement);
    this.tooltip = tooltip;
    this.emit("shown");
  }

  hide(): void {
    if (!this.tooltip || !this.emit("hide", { cancelable: true })) return;

    this.remove();
    this.emit("hidden");
  }

  override destroy(): void {
    this.remove();
    super.destroy();
  }

  private remove(): void {
    this.tooltip?.remove();
    this.tooltip = null;
    this.element.removeAttribute("aria-describedby");
  }
}
