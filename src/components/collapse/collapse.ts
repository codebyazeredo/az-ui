import { Component } from "../../javascript/core/component";
import { ensureId } from "../../javascript/dom/unique-id";

export interface CollapseOptions {
  open?: boolean;
}

export class Collapse extends Component<CollapseOptions> {
  constructor(target: string | HTMLElement, options: CollapseOptions = {}) {
    super("collapse", target, options);

    ensureId(this.element, "az-collapse");
    if (this.options.open !== undefined) this.element.hidden = !this.options.open;
    this.syncTriggers();
  }

  get isOpen(): boolean {
    return !this.element.hidden;
  }

  show(): void {
    if (this.isOpen || !this.emit("show", { cancelable: true })) return;

    this.element.hidden = false;
    this.syncTriggers();
    this.emit("shown");
  }

  hide(): void {
    if (!this.isOpen || !this.emit("hide", { cancelable: true })) return;

    this.element.hidden = true;
    this.syncTriggers();
    this.emit("hidden");
  }

  toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  override destroy(): void {
    for (const trigger of this.triggers()) {
      trigger.removeAttribute("aria-expanded");
      trigger.removeAttribute("aria-controls");
    }
    super.destroy();
  }

  private triggers(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(
      `[data-az-toggle="collapse"][data-az-target="#${this.element.id}"]`,
    );
  }

  private syncTriggers(): void {
    for (const trigger of this.triggers()) {
      trigger.setAttribute("aria-expanded", String(this.isOpen));
      trigger.setAttribute("aria-controls", this.element.id);
    }
  }
}
