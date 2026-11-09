import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { parseIsoDate } from "./calendar";
import { Datepicker, type DatepickerConfig } from "./datepicker";

interface RangeParts {
  startInput: HTMLInputElement;
  endInput: HTMLInputElement;
  startPicker: Datepicker;
  endPicker: Datepicker;
}

function asInput(element: HTMLElement): HTMLInputElement {
  if (!(element instanceof HTMLInputElement)) {
    throw new Error("AZUI: date range must be initialized on <input> elements.");
  }

  return element;
}

export class DateRange extends Component<DatepickerConfig> {
  private readonly startInput: HTMLInputElement;
  private readonly endInput: HTMLInputElement;
  private readonly startPicker: Datepicker;
  private readonly endPicker: Datepicker;
  private readonly baseMin: string;
  private readonly baseMax: string;
  private lastNotified = "";

  constructor(
    start: string | HTMLElement,
    end: string | HTMLElement,
    config: DatepickerConfig = {},
  ) {
    super("daterange", start, config);

    const parts = this.build(end, config);
    this.startInput = parts.startInput;
    this.endInput = parts.endInput;
    this.startPicker = parts.startPicker;
    this.endPicker = parts.endPicker;
    this.baseMin = config.min ?? this.startInput.dataset.azMin ?? "";
    this.baseMax = config.max ?? this.endInput.dataset.azMax ?? "";

    this.applyLimits();
    this.listen(this.startInput, "change", () => this.handleStartChange());
    this.listen(this.endInput, "change", () => this.handleEndChange());
  }

  get start(): string {
    return this.validValue(this.startInput);
  }

  get end(): string {
    return this.validValue(this.endInput);
  }

  override destroy(): void {
    this.startPicker.destroy();
    this.endPicker.destroy();
    super.destroy();
  }

  private build(end: string | HTMLElement, config: DatepickerConfig): RangeParts {
    const created: Datepicker[] = [];

    try {
      if (end === "") throw new Error("AZUI: date range requires the end field (data-az-end).");

      const startInput = asInput(this.element);
      const endInput = asInput(resolveElement(end));
      const startPicker = new Datepicker(startInput, config);
      created.push(startPicker);

      return { startInput, endInput, startPicker, endPicker: new Datepicker(endInput, config) };
    } catch (error) {
      for (const picker of created) picker.destroy();
      super.destroy();
      throw error;
    }
  }

  private validValue(input: HTMLInputElement): string {
    return parseIsoDate(input.value) ? input.value.trim() : "";
  }

  private applyLimits(): void {
    this.endPicker.setLimits({ min: this.start || this.baseMin });
    this.startPicker.setLimits({ max: this.end || this.baseMax });
  }

  private handleStartChange(): void {
    this.applyLimits();
    if (this.start && this.end && this.end < this.start) {
      this.endInput.value = "";
      this.endInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    this.notify();
  }

  private handleEndChange(): void {
    this.applyLimits();
    this.notify();
  }

  private notify(): void {
    const key = `${this.start}|${this.end}`;
    if (key === this.lastNotified) return;

    this.lastNotified = key;
    this.emit("change", { detail: { start: this.start, end: this.end } });
  }
}
