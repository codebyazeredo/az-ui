import { afterEach, describe, expect, it } from "vitest";
import { Popover } from "../../../src/components/popover";
import { Tooltip } from "../../../src/components/tooltip";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Tooltip", () => {
  function render(attributes = 'data-az-content="Helpful text"'): HTMLElement {
    document.body.innerHTML = `<button id="trigger" ${attributes}>Info</button>`;
    return document.getElementById("trigger")!;
  }

  it("shows on hover and focus and hides on leave, blur and Escape", () => {
    const trigger = render();
    new Tooltip(trigger);

    trigger.dispatchEvent(new Event("mouseenter"));
    const tooltip = document.querySelector(".az-tooltip")!;
    expect(tooltip.textContent).toBe("Helpful text");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);

    trigger.dispatchEvent(new Event("mouseleave"));
    expect(document.querySelector(".az-tooltip")).toBeNull();
    expect(trigger.hasAttribute("aria-describedby")).toBe(false);

    trigger.dispatchEvent(new Event("focus"));
    expect(document.querySelector(".az-tooltip")).not.toBeNull();
    trigger.dispatchEvent(new Event("blur"));
    expect(document.querySelector(".az-tooltip")).toBeNull();

    trigger.dispatchEvent(new Event("focus"));
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.querySelector(".az-tooltip")).toBeNull();
  });

  it("prefers options over data attributes and keeps content as text", () => {
    const trigger = render('data-az-content="From data" data-az-placement="left"');
    new Tooltip(trigger, { content: "<b>Options</b>", placement: "bottom" });

    trigger.dispatchEvent(new Event("mouseenter"));
    const tooltip = document.querySelector<HTMLElement>(".az-tooltip")!;

    expect(tooltip.textContent).toBe("<b>Options</b>");
    expect(tooltip.querySelector("b")).toBeNull();
    expect(tooltip.dataset.azPlacement).toBe("bottom");
  });

  it("does nothing without content and stops reacting after destroy", () => {
    const empty = render("");
    new Tooltip(empty);
    empty.dispatchEvent(new Event("mouseenter"));
    expect(document.querySelector(".az-tooltip")).toBeNull();

    const trigger = render();
    const tooltip = new Tooltip(trigger);
    trigger.dispatchEvent(new Event("mouseenter"));
    tooltip.destroy();

    expect(document.querySelector(".az-tooltip")).toBeNull();
    trigger.dispatchEvent(new Event("mouseenter"));
    expect(document.querySelector(".az-tooltip")).toBeNull();
  });
});

describe("Popover", () => {
  function render(): Popover {
    document.body.innerHTML = `
      <p id="outside">outside</p>
      <button id="trigger" data-az-target="#pop">Details</button>
      <div class="az-popover" id="pop"><h3 class="az-popover-title">Title</h3><button id="inner">Go</button></div>`;

    return new Popover("#trigger");
  }

  it("wires dialog semantics and starts closed", () => {
    const popover = render();
    const trigger = document.getElementById("trigger")!;
    const content = document.getElementById("pop")!;

    expect(popover.isOpen).toBe(false);
    expect(content.hidden).toBe(true);
    expect(content.getAttribute("role")).toBe("dialog");
    expect(content.getAttribute("aria-labelledby")).toBe(
      content.querySelector(".az-popover-title")!.id,
    );
    expect(trigger.getAttribute("aria-controls")).toBe("pop");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles from the trigger, moves focus inside and reflects aria-expanded", () => {
    const popover = render();
    const trigger = document.getElementById("trigger")!;

    trigger.click();
    expect(popover.isOpen).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement?.id).toBe("pop");

    trigger.click();
    expect(popover.isOpen).toBe(false);
  });

  it("closes outside and with Escape returning focus, but not on inner presses", () => {
    const popover = render();
    const trigger = document.getElementById("trigger")!;

    trigger.click();
    document.getElementById("inner")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(popover.isOpen).toBe(true);

    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(popover.isOpen).toBe(false);

    trigger.click();
    document
      .getElementById("inner")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(popover.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("reports a missing or unspecified content element", () => {
    document.body.innerHTML =
      '<button id="a" data-az-target="#none"></button><button id="b"></button>';

    expect(() => new Popover("#a")).toThrow('"#none" was not found');
    expect(() => new Popover("#b")).toThrow("was not found");
  });

  it("removes attributes and listeners on destroy", () => {
    const popover = render();
    const trigger = document.getElementById("trigger")!;

    popover.destroy();
    trigger.click();

    expect(trigger.hasAttribute("aria-expanded")).toBe(false);
    expect(document.getElementById("pop")!.hasAttribute("role")).toBe(false);
  });
});
