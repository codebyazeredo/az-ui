import { afterEach, describe, expect, it, vi } from "vitest";
import { TagInput } from "../../../src/components/tag-input";

function render(hiddenValue = ""): TagInput {
  document.body.innerHTML = `
    <div class="az-tag-input" id="tags">
      <input class="az-tag-input-field" id="field" />
      <input type="hidden" name="labels" id="storage" value="${hiddenValue}" />
    </div>`;

  return new TagInput("#tags");
}

function field(): HTMLInputElement {
  return document.getElementById("field") as HTMLInputElement;
}

function press(key: string, text = ""): KeyboardEvent {
  field().value = text;
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  field().dispatchEvent(event);

  return event;
}

function chips(): string[] {
  return [...document.querySelectorAll(".az-tag-input-label")].map(
    (chip) => chip.textContent ?? "",
  );
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TagInput", () => {
  it("adds a tag with Enter and clears the field", () => {
    const input = render();

    press("Enter", "urgent");

    expect(input.tags).toEqual(["urgent"]);
    expect(chips()).toEqual(["urgent"]);
    expect(field().value).toBe("");
  });

  it("adds a tag with a comma without typing the comma", () => {
    const input = render();

    const event = press(",", "fragile");

    expect(event.defaultPrevented).toBe(true);
    expect(input.tags).toEqual(["fragile"]);
  });

  it("splits text with commas that did not come from a comma key press", () => {
    const input = render();

    field().value = "priority,cold chain";
    field().dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.tags).toEqual(["priority"]);
    expect(field().value).toBe("cold chain");

    field().value = "cold chain,";
    field().dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.tags).toEqual(["priority", "cold chain"]);
    expect(field().value).toBe("");
  });

  it("ignores empty and whitespace-only text", () => {
    const input = render();

    press("Enter", "   ");

    expect(input.tags).toEqual([]);
    expect(field().value).toBe("");
  });

  it("rejects a duplicate without creating a chip", () => {
    const input = render();
    input.add("urgent");

    expect(input.add("urgent")).toBe(false);
    expect(chips()).toEqual(["urgent"]);
  });

  it("keeps the typed text when the tag is a duplicate", () => {
    const input = render();
    input.add("urgent");

    press("Enter", "urgent");

    expect(field().value).toBe("urgent");
  });

  it("rejects tags containing a comma", () => {
    const input = render();

    expect(input.add("a,b")).toBe(false);
  });

  it("removes the last tag with Backspace only when the field is empty", () => {
    const input = render();
    input.add("one");
    input.add("two");

    press("Backspace", "x");
    expect(input.tags).toEqual(["one", "two"]);

    press("Backspace", "");
    expect(input.tags).toEqual(["one"]);
  });

  it("splits pasted text by comma and line break", () => {
    const input = render();
    const paste = Object.assign(new Event("paste", { bubbles: true, cancelable: true }), {
      clipboardData: { getData: () => "a, b,c\nd" },
    });

    field().dispatchEvent(paste);

    expect(input.tags).toEqual(["a", "b", "c", "d"]);
    expect(paste.defaultPrevented).toBe(true);
  });

  it("leaves a plain paste to the browser", () => {
    render();
    const paste = Object.assign(new Event("paste", { bubbles: true, cancelable: true }), {
      clipboardData: { getData: () => "single" },
    });

    field().dispatchEvent(paste);

    expect(paste.defaultPrevented).toBe(false);
  });

  it("cancels the chip when az:taginput:add is prevented", () => {
    const input = render();
    document.getElementById("tags")!.addEventListener("az:taginput:add", (event) => {
      event.preventDefault();
    });

    expect(input.add("blocked")).toBe(false);
    expect(chips()).toEqual([]);
  });

  it("keeps the hidden field as a comma-separated list", () => {
    const input = render();

    input.add("a");
    input.add("b");
    input.remove(0);

    expect((document.getElementById("storage") as HTMLInputElement).value).toBe("b");
  });

  it("starts with the tags already in the hidden field", () => {
    const input = render("x, y");

    expect(input.tags).toEqual(["x", "y"]);
    expect(chips()).toEqual(["x", "y"]);
  });

  it("removes a tag with its accessible button", () => {
    const input = render();
    input.add("one");
    input.add("two");
    const button = document.querySelectorAll<HTMLElement>(".az-tag-input-remove")[0]!;

    expect(button.getAttribute("aria-label")).toBe("Remove one");
    button.click();

    expect(input.tags).toEqual(["two"]);
  });

  it("emits az:taginput:change with the tags", () => {
    const input = render();
    const changed = vi.fn();
    document.getElementById("tags")!.addEventListener("az:taginput:change", (event) => {
      changed((event as CustomEvent).detail.tags);
    });

    input.add("one");

    expect(changed).toHaveBeenCalledWith(["one"]);
  });

  it("remove returns false for an invalid index", () => {
    const input = render();

    expect(input.remove(3)).toBe(false);
  });

  it("destroy removes the chips and the listeners", () => {
    const input = render();
    input.add("one");

    input.destroy();
    press("Enter", "two");

    expect(chips()).toEqual([]);
  });

  it("throws without the typing field", () => {
    document.body.innerHTML = `<div id="tags" class="az-tag-input"></div>`;

    expect(() => new TagInput("#tags")).toThrow("requires an <input");
  });
});
