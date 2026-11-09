import { afterEach, describe, expect, it, vi } from "vitest";
import { TreeGrid } from "../../../src/components/table";

function render(wrapper = "", assetsExpanded = true): TreeGrid {
  document.body.innerHTML = `
    <div ${wrapper}>
      <table id="grid">
        <tbody>
          <tr id="a" data-az-level="1" ${assetsExpanded ? 'aria-expanded="true"' : ""}><td>Assets</td><td>100</td></tr>
          <tr id="a1" data-az-level="2"><td>Cash</td><td>40</td></tr>
          <tr id="a2" data-az-level="2"><td>Receivables</td><td>60</td></tr>
          <tr id="a21" data-az-level="3"><td>Domestic</td><td>30</td></tr>
          <tr id="a22" data-az-level="3"><td>Export</td><td>30</td></tr>
          <tr id="b" data-az-level="1"><td>Equity</td><td>10</td></tr>
          <tr id="c" data-az-level="1"><td>Liabilities</td><td>5</td></tr>
          <tr id="c1" data-az-level="2"><td>Suppliers</td><td>5</td></tr>
        </tbody>
      </table>
    </div>`;

  return new TreeGrid("#grid");
}

function row(id: string): HTMLTableRowElement {
  return document.getElementById(id) as HTMLTableRowElement;
}

function visible(): string[] {
  return [...document.querySelectorAll<HTMLElement>("#grid tbody tr")]
    .filter((item) => !item.hidden)
    .map((item) => item.id);
}

function press(id: string, key: string): void {
  row(id).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TreeGrid", () => {
  it("applies the treegrid role and the levels", () => {
    render();

    expect(document.getElementById("grid")!.getAttribute("role")).toBe("treegrid");
    expect(row("a21").getAttribute("aria-level")).toBe("3");
    expect(row("a21").cells[0]!.style.getPropertyValue("--az-treegrid-level")).toBe("2");
  });

  it("gives aria-expanded and a toggle only to rows with children", () => {
    render();

    expect(row("a").getAttribute("aria-expanded")).toBe("true");
    expect(row("a2").getAttribute("aria-expanded")).toBe("false");
    expect(row("b").hasAttribute("aria-expanded")).toBe(false);
    expect(row("b").querySelector(".az-treegrid-toggle")).not.toBeNull();
  });

  it("starts collapsed except for rows marked aria-expanded=true", () => {
    render();

    expect(visible()).toEqual(["a", "a1", "a2", "b", "c"]);
  });

  it("collapsing a parent hides every descendant", () => {
    const grid = render();
    grid.expand(row("a2"));
    expect(visible()).toContain("a21");

    grid.collapse(row("a"));

    expect(visible()).toEqual(["a", "b", "c"]);
  });

  it("expanding a parent does not reveal the children of a collapsed child", () => {
    const grid = render();
    grid.collapse(row("a"));

    grid.expand(row("a"));

    expect(visible()).toEqual(["a", "a1", "a2", "b", "c"]);
    expect(visible()).not.toContain("a21");
  });

  it("expandAll and collapseAll", () => {
    const grid = render();

    grid.expandAll();
    expect(visible()).toHaveLength(8);

    grid.collapseAll();
    expect(visible()).toEqual(["a", "b", "c"]);
  });

  it("uses a roving tabindex starting at the first row", () => {
    render();

    expect(row("a").tabIndex).toBe(0);
    expect(row("a1").tabIndex).toBe(-1);
  });

  it("walks only the visible rows with ArrowDown, ArrowUp, Home and End", () => {
    render();
    row("a").focus();

    press("a", "ArrowDown");
    expect(document.activeElement).toBe(row("a1"));

    press("a1", "End");
    expect(document.activeElement).toBe(row("c"));

    press("c", "Home");
    expect(document.activeElement).toBe(row("a"));

    press("b", "ArrowUp");
    expect(document.activeElement).toBe(row("a2"));
  });

  it("expands, enters the first child, then goes back to the parent and collapses", () => {
    render();
    row("c").focus();

    press("c", "ArrowRight");
    expect(row("c").getAttribute("aria-expanded")).toBe("true");

    press("c", "ArrowRight");
    expect(document.activeElement).toBe(row("c1"));

    press("c1", "ArrowLeft");
    expect(document.activeElement).toBe(row("c"));

    press("c", "ArrowLeft");
    expect(row("c").getAttribute("aria-expanded")).toBe("false");
  });

  it("ignores ArrowRight on a leaf row", () => {
    render();
    row("b").focus();

    press("b", "ArrowRight");

    expect(document.activeElement).toBe(row("b"));
    expect(visible()).toEqual(["a", "a1", "a2", "b", "c"]);
  });

  it("swaps the horizontal arrows in rtl", () => {
    render('dir="rtl"');
    row("c").focus();

    press("c", "ArrowRight");
    expect(row("c").getAttribute("aria-expanded")).toBe("false");

    press("c", "ArrowLeft");
    expect(row("c").getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles from the toggle control", () => {
    render();

    row("c").querySelector<HTMLElement>(".az-treegrid-toggle")!.click();

    expect(row("c").getAttribute("aria-expanded")).toBe("true");
    expect(visible()).toContain("c1");
  });

  it("emits az:treegrid:toggle with the row and the state", () => {
    const grid = render();
    const toggled = vi.fn();
    document.getElementById("grid")!.addEventListener("az:treegrid:toggle", (event) => {
      const { row: target, expanded } = (event as CustomEvent).detail;
      toggled(target.id, expanded);
    });

    grid.expand(row("c"));
    grid.expand(row("c"));
    grid.expand(row("b"));

    expect(toggled.mock.calls).toEqual([["c", true]]);
  });

  it("destroy restores the markup", () => {
    const grid = render();

    grid.destroy();

    expect(document.getElementById("grid")!.hasAttribute("role")).toBe(false);
    expect(visible()).toHaveLength(8);
    expect(row("a").hasAttribute("aria-expanded")).toBe(false);
    expect(document.querySelector(".az-treegrid-toggle")).toBeNull();
  });

  it("throws without a table", () => {
    document.body.innerHTML = `<div id="empty"></div>`;

    expect(() => new TreeGrid("#empty")).toThrow("requires a <table>");
  });
});
