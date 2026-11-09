import { Component } from "../../javascript/core/component";

export type StepState = "pending" | "complete" | "error";

const STEP_SELECTOR = ".az-stepper-step";
const PANEL_SELECTOR = ".az-stepper-panel";

export class Stepper extends Component {
  private readonly steps: HTMLElement[];
  private readonly panels: HTMLElement[];
  private position = 0;

  constructor(target: string | HTMLElement) {
    super("stepper", target, {});

    this.steps = [...this.element.querySelectorAll<HTMLElement>(STEP_SELECTOR)];
    this.panels = [...this.element.querySelectorAll<HTMLElement>(PANEL_SELECTOR)];
    if (this.steps.length === 0) {
      throw new Error("AZUI: stepper requires at least one .az-stepper-step.");
    }
    if (this.panels.length > 0 && this.panels.length !== this.steps.length) {
      throw new Error(
        "AZUI: stepper requires the same number of .az-stepper-step and .az-stepper-panel.",
      );
    }

    const initial = this.steps.findIndex((step) => step.getAttribute("aria-current") === "step");
    this.position = Math.max(initial, 0);
    for (const step of this.steps) {
      if (!step.dataset.state) step.dataset.state = "pending";
    }
    this.render();
  }

  get current(): number {
    return this.position;
  }

  go(index: number): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= this.steps.length) return false;
    if (index === this.position) return false;
    if (!this.emit("change", { cancelable: true, detail: { from: this.position, to: index } })) {
      return false;
    }

    this.position = index;
    this.render();

    return true;
  }

  next(): boolean {
    return this.go(this.position + 1);
  }

  previous(): boolean {
    return this.go(this.position - 1);
  }

  setState(index: number, state: StepState): void {
    const step = this.steps[index];
    if (step) step.dataset.state = state;
  }

  override destroy(): void {
    for (const step of this.steps) {
      step.removeAttribute("aria-current");
      delete step.dataset.state;
    }
    for (const panel of this.panels) panel.hidden = false;
    super.destroy();
  }

  private render(): void {
    this.steps.forEach((step, index) => {
      if (index === this.position) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    this.panels.forEach((panel, index) => {
      panel.hidden = index !== this.position;
    });
  }
}
