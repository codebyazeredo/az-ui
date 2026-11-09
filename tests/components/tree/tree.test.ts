import { afterEach, describe, expect, it, vi } from "vitest";
import { Tree } from "../../../src/components/tree";

function render(direction = ""): Tree {
  document.body.innerHTML = `
    <div ${direction}>
      <ul class="az-tree" id="tree">
        <li class="az-tree-item" id="assets">
          <span class="az-tree-label">Assets</span>
          <ul>
            <li class="az-tree-item" id="cash"><span class="az-tree-label">Cash</span></li>
            <li class="az-tree-item" id="bank"><span class="az-tree-label">Bank</span></li>
          </ul>
        </li>
        <li class="az-tree-item" id="liabilities"><span class="az-tree-label">Liabilities</span></li>
      </ul>
    </div>`;

  return new Tree("#tree");
}

function el(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function press(id: string, key: string): void {
  el(id).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Tree", () => {
  it("applies the tree roles and collapses branches", () => {
    render();

    expect(el("tree").getAttribute("role")).toBe("tree");
    expect(el("assets").getAttribute("role")).toBe("treeitem");
    expect(el("assets").getAttribute("aria-expanded")).toBe("false");
    expect(el("assets").querySelector("ul")!.getAttribute("role")).toBe("group");
    expect(el("assets").querySelector("ul")!.hidden).toBe(true);
    expect(el("liabilities").hasAttribute("aria-expanded")).toBe(false);
  });

  it("keeps a branch expanded when the markup says so", () => {
    document.body.innerHTML = `
      <ul class="az-tree" id="tree">
        <li class="az-tree-item" id="assets" aria-expanded="true">
          <span class="az-tree-label">Assets</span>
          <ul><li class="az-tree-item"><span class="az-tree-label">Cash</span></li></ul>
        </li>
      </ul>`;
    new Tree("#tree");

    expect(el("assets").querySelector("ul")!.hidden).toBe(false);
  });

  it("uses a roving tabindex starting at the first item", () => {
    render();

    expect(el("assets").tabIndex).toBe(0);
    expect(el("liabilities").tabIndex).toBe(-1);
  });

  it("expands with ArrowRight, enters the first child and collapses with ArrowLeft", () => {
    render();
    el("assets").focus();

    press("assets", "ArrowRight");
    expect(el("assets").getAttribute("aria-expanded")).toBe("true");

    press("assets", "ArrowRight");
    expect(document.activeElement).toBe(el("cash"));

    press("cash", "ArrowLeft");
    expect(document.activeElement).toBe(el("assets"));

    press("assets", "ArrowLeft");
    expect(el("assets").getAttribute("aria-expanded")).toBe("false");
  });

  it("walks only the visible items with ArrowDown and ArrowUp", () => {
    render();
    el("assets").focus();

    press("assets", "ArrowDown");
    expect(document.activeElement).toBe(el("liabilities"));

    press("liabilities", "ArrowUp");
    expect(document.activeElement).toBe(el("assets"));
  });

  it("Home and End jump to the first and last visible item", () => {
    const tree = render();
    tree.expand(el("assets"));
    el("cash").focus();

    press("cash", "End");
    expect(document.activeElement).toBe(el("liabilities"));

    press("liabilities", "Home");
    expect(document.activeElement).toBe(el("assets"));
  });

  it("selects with Enter and by clicking a label, emitting az:tree:select", () => {
    const tree = render();
    const selected = vi.fn();
    el("tree").addEventListener("az:tree:select", (event) => {
      selected((event as CustomEvent).detail.item.id);
    });

    press("assets", "Enter");
    el("liabilities").querySelector<HTMLElement>(".az-tree-label")!.click();

    expect(selected.mock.calls).toEqual([["assets"], ["liabilities"]]);
    expect(tree.selected).toBe(el("liabilities"));
    expect(el("assets").getAttribute("aria-selected")).toBe("false");
  });

  it("toggles from the toggle control and emits az:tree:toggle", () => {
    render();
    const toggled = vi.fn();
    el("tree").addEventListener("az:tree:toggle", (event) => {
      toggled((event as CustomEvent).detail.expanded);
    });

    el("assets").querySelector<HTMLElement>(".az-tree-toggle")!.click();

    expect(el("assets").getAttribute("aria-expanded")).toBe("true");
    expect(toggled).toHaveBeenCalledWith(true);
  });

  it("works with a tree that has a single leaf", () => {
    document.body.innerHTML = `<ul class="az-tree" id="tree"><li class="az-tree-item" id="only"><span class="az-tree-label">Only</span></li></ul>`;
    new Tree("#tree");

    press("only", "ArrowRight");
    press("only", "ArrowDown");
    press("only", "ArrowLeft");

    expect(el("only").tabIndex).toBe(0);
  });

  it("swaps the horizontal arrows in rtl", () => {
    render('dir="rtl"');
    el("assets").focus();

    press("assets", "ArrowRight");
    expect(el("assets").getAttribute("aria-expanded")).toBe("false");

    press("assets", "ArrowLeft");
    expect(el("assets").getAttribute("aria-expanded")).toBe("true");
  });

  it("destroy restores the markup", () => {
    const tree = render();

    tree.destroy();

    expect(el("tree").hasAttribute("role")).toBe(false);
    expect(el("assets").hasAttribute("aria-expanded")).toBe(false);
    expect(el("assets").querySelector("ul")!.hidden).toBe(false);
    expect(document.querySelector(".az-tree-toggle")).toBeNull();
  });
});
