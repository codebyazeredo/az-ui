import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from "../../../src/components/modal";
import { Offcanvas } from "../../../src/components/offcanvas";
import type { Overlay } from "../../../src/javascript/core/overlay";

interface OverlayCase {
  name: string;
  panelClass: string;
  create: (
    target: string,
    options?: { closeOnBackdrop?: boolean; closeOnEscape?: boolean },
  ) => Overlay;
}

const created: Overlay[] = [];

function track(overlay: Overlay): Overlay {
  created.push(overlay);
  return overlay;
}

const cases: OverlayCase[] = [
  {
    name: "modal",
    panelClass: "az-modal-dialog",
    create: (target, options) => track(new Modal(target, options)),
  },
  {
    name: "offcanvas",
    panelClass: "az-offcanvas-panel",
    create: (target, options) => track(new Offcanvas(target, options)),
  },
];

function render({ name, panelClass }: OverlayCase): void {
  document.body.innerHTML = `
    <button id="opener">Open</button>
    <div class="az-${name}" id="overlay">
      <div class="${panelClass}" id="panel">
        <h2 class="az-${name}-title">Title</h2>
        <button id="first" data-az-dismiss>Close</button>
        <input id="field" />
        <button id="last">Save</button>
      </div>
    </div>`;
}

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
}

afterEach(() => {
  for (const overlay of created.splice(0)) overlay.destroy();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe.each(cases)("$name", (overlayCase) => {
  it("starts hidden and exposes dialog semantics linked to its title", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    const panel = document.getElementById("panel")!;

    expect(overlay.isOpen).toBe(false);
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(panel.getAttribute("aria-modal")).toBe("true");
    const title = document.querySelector(`.az-${overlayCase.name}-title`)!;
    expect(panel.getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("opens, locks page scroll and moves focus inside", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");

    overlay.show();

    expect(overlay.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement?.id).toBe("first");
  });

  it("closes, unlocks scroll and returns focus to the opener", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    document.getElementById("opener")!.focus();

    overlay.show();
    overlay.hide();

    expect(overlay.isOpen).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement?.id).toBe("opener");
  });

  it("closes with Escape, backdrop click and dismiss buttons", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    const root = document.getElementById("overlay")!;

    overlay.show();
    press(document.getElementById("field")!, "Escape");
    expect(overlay.isOpen).toBe(false);

    overlay.show();
    document.getElementById("panel")!.click();
    expect(overlay.isOpen).toBe(true);
    root.click();
    expect(overlay.isOpen).toBe(false);

    overlay.show();
    document.getElementById("first")!.click();
    expect(overlay.isOpen).toBe(false);
  });

  it("respects closeOnBackdrop and closeOnEscape options", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay", {
      closeOnBackdrop: false,
      closeOnEscape: false,
    });

    overlay.show();
    document.getElementById("overlay")!.click();
    press(document.getElementById("field")!, "Escape");

    expect(overlay.isOpen).toBe(true);
  });

  it("emits cancelable show and hide events", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    const events: string[] = [];
    for (const type of ["show", "shown", "hide", "hidden"]) {
      document.addEventListener(`az:${overlayCase.name}:${type}`, () => events.push(type));
    }

    overlay.show();
    overlay.hide();
    expect(events).toEqual(["show", "shown", "hide", "hidden"]);

    const prevent = (event: Event): void => event.preventDefault();
    document.addEventListener(`az:${overlayCase.name}:show`, prevent);
    overlay.show();
    document.removeEventListener(`az:${overlayCase.name}:show`, prevent);
    expect(overlay.isOpen).toBe(false);
  });

  it("keeps Tab focus inside the panel", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    overlay.show();

    const last = document.getElementById("last")!;
    last.focus();
    const forward = press(last, "Tab");
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("first");

    const backward = press(document.getElementById("first")!, "Tab", { shiftKey: true });
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("last");
  });

  it("cleans up on destroy and allows initializing again", () => {
    render(overlayCase);
    const overlay = overlayCase.create("#overlay");
    overlay.show();

    overlay.destroy();

    expect(document.body.style.overflow).toBe("");
    expect(document.getElementById("panel")!.hasAttribute("role")).toBe(false);
    expect(() => overlayCase.create("#overlay")).not.toThrow();
  });

  it("rejects a double initialization and a missing panel", () => {
    render(overlayCase);
    overlayCase.create("#overlay");

    expect(() => overlayCase.create("#overlay")).toThrow("already initialized");

    document.body.innerHTML = `<div class="az-${overlayCase.name}" id="empty"></div>`;
    expect(() => overlayCase.create("#empty")).toThrow(`.${overlayCase.panelClass}`);
  });
});

describe("overlay events do not leak between components", () => {
  it("dispatches only az:modal events for a modal", () => {
    render(cases[0]!);
    const listener = vi.fn();
    document.addEventListener("az:offcanvas:show", listener);

    const modal = new Modal("#overlay");
    modal.show();
    modal.destroy();
    document.removeEventListener("az:offcanvas:show", listener);

    expect(listener).not.toHaveBeenCalled();
  });
});
