import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";

export interface MaskOptions {
  pattern?: string;
}

export interface MaskResult {
  value: string;
  raw: string;
  complete: boolean;
  positions: number[];
}

const TOKEN_PATTERNS: Record<string, RegExp> = {
  "9": /\d/,
  a: /\p{L}/u,
  "*": /[\p{L}\d]/u,
};

export function applyMask(pattern: string, text: string): MaskResult {
  const textChars = [...text];
  const positions: number[] = [];
  let value = "";
  let raw = "";
  let pendingLiterals = "";
  let textIndex = 0;
  let dataTokens = 0;

  for (const token of pattern) {
    const accepts = TOKEN_PATTERNS[token];
    if (!accepts) {
      pendingLiterals += token;
      continue;
    }

    dataTokens += 1;
    while (textIndex < textChars.length && !accepts.test(textChars[textIndex] ?? "")) {
      textIndex += 1;
    }
    const char = textChars[textIndex];
    if (char === undefined) continue;

    textIndex += 1;
    value += pendingLiterals;
    pendingLiterals = "";
    positions.push(value.length);
    value += char;
    raw += char;
  }

  const complete = dataTokens > 0 && raw.length === dataTokens;
  if (complete) value += pendingLiterals;

  return { value, raw, complete, positions };
}

function resolveOptions(field: string | HTMLElement, options: MaskOptions): MaskOptions {
  return { pattern: options.pattern ?? resolveElement(field).dataset.azMask ?? "" };
}

export class Mask extends Component<MaskOptions> {
  private readonly field: HTMLInputElement;
  private readonly pattern: string;
  private formatted = "";
  private wasComplete = false;

  constructor(field: string | HTMLElement, options: MaskOptions = {}) {
    super("mask", field, resolveOptions(field, options));

    const pattern = this.options.pattern ?? "";
    if (!(this.element instanceof HTMLInputElement) || pattern === "") {
      super.destroy();
      throw new Error("AZUI: mask requires an <input> and a pattern (data-az-mask).");
    }
    this.field = this.element;
    this.pattern = pattern;

    const initial = applyMask(pattern, this.field.value);
    this.field.value = initial.value;
    this.formatted = initial.value;
    this.wasComplete = initial.complete;

    this.listen(this.field, "input", (event) => this.handleInput(event as InputEvent));
  }

  get rawValue(): string {
    return applyMask(this.pattern, this.field.value).raw;
  }

  get isComplete(): boolean {
    return applyMask(this.pattern, this.field.value).complete;
  }

  private handleInput(event: InputEvent): void {
    const typed = this.field.value;
    const caret = this.field.selectionStart ?? typed.length;
    const atEnd = caret >= typed.length;
    const charsBeforeCaret = applyMask(this.pattern, typed.slice(0, caret)).raw.length;

    let result = applyMask(this.pattern, typed);
    let dataBeforeCaret = charsBeforeCaret;
    const deletedLiteral =
      event.inputType === "deleteContentBackward" &&
      result.value === this.formatted &&
      charsBeforeCaret > 0;
    if (deletedLiteral) {
      const remaining = [...result.raw];
      remaining.splice(charsBeforeCaret - 1, 1);
      result = applyMask(this.pattern, remaining.join(""));
      dataBeforeCaret = charsBeforeCaret - 1;
    }

    this.field.value = result.value;
    this.formatted = result.value;
    this.moveCaret(result, dataBeforeCaret, atEnd && !deletedLiteral);
    this.notifyIfComplete(result.complete);
  }

  private moveCaret(result: MaskResult, dataBeforeCaret: number, atEnd: boolean): void {
    const position = this.caretPosition(result, dataBeforeCaret, atEnd);

    this.field.setSelectionRange(position, position);
  }

  private caretPosition(result: MaskResult, dataBeforeCaret: number, atEnd: boolean): number {
    if (atEnd) return result.value.length;
    if (dataBeforeCaret === 0) return 0;

    const lastPosition = result.positions[dataBeforeCaret - 1];

    return lastPosition === undefined ? result.value.length : lastPosition + 1;
  }

  private notifyIfComplete(complete: boolean): void {
    if (complete && !this.wasComplete)
      this.emit("complete", { detail: { value: this.field.value } });
    this.wasComplete = complete;
  }
}
