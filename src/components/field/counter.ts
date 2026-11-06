import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";

export interface CounterOptions {
  target: string | HTMLElement;
}

function resolveOptions(
  field: string | HTMLElement,
  options: Partial<CounterOptions>,
): CounterOptions {
  const { azTarget = "" } = resolveElement(field).dataset;

  return { target: azTarget, ...options };
}

export class Counter extends Component<CounterOptions> {
  private readonly field: HTMLInputElement | HTMLTextAreaElement;
  private readonly output: HTMLElement;

  constructor(field: string | HTMLElement, options: Partial<CounterOptions> = {}) {
    super("counter", field, resolveOptions(field, options));

    const isTextField =
      this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement;
    if (!isTextField || this.element.maxLength < 0) {
      super.destroy();
      throw new Error("AZUI: counter requires an <input> or <textarea> with a maxlength.");
    }
    this.field = this.element;
    this.output = resolveElement(this.options.target);

    this.listen(this.field, "input", () => this.update());
    this.update();
  }

  private update(): void {
    this.output.textContent = `${this.field.value.length} / ${this.field.maxLength}`;
  }
}
