import { afterEach, describe, expect, it, vi } from "vitest";
import { Splitter } from "../../../src/components/splitter";

function stubSize(element: HTMLElement, size: number): void {
  element.getBoundingClientRect = () =>
    ({ width: size, height: size, top: 0, left: 0, right: size, bottom: size }) as DOMRect;
}

function render(extraClass = "", wrapper = ""): Splitter {
  document.body.innerHTML = `
    <div ${wrapper}>
      <div class="az-splitter ${extraClass}" id="split">
        <div id="first" data-az-min="200">First</div>
        <div class="az-splitter-handle" id="handle"></div>
        <div id="second" data-az-min="300">Second</div>
      </div>
    </div>`;
  stubSize(document.getElementById("split")!, 1010);
  stubSize(document.getElementById("handle")!, 10);

  return new Splitter("#split");
}

function press(key: string, shiftKey = false): void {
  document
    .getElementById("handle")!
    .dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Splitter", () => {
  it("sets separator semantics on the handle", () => {
    render();
    const handle = document.getElementById("handle")!;

    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");
    expect(handle.getAttribute("aria-controls")).toBe("first");
    expect(handle.tabIndex).toBe(0);
  });

  it("uses a horizontal separator for stacked panes", () => {
    render("az-splitter-vertical");

    expect(document.getElementById("handle")!.getAttribute("aria-orientation")).toBe(
      "horizontal",
    );
  });

  it("resize clamps to the minimum sizes", () => {
    const splitter = render();

    splitter.resize(5);
    expect(splitter.size).toBeCloseTo(20, 0);

    splitter.resize(95);
    expect(splitter.size).toBeCloseTo(70, 0);
    expect(document.getElementById("first")!.style.flexBasis).toBe(`${splitter.size}%`);
  });

  it("keeps the first pane at its minimum when both minimums do not fit", () => {
    document.body.innerHTML = `
      <div class="az-splitter" id="split">
        <div data-az-min="600">First</div>
        <div class="az-splitter-handle"></div>
        <div data-az-min="600">Second</div>
      </div>`;
    stubSize(document.getElementById("split")!, 1010);
    stubSize(document.querySelector<HTMLElement>(".az-splitter-handle")!, 10);

    const splitter = new Splitter("#split");
    splitter.resize(50);

    expect(splitter.size).toBeCloseTo(60, 0);
  });

  it("keyboard arrows resize and update aria-valuenow", () => {
    const splitter = render();
    splitter.resize(40);

    press("ArrowRight");
    expect(document.getElementById("handle")!.getAttribute("aria-valuenow")).toBe("42");

    press("ArrowLeft", true);
    expect(document.getElementById("handle")!.getAttribute("aria-valuenow")).toBe("32");
  });

  it("Home and End go to the limits", () => {
    const splitter = render();

    press("Home");
    expect(splitter.size).toBeCloseTo(20, 0);

    press("End");
    expect(splitter.size).toBeCloseTo(70, 0);
  });

  it("uses ArrowUp and ArrowDown in stacked panes", () => {
    const splitter = render("az-splitter-vertical");
    splitter.resize(40);

    press("ArrowDown");

    expect(splitter.size).toBe(42);
  });

  it("swaps the horizontal arrows in rtl", () => {
    const splitter = render("", 'dir="rtl"');
    splitter.resize(40);

    press("ArrowLeft");

    expect(splitter.size).toBe(42);
  });

  it("emits az:splitter:resize with the new size", () => {
    const splitter = render();
    const resized = vi.fn();
    document.getElementById("split")!.addEventListener("az:splitter:resize", (event) => {
      resized((event as CustomEvent).detail.size);
    });

    splitter.resize(50);

    expect(resized).toHaveBeenCalledWith(50);
  });

  it("throws without a handle between two panes", () => {
    document.body.innerHTML = `<div class="az-splitter" id="split"><div>Only</div></div>`;

    expect(() => new Splitter("#split")).toThrow("requires a .az-splitter-handle");
  });

  it("destroy removes the handle attributes and the inline size", () => {
    const splitter = render();

    splitter.destroy();

    expect(document.getElementById("handle")!.hasAttribute("role")).toBe(false);
    expect(document.getElementById("first")!.style.flexBasis).toBe("");
  });
});
