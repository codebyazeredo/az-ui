import { getFocusable, trapTabKey } from "../dom/focus";
import { lockScroll } from "../dom/scroll-lock";
import { ensureId } from "../dom/unique-id";
import { Component } from "./component";

export interface OverlayOptions {
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
}

const DEFAULT_OVERLAY_OPTIONS: OverlayOptions = { closeOnBackdrop: true, closeOnEscape: true };

export abstract class Overlay extends Component<OverlayOptions> {
  private readonly panel: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private releaseScroll: (() => void) | null = null;

  protected constructor(
    name: string,
    target: string | HTMLElement,
    panelSelector: string,
    options: Partial<OverlayOptions> = {},
  ) {
    super(name, target, { ...DEFAULT_OVERLAY_OPTIONS, ...options });

    const panel = this.element.querySelector<HTMLElement>(panelSelector);
    if (!panel) throw new Error(`AZUI: ${name} requires an element matching "${panelSelector}".`);
    this.panel = panel;

    this.panel.setAttribute("role", "dialog");
    this.panel.setAttribute("aria-modal", "true");
    this.panel.tabIndex = -1;
    const title = this.element.querySelector<HTMLElement>(`.az-${name}-title`);
    if (title) this.panel.setAttribute("aria-labelledby", ensureId(title, `az-${name}-title`));
    this.element.hidden = true;

    this.listen(this.element, "click", (event) => {
      const target = event.target;
      const isBackdrop = target === this.element && this.options.closeOnBackdrop;
      const isDismiss = target instanceof Element && target.closest("[data-az-dismiss]") !== null;
      if (isBackdrop || isDismiss) this.hide();
    });
    this.listen(this.element, "keydown", (event) => {
      if (event.key === "Escape" && this.options.closeOnEscape) this.hide();
      trapTabKey(event, this.panel);
    });
  }

  get isOpen(): boolean {
    return !this.element.hidden;
  }

  show(): void {
    if (this.isOpen || !this.emit("show", { cancelable: true })) return;

    this.previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.element.hidden = false;
    this.releaseScroll = lockScroll();
    (getFocusable(this.panel)[0] ?? this.panel).focus();
    this.emit("shown");
  }

  hide(): void {
    if (!this.isOpen || !this.emit("hide", { cancelable: true })) return;

    this.close();
    this.previousFocus?.focus();
    this.emit("hidden");
  }

  toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  override destroy(): void {
    if (this.isOpen) this.close();
    for (const attribute of ["role", "aria-modal", "aria-labelledby", "tabindex"]) {
      this.panel.removeAttribute(attribute);
    }
    super.destroy();
  }

  private close(): void {
    this.element.hidden = true;
    this.releaseScroll?.();
    this.releaseScroll = null;
  }
}
