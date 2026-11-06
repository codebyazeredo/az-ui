import { afterEach, describe, expect, it } from "vitest";
import { Counter } from "../../../src/components/field";

function render(): HTMLInputElement {
  document.body.innerHTML = `
    <input id="field" maxlength="10" value="abc" data-az-target="#count">
    <p id="count"></p>`;

  return document.getElementById("field") as HTMLInputElement;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Counter", () => {
  it("shows the current length on init and while typing", () => {
    const field = render();
    new Counter(field);

    expect(document.getElementById("count")!.textContent).toBe("3 / 10");

    field.value = "abcdef";
    field.dispatchEvent(new Event("input"));

    expect(document.getElementById("count")!.textContent).toBe("6 / 10");
  });

  it("rejects fields without maxlength and non-text elements", () => {
    document.body.innerHTML = `<input id="field" data-az-target="#count"><p id="count"></p><div id="box"></div>`;

    expect(() => new Counter("#field")).toThrow("maxlength");
    expect(() => new Counter("#box")).toThrow("maxlength");
  });

  it("stops updating after destroy", () => {
    const field = render();
    const counter = new Counter(field);

    counter.destroy();
    field.value = "abcdefgh";
    field.dispatchEvent(new Event("input"));

    expect(document.getElementById("count")!.textContent).toBe("3 / 10");
  });
});
