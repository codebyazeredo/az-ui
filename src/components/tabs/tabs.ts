import { Component } from "../../javascript/core/component";
import { ensureId } from "../../javascript/dom/unique-id";

export class Tabs extends Component {
  private readonly tabs: HTMLElement[];
  private readonly panels: HTMLElement[];
  private current = 0;

  constructor(target: string | HTMLElement) {
    super("tabs", target, {});

    this.tabs = [...this.element.querySelectorAll<HTMLElement>(".az-tabs-tab")];
    this.panels = [...this.element.querySelectorAll<HTMLElement>(".az-tabs-panel")];
    if (this.tabs.length === 0 || this.tabs.length !== this.panels.length) {
      throw new Error("AZUI: tabs requires the same number of .az-tabs-tab and .az-tabs-panel.");
    }

    this.element.querySelector(".az-tabs-list")?.setAttribute("role", "tablist");
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];
      if (!panel) return;

      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", ensureId(panel, "az-tabs-panel"));
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", ensureId(tab, "az-tabs-tab"));
      this.listen(tab, "click", () => this.select(index));
      this.listen(tab, "keydown", (event) => this.handleKey(event, index));
    });

    const initial = this.tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    this.activate(Math.max(initial, 0));
  }

  get selectedIndex(): number {
    return this.current;
  }

  select(index: number): void {
    if (index === this.current || index < 0 || index >= this.tabs.length) return;

    this.activate(index);
    this.emit("change", { detail: { index } });
  }

  override destroy(): void {
    this.element.querySelector(".az-tabs-list")?.removeAttribute("role");
    for (const tab of this.tabs) {
      for (const attribute of ["role", "aria-controls", "aria-selected", "tabindex"]) {
        tab.removeAttribute(attribute);
      }
    }
    for (const panel of this.panels) {
      for (const attribute of ["role", "aria-labelledby"]) panel.removeAttribute(attribute);
      panel.hidden = false;
    }
    super.destroy();
  }

  private activate(index: number): void {
    this.current = index;
    this.tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = this.panels[tabIndex];
      if (panel) panel.hidden = !selected;
    });
  }

  private handleKey(event: KeyboardEvent, index: number): void {
    const last = this.tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;

    event.preventDefault();
    this.select(next);
    this.tabs[next]?.focus();
  }
}
