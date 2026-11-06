import { describe, expect, it } from "vitest";
import { AZUI } from "../../../src";

const { Form } = AZUI;

describe("AZUI.Form advanced fields", () => {
  it("renders a multi-select with the selected values", () => {
    const field = Form.multiselect({
      name: "roles",
      options: [
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer", disabled: true },
      ],
      value: ["editor", "viewer"],
    });
    const select = field.querySelector("select")!;

    expect(select.multiple).toBe(true);
    expect(select.classList.contains("az-multiselect")).toBe(true);
    expect([...select.selectedOptions].map((option) => option.value)).toEqual(["editor", "viewer"]);
    expect(select.options[2]?.disabled).toBe(true);
  });

  it("renders a file input with accept and multiple", () => {
    const input = Form.file({ name: "attachments", accept: ".pdf", multiple: true }).querySelector(
      "input",
    )!;

    expect(input.type).toBe("file");
    expect(input.accept).toBe(".pdf");
    expect(input.multiple).toBe(true);
    expect(input.classList.contains("az-file")).toBe(true);
    expect(input.dataset.azComponent).toBe("fileupload");
  });

  it("renders a range with its limits", () => {
    const input = Form.range({ name: "volume", min: 0, max: 10, step: 2, value: 4 }).querySelector(
      "input",
    )!;

    expect(input.type).toBe("range");
    expect([input.min, input.max, input.step, input.value]).toEqual(["0", "10", "2", "4"]);
    expect(input.classList.contains("az-range")).toBe(true);
  });

  it("wraps an input with a prefix and a suffix in an input group", () => {
    const field = Form.number({ name: "price", prefix: "$", suffix: "<b>USD</b>" });
    const texts = [...field.querySelectorAll(".az-input-group-text")];

    expect(texts.map((text) => text.textContent)).toEqual(["$", "<b>USD</b>"]);
    expect(field.querySelector(".az-input-group > input")).not.toBeNull();
    expect(field.querySelector("b")).toBeNull();
  });

  it("renders a character counter linked to the control", () => {
    const field = Form.textarea({ name: "bio", value: "Hello", maxLength: 20, counter: true });
    const textarea = field.querySelector("textarea")!;
    const counter = field.querySelector(".az-field-counter")!;

    expect(textarea.maxLength).toBe(20);
    expect(counter.textContent).toBe("5 / 20");
    expect(textarea.getAttribute("aria-describedby")).toBe(counter.id);
    expect(textarea.dataset.azComponent).toBe("counter");
    expect(textarea.dataset.azTarget).toBe(`#${counter.id}`);
  });

  it("applies maxLength without a counter", () => {
    const field = Form.text({ name: "code", maxLength: 4 });

    expect(field.querySelector("input")!.maxLength).toBe(4);
    expect(field.querySelector(".az-field-counter")).toBeNull();
  });

  it("requires maxLength when the counter is enabled", () => {
    expect(() => Form.text({ name: "code", counter: true })).toThrow("maxLength");
  });
});
