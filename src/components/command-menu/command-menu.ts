import { Overlay } from "../../javascript/core/overlay";
import type { OverlayOptions } from "../../javascript/core/overlay";
import { ensureId } from "../../javascript/dom/unique-id";

export interface CommandMenuOptions extends OverlayOptions {
  shortcut: string | null;
}

const ITEM_SELECTOR = ".az-command-menu-item";

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export class CommandMenu extends Overlay {
  private readonly input: HTMLInputElement;
  private readonly list: HTMLElement;
  private readonly empty: HTMLElement | null;
  private readonly shortcut: string | null;
  private activeItem: HTMLElement | null = null;

  constructor(target: string | HTMLElement, options: Partial<CommandMenuOptions> = {}) {
    const { shortcut = "k", ...overlayOptions } = options;
    super("command-menu", target, ".az-command-menu-panel", overlayOptions);

    const input = this.element.querySelector<HTMLInputElement>(".az-command-menu-input");
    const list = this.element.querySelector<HTMLElement>(".az-command-menu-list");
    if (!input || !list) {
      throw new Error(
        "AZUI: command menu requires .az-command-menu-input and .az-command-menu-list.",
      );
    }
    this.input = input;
    this.list = list;
    this.empty = this.element.querySelector<HTMLElement>(".az-command-menu-empty");
    this.shortcut = shortcut;

    this.input.setAttribute("role", "combobox");
    this.input.setAttribute("aria-expanded", "true");
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-controls", ensureId(this.list, "az-command-menu-list"));
    this.list.setAttribute("role", "listbox");
    for (const item of this.getItems()) {
      ensureId(item, "az-command-menu-item");
      item.setAttribute("role", "option");
    }

    this.listen(this.input, "input", () => this.filter());
    this.listen(this.input, "keydown", (event) => this.handleInputKey(event));
    this.listen(this.list, "click", (event) => {
      const item =
        event.target instanceof Element ? event.target.closest<HTMLElement>(ITEM_SELECTOR) : null;
      if (item) this.choose(item);
    });
    this.listenOnDocument("keydown", (event) => {
      if (
        this.shortcut &&
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === this.shortcut
      ) {
        event.preventDefault();
        this.toggle();
      }
    });
  }

  override show(): void {
    if (this.isOpen) return;

    this.input.value = "";
    this.filter();
    super.show();
  }

  override destroy(): void {
    for (const attribute of [
      "role",
      "aria-expanded",
      "aria-autocomplete",
      "aria-controls",
      "aria-activedescendant",
    ]) {
      this.input.removeAttribute(attribute);
    }
    this.list.removeAttribute("role");
    for (const item of this.getItems()) {
      item.removeAttribute("role");
      item.removeAttribute("aria-selected");
      item.hidden = false;
    }
    super.destroy();
  }

  private getItems(): HTMLElement[] {
    return [...this.list.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
  }

  private getVisibleItems(): HTMLElement[] {
    return this.getItems().filter((item) => !item.hidden);
  }

  private filter(): void {
    const query = normalize(this.input.value.trim());
    for (const item of this.getItems()) {
      item.hidden = !normalize(item.textContent ?? "").includes(query);
    }

    const visible = this.getVisibleItems();
    if (this.empty) this.empty.hidden = visible.length > 0;
    this.setActive(visible[0] ?? null);
  }

  private setActive(item: HTMLElement | null): void {
    for (const candidate of this.getItems()) {
      candidate.setAttribute("aria-selected", String(candidate === item));
    }
    this.activeItem = item;
    if (item) this.input.setAttribute("aria-activedescendant", item.id);
    else this.input.removeAttribute("aria-activedescendant");
    item?.scrollIntoView?.({ block: "nearest" });
  }

  private handleInputKey(event: KeyboardEvent): void {
    const visible = this.getVisibleItems();
    const current = this.activeItem ? visible.indexOf(this.activeItem) : -1;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (visible.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      this.setActive(visible[(current + step + visible.length) % visible.length] ?? null);
    } else if (event.key === "Enter" && this.activeItem) {
      event.preventDefault();
      this.activeItem.click();
    }
  }

  private choose(item: HTMLElement): void {
    this.emit("select", {
      detail: { command: item.dataset.azCommand ?? "", label: item.textContent?.trim() ?? "" },
    });
    this.hide();
  }
}
