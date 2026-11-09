import { afterEach, describe, expect, it, vi } from "vitest";
import { Stepper } from "../../../src/components/stepper";

function render(withPanels = true): Stepper {
  document.body.innerHTML = `
    <div class="az-stepper" id="stepper">
      <ol class="az-stepper-list">
        <li class="az-stepper-step" id="s1">Customer</li>
        <li class="az-stepper-step" id="s2">Items</li>
        <li class="az-stepper-step" id="s3">Review</li>
      </ol>
      ${
        withPanels
          ? `<div class="az-stepper-panel" id="p1">One</div>
             <div class="az-stepper-panel" id="p2">Two</div>
             <div class="az-stepper-panel" id="p3">Three</div>`
          : ""
      }
    </div>`;

  return new Stepper("#stepper");
}

function el(id: string): HTMLElement {
  return document.getElementById(id)!;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Stepper", () => {
  it("marks the first step as current and shows only its panel", () => {
    const stepper = render();

    expect(stepper.current).toBe(0);
    expect(el("s1").getAttribute("aria-current")).toBe("step");
    expect(el("p1").hidden).toBe(false);
    expect(el("p2").hidden).toBe(true);
    expect(el("s2").dataset.state).toBe("pending");
  });

  it("go changes the current step, the panels and aria-current", () => {
    const stepper = render();

    expect(stepper.go(2)).toBe(true);

    expect(stepper.current).toBe(2);
    expect(el("s1").hasAttribute("aria-current")).toBe(false);
    expect(el("s3").getAttribute("aria-current")).toBe("step");
    expect(el("p3").hidden).toBe(false);
    expect(el("p1").hidden).toBe(true);
  });

  it("emits az:stepper:change with the origin and destination", () => {
    const stepper = render();
    const changed = vi.fn();
    el("stepper").addEventListener("az:stepper:change", (event) => {
      changed((event as CustomEvent).detail);
    });

    stepper.next();

    expect(changed).toHaveBeenCalledWith({ from: 0, to: 1 });
  });

  it("blocks navigation when az:stepper:change is prevented", () => {
    const stepper = render();
    el("stepper").addEventListener("az:stepper:change", (event) => event.preventDefault());

    expect(stepper.go(1)).toBe(false);
    expect(stepper.current).toBe(0);
    expect(el("p1").hidden).toBe(false);
  });

  it("go returns false for an out-of-range or current index without changing anything", () => {
    const stepper = render();

    expect([stepper.go(-1), stepper.go(3), stepper.go(0), stepper.go(1.5)]).toEqual([
      false,
      false,
      false,
      false,
    ]);
    expect(stepper.current).toBe(0);
  });

  it("next on the last step and previous on the first return false", () => {
    const stepper = render();

    expect(stepper.previous()).toBe(false);
    stepper.go(2);
    expect(stepper.next()).toBe(false);
  });

  it("setState updates data-state", () => {
    const stepper = render();

    stepper.setState(0, "complete");
    stepper.setState(1, "error");

    expect([el("s1").dataset.state, el("s2").dataset.state]).toEqual(["complete", "error"]);
  });

  it("works without panels", () => {
    const stepper = render(false);

    expect(stepper.next()).toBe(true);
    expect(el("s2").getAttribute("aria-current")).toBe("step");
  });

  it("throws when the panels do not match the steps", () => {
    document.body.innerHTML = `
      <div id="stepper">
        <li class="az-stepper-step"></li><li class="az-stepper-step"></li>
        <div class="az-stepper-panel"></div>
      </div>`;

    expect(() => new Stepper("#stepper")).toThrow("same number");
  });

  it("destroy restores the markup", () => {
    const stepper = render();
    stepper.go(1);

    stepper.destroy();

    expect(el("s2").hasAttribute("aria-current")).toBe(false);
    expect(el("s2").dataset.state).toBeUndefined();
    expect(el("p1").hidden).toBe(false);
  });
});
