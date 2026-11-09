import { afterEach, describe, expect, it, vi } from "vitest";
import { Collapse } from "../../../src/components/collapse";

function render(contentAttributes = "hidden"): Collapse {
  document.body.innerHTML = `
    <button id="first" data-az-toggle="collapse" data-az-target="#details">Details</button>
    <button id="second" data-az-toggle="collapse" data-az-target="#details">More</button>
    <div id="details" ${contentAttributes}>Content</div>`;

  return new Collapse("#details");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Collapse", () => {
  it("starts closed and reflects it on every trigger", () => {
    const collapse = render();

    expect(collapse.isOpen).toBe(false);
    for (const id of ["first", "second"]) {
      const trigger = document.getElementById(id)!;
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(trigger.getAttribute("aria-controls")).toBe("details");
    }
  });

  it("starts open when the content is visible", () => {
    const collapse = render("");

    expect(collapse.isOpen).toBe(true);
    expect(document.getElementById("first")!.getAttribute("aria-expanded")).toBe("true");
  });

  it("honors the open option over the markup", () => {
    document.body.innerHTML = `<div id="details" hidden>Content</div>`;

    expect(new Collapse("#details", { open: true }).isOpen).toBe(true);
  });

  it("toggle shows and hides the content and updates the triggers", () => {
    const collapse = render();

    collapse.toggle();
    expect(document.getElementById("details")!.hidden).toBe(false);
    expect(document.getElementById("second")!.getAttribute("aria-expanded")).toBe("true");

    collapse.toggle();
    expect(document.getElementById("details")!.hidden).toBe(true);
    expect(document.getElementById("second")!.getAttribute("aria-expanded")).toBe("false");
  });

  it("emits show, shown, hide and hidden in order", () => {
    const collapse = render();
    const events: string[] = [];
    for (const name of ["show", "shown", "hide", "hidden"]) {
      collapse.element.addEventListener(`az:collapse:${name}`, () => events.push(name));
    }

    collapse.show();
    collapse.hide();

    expect(events).toEqual(["show", "shown", "hide", "hidden"]);
  });

  it("keeps the content hidden when az:collapse:show is prevented", () => {
    const collapse = render();
    const shown = vi.fn();
    collapse.element.addEventListener("az:collapse:show", (event) => event.preventDefault());
    collapse.element.addEventListener("az:collapse:shown", shown);

    collapse.show();

    expect(collapse.isOpen).toBe(false);
    expect(shown).not.toHaveBeenCalled();
  });

  it("keeps the content visible when az:collapse:hide is prevented", () => {
    const collapse = render("");
    collapse.element.addEventListener("az:collapse:hide", (event) => event.preventDefault());

    collapse.hide();

    expect(collapse.isOpen).toBe(true);
  });

  it("destroy clears the trigger attributes and allows initializing again", () => {
    const collapse = render();

    collapse.destroy();

    expect(document.getElementById("first")!.hasAttribute("aria-expanded")).toBe(false);
    expect(() => new Collapse("#details")).not.toThrow();
  });

  it("throws when initialized twice", () => {
    render();

    expect(() => new Collapse("#details")).toThrow("already initialized");
  });
});
