import { afterEach, describe, expect, it, vi } from "vitest";
import { Select } from "../../../src/components/select";

function render(attributes = "", selectedValue = ""): Select {
  document.body.innerHTML = `
    <form id="form">
      <label for="field" id="label">Country</label>
      <select id="field" name="country" class="az-control az-select" ${attributes}>
        <option value="" disabled ${selectedValue ? "" : "selected"}>Choose…</option>
        <option value="br" ${selectedValue === "br" ? "selected" : ""}>Brazil</option>
        <option value="pt">Portugal</option>
        <option value="xx" disabled>Atlantis</option>
        <option value="us">United States</option>
      </select>
    </form>`;

  return new Select("#field");
}

const field = (): HTMLSelectElement => document.getElementById("field") as HTMLSelectElement;
const trigger = (): HTMLButtonElement => document.querySelector(".az-select-trigger")!;
const menu = (): HTMLElement => document.querySelector(".az-select-menu")!;
const options = (): HTMLElement[] =>
  [...document.querySelectorAll(".az-select-option")] as HTMLElement[];

function press(key: string, target: Element): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Select", () => {
  it("replaces the native control with an accessible combobox and listbox", () => {
    render();

    expect(trigger().getAttribute("role")).toBe("combobox");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(trigger().getAttribute("aria-controls")).toBe(menu().id);
    expect(trigger().getAttribute("aria-labelledby")).toBe(`label ${trigger().id}`);
    expect(menu().getAttribute("role")).toBe("listbox");
    expect(menu().hidden).toBe(true);
    expect(field().classList.contains("az-select-native")).toBe(true);
    expect(field().getAttribute("aria-hidden")).toBe("true");
  });

  it("lists options without the placeholder and shows it while empty", () => {
    render();

    expect(options().map((option) => option.textContent)).toEqual([
      "Brazil",
      "Portugal",
      "Atlantis",
      "United States",
    ]);
    expect(options()[2]!.getAttribute("aria-disabled")).toBe("true");
    expect(trigger().textContent).toBe("Choose…");
  });

  it("opens on click, focuses the selected option and closes on Escape", () => {
    const select = render("", "br");

    trigger().click();
    expect(select.isOpen).toBe(true);
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(options()[0]);

    press("Escape", options()[0]!);
    expect(select.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger());
  });

  it("picks an option on click, syncs the native select and emits change events", () => {
    const select = render();
    const nativeChange = vi.fn();
    const selectChange = vi.fn((event: Event) => (event as CustomEvent).detail.value);
    field().addEventListener("change", nativeChange);
    document.addEventListener("az:select:change", selectChange);

    trigger().click();
    options()[1]!.click();
    document.removeEventListener("az:select:change", selectChange);

    expect(field().value).toBe("pt");
    expect(select.value).toBe("pt");
    expect(trigger().textContent).toBe("Portugal");
    expect(options()[1]!.getAttribute("aria-selected")).toBe("true");
    expect(select.isOpen).toBe(false);
    expect(nativeChange).toHaveBeenCalledTimes(1);
    expect(selectChange).toHaveReturnedWith("pt");
  });

  it("navigates with arrows, skips disabled options and selects with Enter", () => {
    render();

    press("ArrowDown", trigger());
    expect(document.activeElement).toBe(options()[0]);

    press("ArrowDown", options()[0]!);
    press("ArrowDown", options()[1]!);
    expect(document.activeElement).toBe(options()[3]);

    press("Enter", options()[3]!);
    expect(field().value).toBe("us");
  });

  it("ignores clicks on disabled options", () => {
    render();

    trigger().click();
    options()[2]!.click();

    expect(field().value).toBe("");
    expect(menu().hidden).toBe(false);
  });

  it("closes when clicking outside", () => {
    const select = render();

    trigger().click();
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(select.isOpen).toBe(false);
  });

  it("moves focus to the trigger when the native control is focused through its label", () => {
    render();

    field().dispatchEvent(new FocusEvent("focus"));

    expect(document.activeElement).toBe(trigger());
  });

  it("does not open when disabled and forwards validation attributes", () => {
    const select = render('disabled aria-invalid="true" aria-describedby="help"');

    trigger().click();

    expect(select.isOpen).toBe(false);
    expect(trigger().disabled).toBe(true);
    expect(trigger().getAttribute("aria-invalid")).toBe("true");
    expect(trigger().getAttribute("aria-describedby")).toBe("help");
  });

  it("follows programmatic changes and form reset", async () => {
    render("", "br");

    field().value = "us";
    field().dispatchEvent(new Event("change"));
    expect(trigger().textContent).toBe("United States");

    (document.getElementById("form") as HTMLFormElement).reset();
    await new Promise((resolve) => setTimeout(resolve));
    expect(trigger().textContent).toBe("Brazil");
  });

  it("rebuilds the list on refresh", () => {
    const select = render();

    field().add(new Option("Chile", "cl"));
    select.refresh();

    expect(options()).toHaveLength(5);
  });

  it("rejects non-select elements", () => {
    document.body.innerHTML = `<div id="box"></div>`;

    expect(() => new Select("#box")).toThrow("<select>");
  });

  it("restores the native control on destroy", () => {
    const select = render();

    select.destroy();

    expect(document.querySelector(".az-select-wrap")).toBeNull();
    expect(field().parentElement!.id).toBe("form");
    expect(field().classList.contains("az-select-native")).toBe(false);
    expect(field().hasAttribute("aria-hidden")).toBe(false);
  });
});

describe("Select multiple", () => {
  function renderMultiple(): Select {
    document.body.innerHTML = `
      <select id="field" multiple class="az-control">
        <option value="a" selected>Admin</option>
        <option value="e">Editor</option>
        <option value="v">Viewer</option>
      </select>`;

    return new Select("#field");
  }

  it("shows chips, toggles options and stays open", () => {
    const select = renderMultiple();
    const chips = (): string[] =>
      [...document.querySelectorAll(".az-select-chip")].map((chip) => chip.textContent ?? "");

    expect(menu().getAttribute("aria-multiselectable")).toBe("true");
    expect(chips()).toEqual(["Admin"]);

    trigger().click();
    options()[1]!.click();
    options()[0]!.click();

    expect(select.value).toEqual(["e"]);
    expect(chips()).toEqual(["Editor"]);
    expect(select.isOpen).toBe(true);
  });

  it("shows the placeholder when nothing is selected", () => {
    renderMultiple();

    trigger().click();
    options()[0]!.click();

    expect(document.querySelector(".az-select-placeholder")).not.toBeNull();
  });
});
