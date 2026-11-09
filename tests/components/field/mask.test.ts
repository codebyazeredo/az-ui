import { afterEach, describe, expect, it, vi } from "vitest";
import { Mask, applyMask } from "../../../src/components/field";

function render(attributes = 'data-az-mask="99/99/9999"'): { field: HTMLInputElement; mask: Mask } {
  document.body.innerHTML = `<input id="field" ${attributes} />`;
  const field = document.getElementById("field") as HTMLInputElement;

  return { field, mask: new Mask(field) };
}

function type(
  field: HTMLInputElement,
  text: string,
  caret = text.length,
  inputType = "insertText",
) {
  field.value = text;
  field.setSelectionRange(caret, caret);
  field.dispatchEvent(new InputEvent("input", { inputType, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("applyMask", () => {
  it("formats a full value", () => {
    expect(applyMask("99/99/9999", "25122026")).toEqual(
      expect.objectContaining({ value: "25/12/2026", raw: "25122026", complete: true }),
    );
  });

  it("shows a literal only when more data follows", () => {
    expect(applyMask("99/99/9999", "2512").value).toBe("25/12");
    expect(applyMask("99/99/9999", "25").value).toBe("25");
  });

  it("ignores characters that do not fit the token", () => {
    expect(applyMask("99/99/9999", "ab12").value).toBe("12");
    expect(applyMask("aa-99", "x1").value).toBe("x");
  });

  it("cuts text longer than the pattern", () => {
    expect(applyMask("99/99", "2512999").value).toBe("25/12");
  });

  it("does not duplicate literals typed by the user", () => {
    expect(applyMask("99/99/9999", "25/12").value).toBe("25/12");
  });

  it("returns an empty value for empty text", () => {
    expect(applyMask("99/99", "")).toEqual(expect.objectContaining({ value: "", complete: false }));
  });

  it("keeps trailing literals once the pattern is complete", () => {
    expect(applyMask("(99)", "12").value).toBe("(12)");
    expect(applyMask("(99)", "1").value).toBe("(1");
  });

  it("accepts letters and digits with *", () => {
    expect(applyMask("***-**", "a1b2c").value).toBe("a1b-2c");
  });
});

describe("Mask", () => {
  it("formats while typing", () => {
    const { field } = render();

    type(field, "2512");

    expect(field.value).toBe("25/12");
  });

  it("formats an initial value", () => {
    const { field } = render('data-az-mask="99/99" value="2512"');

    expect(field.value).toBe("25/12");
  });

  it("formats pasted text longer than the pattern", () => {
    const { field } = render();

    type(field, "25122026999", 11, "insertFromPaste");

    expect(field.value).toBe("25/12/2026");
  });

  it("formats pasted text with invalid characters", () => {
    const { field } = render();

    type(field, "25-12-2026", 10, "insertFromPaste");

    expect(field.value).toBe("25/12/2026");
  });

  it("removes the previous character when Backspace hits a literal", () => {
    const { field } = render();
    type(field, "2512");
    expect(field.value).toBe("25/12");

    type(field, "2512", 2, "deleteContentBackward");

    expect(field.value).toBe("21/2");
    expect(field.selectionStart).toBe(1);
  });

  it("keeps the caret after the typed character when editing in the middle", () => {
    const { field } = render();
    type(field, "2512");

    type(field, "295/12", 2);

    expect(field.value).toBe("29/51/2");
    expect(field.selectionStart).toBe(2);
  });

  it("keeps the caret in place when the typed character is rejected", () => {
    const { field } = render();
    type(field, "2512");

    type(field, "2X5/12", 2);

    expect(field.value).toBe("25/12");
    expect(field.selectionStart).toBe(1);
  });

  it("rawValue has no literals", () => {
    const { field, mask } = render();

    type(field, "2512");

    expect(mask.rawValue).toBe("2512");
    expect(mask.isComplete).toBe(false);
  });

  it("emits az:mask:complete once when the pattern is filled", () => {
    const { field } = render('data-az-mask="99/99"');
    const complete = vi.fn();
    field.addEventListener("az:mask:complete", complete);

    type(field, "2512");
    type(field, "25/12");

    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("throws without a pattern or outside an input", () => {
    document.body.innerHTML = `<input id="plain" /><div id="box" data-az-mask="99"></div>`;

    expect(() => new Mask("#plain")).toThrow("requires an <input>");
    expect(() => new Mask("#box")).toThrow("requires an <input>");
  });

  it("destroy removes the listeners", () => {
    const { field, mask } = render();

    mask.destroy();
    type(field, "2512");

    expect(field.value).toBe("2512");
  });

  it("throws when initialized twice", () => {
    const { field } = render();

    expect(() => new Mask(field)).toThrow("already initialized");
  });
});
