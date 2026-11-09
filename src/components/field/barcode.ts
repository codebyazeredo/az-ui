import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";

export interface BarcodeOptions {
  minLength: number;
  maxInterval: number;
}

const DEFAULT_MIN_LENGTH = 4;
const DEFAULT_MAX_INTERVAL = 50;

export function isScan(intervals: number[], maxInterval: number): boolean {
  return intervals.every((interval) => interval <= maxInterval);
}

function resolveOptions(
  field: string | HTMLElement,
  options: Partial<BarcodeOptions>,
): BarcodeOptions {
  const { azMinLength, azMaxInterval } = resolveElement(field).dataset;

  return {
    minLength: options.minLength ?? Number(azMinLength ?? DEFAULT_MIN_LENGTH),
    maxInterval: options.maxInterval ?? Number(azMaxInterval ?? DEFAULT_MAX_INTERVAL),
  };
}

export class BarcodeInput extends Component<BarcodeOptions> {
  private readonly field: HTMLInputElement;
  private keyTimes: number[] = [];

  constructor(field: string | HTMLElement, options: Partial<BarcodeOptions> = {}) {
    super("barcode", field, resolveOptions(field, options));

    if (!(this.element instanceof HTMLInputElement)) {
      super.destroy();
      throw new Error("AZUI: barcode input must be initialized on an <input> element.");
    }
    this.field = this.element;

    this.listen(this.field, "keydown", (event) => this.handleKey(event));
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.handleEnter(event);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      if (this.field.value === "") this.keyTimes = [];
      this.keyTimes.push(Date.now());
    }
  }

  private handleEnter(event: KeyboardEvent): void {
    const code = this.field.value;
    const wasScan = this.looksLikeScan(code);
    this.keyTimes = [];
    if (!wasScan) return;

    event.preventDefault();
    this.field.value = "";
    this.emit("scan", { detail: { code } });
  }

  private looksLikeScan(code: string): boolean {
    const everyCharWasTyped = this.keyTimes.length === code.length;
    if (code.length < this.options.minLength || !everyCharWasTyped) return false;

    const intervals = this.keyTimes
      .slice(1)
      .map((time, index) => time - (this.keyTimes[index] ?? 0));

    return isScan(intervals, this.options.maxInterval);
  }
}
