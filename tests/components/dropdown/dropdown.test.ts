import { afterEach, describe, expect, it } from "vitest";
import { Dropdown } from "../../../src/components/dropdown";

function render(): Dropdown {
  document.body.innerHTML = `
    <p id="outside">outside</p>
    <div class="az-dropdown" id="dropdown">
      <button class="az-btn az-dropdown-toggle" id="toggle">Actions</button>
      <div class="az-dropdown-menu" id="menu">
        <a class="az-dropdown-item" id="one" href="#one">One</a>
        <button class="az-dropdown-item" id="disabled" disabled>Disabled</button>
        <button class="az-dropdown-item" id="two">Two</button>
      </div>
    </div>`;

  return new Dropdown("#dropdown");
}

function press(key: string, target: Element = document.activeElement ?? document.body): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Dropdown", () => {
  it("wires menu semantics and starts closed", () => {
    const dropdown = render();
    const toggle = document.getElementById("toggle")!;

    expect(dropdown.isOpen).toBe(false);
    expect(toggle.getAttribute("aria-haspopup")).toBe("menu");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBe("menu");
    expect(document.getElementById("menu")!.getAttribute("role")).toBe("menu");
    expect(document.getElementById("one")!.getAttribute("role")).toBe("menuitem");
  });

  it("toggles from the button and reflects aria-expanded", () => {
    const dropdown = render();
    const toggle = document.getElementById("toggle")!;

    toggle.click();
    expect(dropdown.isOpen).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    toggle.click();
    expect(dropdown.isOpen).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens with arrow keys on the button, focusing the first or last item", () => {
    const dropdown = render();
    const toggle = document.getElementById("toggle")!;

    press("ArrowDown", toggle);
    expect(dropdown.isOpen).toBe(true);
    expect(document.activeElement?.id).toBe("one");

    dropdown.hide();
    press("ArrowUp", toggle);
    expect(document.activeElement?.id).toBe("two");
  });

  it("moves between enabled items with wrapping, Home and End", () => {
    render();
    press("ArrowDown", document.getElementById("toggle")!);

    press("ArrowDown");
    expect(document.activeElement?.id).toBe("two");
    press("ArrowDown");
    expect(document.activeElement?.id).toBe("one");
    press("ArrowUp");
    expect(document.activeElement?.id).toBe("two");
    press("Home");
    expect(document.activeElement?.id).toBe("one");
    press("End");
    expect(document.activeElement?.id).toBe("two");
  });

  it("closes with Escape returning focus, with Tab, on item click and outside", () => {
    const dropdown = render();
    const toggle = document.getElementById("toggle")!;

    toggle.click();
    press("ArrowDown", toggle);
    press("Escape");
    expect(dropdown.isOpen).toBe(false);
    expect(document.activeElement).toBe(toggle);

    toggle.click();
    press("Tab", document.getElementById("one")!);
    expect(dropdown.isOpen).toBe(false);

    toggle.click();
    document.getElementById("two")!.click();
    expect(dropdown.isOpen).toBe(false);
    expect(document.activeElement).toBe(toggle);

    toggle.click();
    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(dropdown.isOpen).toBe(false);
  });

  it("stays open when pressing inside the dropdown", () => {
    const dropdown = render();
    document.getElementById("toggle")!.click();

    document.getElementById("menu")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(dropdown.isOpen).toBe(true);
  });

  it("emits cancelable show and hide events", () => {
    const dropdown = render();
    const prevent = (event: Event): void => event.preventDefault();

    document.addEventListener("az:dropdown:show", prevent);
    dropdown.show();
    document.removeEventListener("az:dropdown:show", prevent);
    expect(dropdown.isOpen).toBe(false);

    dropdown.show();
    document.addEventListener("az:dropdown:hide", prevent);
    dropdown.hide();
    document.removeEventListener("az:dropdown:hide", prevent);
    expect(dropdown.isOpen).toBe(true);
  });

  it("removes attributes and listeners on destroy", () => {
    const dropdown = render();
    const toggle = document.getElementById("toggle")!;

    dropdown.destroy();
    toggle.click();

    expect(toggle.hasAttribute("aria-haspopup")).toBe(false);
    expect(document.getElementById("menu")!.hasAttribute("role")).toBe(false);
    expect(dropdown.isOpen).toBe(false);
  });

  it("rejects incomplete markup", () => {
    document.body.innerHTML = '<div id="broken" class="az-dropdown"></div>';

    expect(() => new Dropdown("#broken")).toThrow(".az-dropdown-toggle");
  });
});
