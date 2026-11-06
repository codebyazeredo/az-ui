import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "../../../src/components/tabs";

function render(selected = ""): Tabs {
  document.body.innerHTML = `
    <div class="az-tabs" id="tabs">
      <div class="az-tabs-list">
        <button class="az-tabs-tab" id="t1">One</button>
        <button class="az-tabs-tab" id="t2" ${selected}>Two</button>
        <button class="az-tabs-tab" id="t3">Three</button>
      </div>
      <div class="az-tabs-panel" id="p1">First</div>
      <div class="az-tabs-panel" id="p2">Second</div>
      <div class="az-tabs-panel" id="p3">Third</div>
    </div>`;

  return new Tabs("#tabs");
}

function press(key: string, target: HTMLElement): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function visiblePanels(): string[] {
  return [...document.querySelectorAll<HTMLElement>(".az-tabs-panel")]
    .filter((panel) => !panel.hidden)
    .map((panel) => panel.id);
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Tabs", () => {
  it("wires tab semantics and selects the first tab by default", () => {
    const tabs = render();
    const tab = document.getElementById("t1")!;
    const panel = document.getElementById("p1")!;

    expect(tabs.selectedIndex).toBe(0);
    expect(document.querySelector(".az-tabs-list")!.getAttribute("role")).toBe("tablist");
    expect(tab.getAttribute("role")).toBe("tab");
    expect(tab.getAttribute("aria-selected")).toBe("true");
    expect(tab.getAttribute("aria-controls")).toBe("p1");
    expect(panel.getAttribute("role")).toBe("tabpanel");
    expect(panel.getAttribute("aria-labelledby")).toBe("t1");
    expect(document.getElementById("t2")!.tabIndex).toBe(-1);
    expect(visiblePanels()).toEqual(["p1"]);
  });

  it("honours an initially selected tab", () => {
    const tabs = render('aria-selected="true"');

    expect(tabs.selectedIndex).toBe(1);
    expect(visiblePanels()).toEqual(["p2"]);
  });

  it("selects on click and emits a change event with the index", () => {
    const tabs = render();
    const change = vi.fn((event: Event) => (event as CustomEvent<{ index: number }>).detail.index);
    document.addEventListener("az:tabs:change", change);

    document.getElementById("t3")!.click();
    document.getElementById("t3")!.click();
    document.removeEventListener("az:tabs:change", change);

    expect(tabs.selectedIndex).toBe(2);
    expect(visiblePanels()).toEqual(["p3"]);
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveReturnedWith(2);
  });

  it("navigates with arrow keys, wrapping, Home and End, moving focus", () => {
    const tabs = render();

    press("ArrowLeft", document.getElementById("t1")!);
    expect(tabs.selectedIndex).toBe(2);
    expect(document.activeElement?.id).toBe("t3");

    press("ArrowRight", document.getElementById("t3")!);
    expect(tabs.selectedIndex).toBe(0);

    press("End", document.getElementById("t1")!);
    expect(tabs.selectedIndex).toBe(2);
    press("Home", document.getElementById("t3")!);
    expect(tabs.selectedIndex).toBe(0);
  });

  it("ignores out-of-range selections", () => {
    const tabs = render();

    tabs.select(-1);
    tabs.select(3);

    expect(tabs.selectedIndex).toBe(0);
  });

  it("rejects mismatched tabs and panels", () => {
    document.body.innerHTML = `
      <div id="tabs"><button class="az-tabs-tab">One</button></div>`;

    expect(() => new Tabs("#tabs")).toThrow("same number");
  });

  it("removes semantics and listeners on destroy", () => {
    const tabs = render();

    tabs.destroy();
    document.getElementById("t2")!.click();

    expect(document.getElementById("t1")!.hasAttribute("role")).toBe(false);
    expect(document.getElementById("p1")!.hasAttribute("aria-labelledby")).toBe(false);
    expect(visiblePanels()).toEqual(["p1", "p2", "p3"]);
  });
});
