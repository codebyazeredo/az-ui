import { Component } from "../../javascript/core/component";
import { onDismiss } from "../../javascript/dom/dismiss";
import { focusMenuItem, handleMenuNavigation } from "../../javascript/dom/menu";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { ensureId } from "../../javascript/dom/unique-id";

export interface SelectOptions {
  placeholder: string;
}

interface ListedOption {
  node: HTMLElement;
  option: HTMLOptionElement;
}

const SIZE_CLASSES = ["az-control-sm", "az-control-lg"];
const FORWARDED_ATTRIBUTES = ["aria-invalid", "aria-describedby"];

function resolveOptions(target: string | HTMLElement, options: Partial<SelectOptions>) {
  const { azPlaceholder = "" } = resolveElement(target).dataset;

  return { placeholder: azPlaceholder, ...options };
}

function createElement(tag: string, className: string, text = ""): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;

  return element;
}

export class Select extends Component<SelectOptions> {
  private readonly native: HTMLSelectElement;
  private readonly wrapper = createElement("div", "az-select-wrap");
  private readonly trigger = document.createElement("button");
  private readonly menu = createElement("div", "az-select-menu");
  private listed: ListedOption[] = [];
  private removeDismiss: (() => void) | null = null;

  constructor(target: string | HTMLElement, options: Partial<SelectOptions> = {}) {
    super("select", target, resolveOptions(target, options));

    if (!(this.element instanceof HTMLSelectElement)) {
      super.destroy();
      throw new Error("AZUI: select must be initialized on a <select> element.");
    }
    this.native = this.element;

    this.build();
    this.listen(this.trigger, "click", () => this.toggle());
    this.listen(this.trigger, "keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      this.show();
    });
    this.listen(this.menu, "click", (event) => this.handleMenuClick(event));
    this.listen(this.menu, "keydown", (event) => this.handleMenuKey(event));
    this.listen(this.native, "focus", () => this.trigger.focus());
    this.listen(this.native, "change", () => this.update());
    if (this.native.form) {
      this.listen(this.native.form, "reset", () => window.setTimeout(() => this.update()));
    }
  }

  get isOpen(): boolean {
    return !this.menu.hidden;
  }

  get value(): string | string[] {
    return this.native.multiple
      ? [...this.native.selectedOptions].map((option) => option.value)
      : this.native.value;
  }

  show(): void {
    if (this.isOpen || this.native.disabled || !this.emit("show", { cancelable: true })) return;

    this.menu.hidden = false;
    this.trigger.setAttribute("aria-expanded", "true");
    this.removeDismiss = this.track(onDismiss([this.wrapper], () => this.hide()));
    const items = this.enabledNodes();
    focusMenuItem(
      items,
      Math.max(
        0,
        items.findIndex((node) => node.getAttribute("aria-selected") === "true"),
      ),
    );
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

  refresh(): void {
    this.build();
  }

  override destroy(): void {
    this.close();
    this.wrapper.replaceWith(this.native);
    this.native.classList.remove("az-select-native");
    this.native.removeAttribute("tabindex");
    this.native.removeAttribute("aria-hidden");
    super.destroy();
  }

  private build(): void {
    const { native, trigger, menu } = this;
    if (!this.wrapper.isConnected) {
      native.before(this.wrapper);
      this.wrapper.append(native, trigger, menu);
      menu.hidden = true;
    }
    native.classList.add("az-select-native");
    native.tabIndex = -1;
    native.setAttribute("aria-hidden", "true");

    this.buildTrigger();
    this.buildMenu();
    this.update();
  }

  private buildTrigger(): void {
    const { native, trigger, menu } = this;
    const sizeClasses = SIZE_CLASSES.filter((name) => native.classList.contains(name));
    trigger.type = "button";
    trigger.className = ["az-control", "az-select", "az-select-trigger", ...sizeClasses].join(" ");
    trigger.disabled = native.disabled;
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", String(this.isOpen));
    trigger.setAttribute("aria-controls", ensureId(menu, "az-select-menu"));

    for (const name of FORWARDED_ATTRIBUTES) {
      const value = native.getAttribute(name);
      if (value === null) trigger.removeAttribute(name);
      else trigger.setAttribute(name, value);
    }

    const label = native.labels?.[0];
    if (label) {
      trigger.setAttribute(
        "aria-labelledby",
        `${ensureId(label, "az-label")} ${ensureId(trigger, "az-select-trigger")}`,
      );
      menu.setAttribute("aria-labelledby", label.id);
    }
  }

  private buildMenu(): void {
    this.menu.setAttribute("role", "listbox");
    if (this.native.multiple) this.menu.setAttribute("aria-multiselectable", "true");
    else this.menu.removeAttribute("aria-multiselectable");

    this.listed = [...this.native.options]
      .filter((option) => !this.isPlaceholder(option))
      .map((option) => {
        const node = createElement("div", "az-select-option", option.text);
        node.setAttribute("role", "option");
        node.tabIndex = -1;
        if (option.disabled) node.setAttribute("aria-disabled", "true");

        return { node, option };
      });
    this.menu.replaceChildren(...this.listed.map(({ node }) => node));
  }

  private update(): void {
    for (const { node, option } of this.listed) {
      node.setAttribute("aria-selected", String(option.selected));
    }
    this.trigger.replaceChildren(...this.createValueNodes());
  }

  private createValueNodes(): HTMLElement[] {
    const selected = this.listed.filter(({ option }) => option.selected);

    if (selected.length === 0) {
      return [createElement("span", "az-select-placeholder", this.resolvePlaceholder() || " ")];
    }
    if (!this.native.multiple) {
      return [createElement("span", "az-select-value", selected[0]?.option.text)];
    }

    return selected.map(({ option }) => createElement("span", "az-select-chip", option.text));
  }

  private resolvePlaceholder(): string {
    const placeholderOption = [...this.native.options].find((option) => this.isPlaceholder(option));

    return this.options.placeholder || placeholderOption?.text || "";
  }

  private isPlaceholder(option: HTMLOptionElement): boolean {
    return option.value === "" && option.disabled;
  }

  private enabledNodes(): HTMLElement[] {
    return this.listed.filter(({ option }) => !option.disabled).map(({ node }) => node);
  }

  private close(): void {
    this.menu.hidden = true;
    this.trigger.setAttribute("aria-expanded", "false");
    this.removeDismiss?.();
    this.removeDismiss = null;
  }

  private handleMenuClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const node = event.target.closest<HTMLElement>(".az-select-option");
    const listed = this.listed.find((candidate) => candidate.node === node);
    if (listed) this.choose(listed.option);
  }

  private handleMenuKey(event: KeyboardEvent): void {
    if (handleMenuNavigation(event, this.enabledNodes())) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const listed = this.listed.find(({ node }) => node === document.activeElement);
      if (listed) this.choose(listed.option);
    } else if (event.key === "Escape") {
      this.hide();
      this.trigger.focus();
    } else if (event.key === "Tab") {
      this.hide();
    }
  }

  private choose(option: HTMLOptionElement): void {
    if (option.disabled) return;

    option.selected = this.native.multiple ? !option.selected : true;
    this.update();
    this.native.dispatchEvent(new Event("change", { bubbles: true }));
    this.emit("change", { detail: { value: this.value } });

    if (!this.native.multiple) {
      this.hide();
      this.trigger.focus();
    }
  }
}
