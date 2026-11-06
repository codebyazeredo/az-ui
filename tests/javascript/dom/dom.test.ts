import { afterEach, describe, expect, it, vi } from "vitest";
import { onDismiss } from "../../../src/javascript/dom/dismiss";
import { getFocusable } from "../../../src/javascript/dom/focus";
import { positionFloating } from "../../../src/javascript/dom/position";
import { lockScroll } from "../../../src/javascript/dom/scroll-lock";
import { ensureId, uniqueId } from "../../../src/javascript/dom/unique-id";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("lockScroll", () => {
  it("keeps the page locked until every lock is released", () => {
    const first = lockScroll();
    const second = lockScroll();

    expect(document.body.style.overflow).toBe("hidden");
    first();
    first();
    expect(document.body.style.overflow).toBe("hidden");
    second();
    expect(document.body.style.overflow).toBe("");
  });
});

describe("getFocusable", () => {
  it("returns enabled focusable elements outside hidden containers", () => {
    document.body.innerHTML = `
      <div id="root">
        <a href="#">link</a>
        <button disabled>disabled</button>
        <button>enabled</button>
        <div hidden><button>hidden</button></div>
        <div tabindex="-1">programmatic</div>
      </div>`;

    const texts = getFocusable(document.getElementById("root")!).map(
      (element) => element.textContent,
    );

    expect(texts).toEqual(["link", "enabled"]);
  });
});

describe("onDismiss", () => {
  it("closes on outside pointer down and Escape but not inside, until removed", () => {
    document.body.innerHTML = '<div id="inside"><span id="child"></span></div><p id="outside"></p>';
    const close = vi.fn();
    const remove = onDismiss([document.getElementById("inside")!], close);

    document.getElementById("child")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(close).not.toHaveBeenCalled();

    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(close).toHaveBeenCalledTimes(2);

    remove();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(close).toHaveBeenCalledTimes(2);
  });
});

describe("positionFloating", () => {
  function rect(left: number, top: number, width: number, height: number): DOMRect {
    return new DOMRect(left, top, width, height);
  }

  function setup(anchorTop: number): { anchor: HTMLElement; floating: HTMLElement } {
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 800,
      configurable: true,
    });
    const anchor = document.createElement("button");
    const floating = document.createElement("div");
    vi.spyOn(anchor, "getBoundingClientRect").mockReturnValue(rect(100, anchorTop, 80, 20));
    vi.spyOn(floating, "getBoundingClientRect").mockReturnValue(rect(0, 0, 60, 40));

    return { anchor, floating };
  }

  it("places the element on the requested side, centered on the anchor", () => {
    const { anchor, floating } = setup(200);

    expect(positionFloating(floating, anchor, "top")).toBe("top");
    expect(floating.style.top).toBe("152px");
    expect(floating.style.left).toBe("110px");
  });

  it("flips to the opposite side when there is no room", () => {
    const { anchor, floating } = setup(10);

    expect(positionFloating(floating, anchor, "top")).toBe("bottom");
    expect(floating.style.top).toBe("38px");
    expect(floating.dataset.azPlacement).toBe("bottom");
  });
});

describe("unique ids", () => {
  it("generates distinct ids and keeps an existing one", () => {
    const element = document.createElement("div");

    expect(uniqueId("x")).not.toBe(uniqueId("x"));
    expect(ensureId(element, "az")).toBe(element.id);
    element.id = "mine";
    expect(ensureId(element, "az")).toBe("mine");
  });
});
