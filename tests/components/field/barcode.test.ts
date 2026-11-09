import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BarcodeInput, isScan } from "../../../src/components/field";

function render(attributes = "", options = {}): { field: HTMLInputElement; barcode: BarcodeInput } {
  document.body.innerHTML = `<input id="code" ${attributes} />`;
  const field = document.getElementById("code") as HTMLInputElement;

  return { field, barcode: new BarcodeInput(field, options) };
}

function typeChars(field: HTMLInputElement, text: string, gap: number): void {
  for (const char of text) {
    field.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
    field.value += char;
    vi.advanceTimersByTime(gap);
  }
}

function pressEnter(field: HTMLInputElement): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
  field.dispatchEvent(event);

  return event;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("isScan", () => {
  it("is true when every interval is short", () => {
    expect(isScan([10, 12, 8], 50)).toBe(true);
  });

  it("is false when one interval is slow", () => {
    expect(isScan([10, 400, 8], 50)).toBe(false);
  });
});

describe("BarcodeInput", () => {
  it("emits az:barcode:scan with the code, clears the field and blocks Enter", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", (event) => {
      scanned((event as CustomEvent).detail.code);
    });

    typeChars(field, "789123", 10);
    const enter = pressEnter(field);

    expect(scanned).toHaveBeenCalledWith("789123");
    expect(field.value).toBe("");
    expect(enter.defaultPrevented).toBe(true);
  });

  it("ignores human typing and lets Enter through", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    typeChars(field, "789123", 200);
    const enter = pressEnter(field);

    expect(scanned).not.toHaveBeenCalled();
    expect(field.value).toBe("789123");
    expect(enter.defaultPrevented).toBe(false);
  });

  it("ignores a fast code shorter than the minimum length", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    typeChars(field, "123", 10);
    pressEnter(field);

    expect(scanned).not.toHaveBeenCalled();
  });

  it("is not a scan when the text was edited with Backspace", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    typeChars(field, "78912", 10);
    field.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));
    field.value = field.value.slice(0, -1);
    typeChars(field, "3", 10);
    pressEnter(field);

    expect(scanned).not.toHaveBeenCalled();
  });

  it("is not a scan when the text was pasted", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    field.value = "7891234";
    pressEnter(field);

    expect(scanned).not.toHaveBeenCalled();
  });

  it("scans twice in a row", () => {
    const { field } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", (event) => {
      scanned((event as CustomEvent).detail.code);
    });

    typeChars(field, "1111", 10);
    pressEnter(field);
    typeChars(field, "2222", 10);
    pressEnter(field);

    expect(scanned.mock.calls).toEqual([["1111"], ["2222"]]);
  });

  it("honors the options and the data attributes", () => {
    const { field } = render("", { maxInterval: 300 });
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    typeChars(field, "1234", 200);
    pressEnter(field);
    expect(scanned).toHaveBeenCalledTimes(1);

    const second = render('data-az-min-length="6"');
    const again = vi.fn();
    second.field.addEventListener("az:barcode:scan", again);
    typeChars(second.field, "12345", 10);
    pressEnter(second.field);
    expect(again).not.toHaveBeenCalled();
  });

  it("destroy removes the listeners", () => {
    const { field, barcode } = render();
    const scanned = vi.fn();
    field.addEventListener("az:barcode:scan", scanned);

    barcode.destroy();
    typeChars(field, "789123", 10);
    pressEnter(field);

    expect(scanned).not.toHaveBeenCalled();
  });

  it("throws outside an input and when initialized twice", () => {
    document.body.innerHTML = `<div id="box"></div><input id="code" />`;

    expect(() => new BarcodeInput("#box")).toThrow("<input>");

    const barcode = new BarcodeInput("#code");
    expect(() => new BarcodeInput(barcode.element)).toThrow("already initialized");
  });
});
