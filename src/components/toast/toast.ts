import { Component } from "../../javascript/core/component";

export type ToastVariant = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  duration: number;
}

export interface ToastContent {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  closeLabel?: string;
}

const DEFAULT_TOAST_OPTIONS: ToastOptions = { duration: 5000 };
const CONTAINER_CLASS = "az-toast-container";

function getContainer(): HTMLElement {
  const existing = document.querySelector<HTMLElement>(`.${CONTAINER_CLASS}`);
  if (existing) return existing;

  const container = document.createElement("div");
  container.className = CONTAINER_CLASS;
  document.body.append(container);

  return container;
}

function createToastElement(content: ToastContent): HTMLElement {
  const variant = content.variant ?? "info";
  const element = document.createElement("div");
  element.className = `az-toast az-toast-${variant}`;
  element.setAttribute("role", variant === "danger" ? "alert" : "status");

  const text = document.createElement("div");
  text.className = "az-toast-content";
  if (content.title) {
    const title = document.createElement("p");
    title.className = "az-toast-title";
    title.textContent = content.title;
    text.append(title);
  }
  const message = document.createElement("p");
  message.className = "az-toast-message";
  message.textContent = content.message;
  text.append(message);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "az-toast-close";
  close.setAttribute("data-az-dismiss", "");
  close.setAttribute("aria-label", content.closeLabel ?? "Close");
  close.textContent = "×";

  element.append(text, close);

  return element;
}

export class Toast extends Component<ToastOptions> {
  private timer: number | undefined;

  static show(content: ToastContent): Toast {
    const element = createToastElement(content);
    element.hidden = true;
    getContainer().append(element);

    const toast = new Toast(
      element,
      content.duration === undefined ? {} : { duration: content.duration },
    );
    toast.show();

    return toast;
  }

  constructor(target: string | HTMLElement, options: Partial<ToastOptions> = {}) {
    super("toast", target, { ...DEFAULT_TOAST_OPTIONS, ...options });

    this.listen(this.element, "click", (event) => {
      if (event.target instanceof Element && event.target.closest("[data-az-dismiss]")) this.hide();
    });
    this.listen(this.element, "mouseenter", () => this.stopTimer());
    this.listen(this.element, "mouseleave", () => this.startTimer());
    this.listen(this.element, "focusin", () => this.stopTimer());
    this.listen(this.element, "focusout", () => this.startTimer());
  }

  show(): void {
    if (!this.element.hidden || !this.emit("show", { cancelable: true })) return;

    this.element.hidden = false;
    this.startTimer();
    this.emit("shown");
  }

  hide(): void {
    if (this.element.hidden || !this.emit("hide", { cancelable: true })) return;

    this.stopTimer();
    this.element.hidden = true;
    this.emit("hidden");
    this.destroy();
    this.element.remove();
  }

  private startTimer(): void {
    this.stopTimer();
    if (this.options.duration > 0) {
      this.timer = window.setTimeout(() => this.hide(), this.options.duration);
    }
  }

  private stopTimer(): void {
    window.clearTimeout(this.timer);
    this.timer = undefined;
  }

  override destroy(): void {
    this.stopTimer();
    super.destroy();
  }
}
