import { afterEach, describe, expect, it, vi } from "vitest";
import { Sortable } from "../../../src/components/sortable";
import { insertionIndex } from "../../../src/components/sortable/insertion-index";

const TOPS: Record<string, number> = { a1: 0, a2: 100, a3: 200, b1: 0, b2: 100 };

function render(groupB = "tasks", direction = ""): { a: Sortable; b: Sortable } {
  document.body.innerHTML = `
    <div id="wrapper" ${direction}>
      <ul id="a"><li id="a1">One</li><li id="a2">Two</li><li id="a3">Three</li></ul>
      <ul id="b"><li id="b1">Four</li></ul>
    </div>`;
  for (const [id, top] of Object.entries(TOPS)) {
    const item = document.getElementById(id);
    if (item) {
      item.getBoundingClientRect = () => ({ top, left: 0, width: 100, height: 100 }) as DOMRect;
    }
  }

  return {
    a: new Sortable("#a", { group: "tasks" }),
    b: new Sortable("#b", { group: groupB }),
  };
}

function dragEvent(type: string, clientY = 0): Event {
  return Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
    clientX: 0,
    clientY,
    dataTransfer: null,
  });
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function order(listId: string): string[] {
  return [...document.querySelectorAll(`#${listId} > li`)].map((item) => item.id);
}

function el(id: string): HTMLElement {
  return document.getElementById(id)!;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("insertionIndex", () => {
  const boxes = [
    { top: 0, left: 0, width: 100, height: 100 },
    { top: 100, left: 0, width: 100, height: 100 },
  ];

  it("returns 0 for an empty list", () => {
    expect(insertionIndex([], { x: 0, y: 0 }, "vertical")).toBe(0);
  });

  it("counts the boxes whose midpoint is before the pointer (vertical)", () => {
    const at = (y: number): number => insertionIndex(boxes, { x: 0, y }, "vertical");

    expect([at(40), at(60), at(140), at(160)]).toEqual([0, 1, 1, 2]);
  });

  it("uses the horizontal axis in horizontal lists", () => {
    const sideBySide = [
      { top: 0, left: 0, width: 100, height: 50 },
      { top: 0, left: 100, width: 100, height: 50 },
    ];

    expect(insertionIndex(sideBySide, { x: 60, y: 0 }, "horizontal")).toBe(1);
  });
});

describe("Sortable with the pointer", () => {
  it("reorders inside a list and reports the drop", () => {
    render();
    const dropped = vi.fn();
    el("a").addEventListener("az:sortable:drop", (event) => dropped((event as CustomEvent).detail));

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("a").dispatchEvent(dragEvent("dragover", 260));
    el("a").dispatchEvent(dragEvent("drop"));

    expect(order("a")).toEqual(["a2", "a3", "a1"]);
    expect(dropped).toHaveBeenCalledWith(
      expect.objectContaining({ fromIndex: 0, toIndex: 2, item: el("a1") }),
    );
  });

  it("moves items between lists of the same group", () => {
    render();

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("b").dispatchEvent(dragEvent("dragover", 0));
    el("b").dispatchEvent(dragEvent("drop"));

    expect(order("a")).toEqual(["a2", "a3"]);
    expect(order("b")).toEqual(["a1", "b1"]);
  });

  it("ignores lists from another group", () => {
    render("other");

    el("a1").dispatchEvent(dragEvent("dragstart"));
    const over = dragEvent("dragover", 0);
    el("b").dispatchEvent(over);

    expect(over.defaultPrevented).toBe(false);
    expect(order("b")).toEqual(["b1"]);
  });

  it("drops into an empty list", () => {
    render();
    el("b1").remove();

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("b").dispatchEvent(dragEvent("dragover", 0));
    el("b").dispatchEvent(dragEvent("drop"));

    expect(order("b")).toEqual(["a1"]);
  });

  it("puts the item back when az:sortable:drop is prevented", () => {
    render();
    el("b").addEventListener("az:sortable:drop", (event) => event.preventDefault());

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("b").dispatchEvent(dragEvent("dragover", 0));
    el("b").dispatchEvent(dragEvent("drop"));

    expect(order("a")).toEqual(["a1", "a2", "a3"]);
    expect(order("b")).toEqual(["b1"]);
  });

  it("reverts and emits cancel when the drag ends without a drop", () => {
    render();
    const cancelled = vi.fn();
    el("a").addEventListener("az:sortable:cancel", cancelled);

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("b").dispatchEvent(dragEvent("dragover", 0));
    el("a1").dispatchEvent(dragEvent("dragend"));

    expect(order("a")).toEqual(["a1", "a2", "a3"]);
    expect(cancelled).toHaveBeenCalledTimes(1);
  });

  it("does not drag from outside the handle", () => {
    document.body.innerHTML = `<ul id="a"><li id="a1"><span class="grip">::</span>One</li></ul>`;
    new Sortable("#a", { handle: ".grip" });
    const started = vi.fn();
    el("a").addEventListener("az:sortable:start", started);

    el("a1").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    const start = dragEvent("dragstart");
    el("a1").dispatchEvent(start);

    expect(started).not.toHaveBeenCalled();
    expect(start.defaultPrevented).toBe(true);
  });

  it("releases an active drag when destroyed", () => {
    const { a, b } = render();

    el("a1").dispatchEvent(dragEvent("dragstart"));
    el("b").dispatchEvent(dragEvent("dragover", 0));
    a.destroy();

    expect(order("a")).toEqual(["a1", "a2", "a3"]);
    expect(el("a1").hasAttribute("draggable")).toBe(false);
    expect(() => b.destroy()).not.toThrow();
  });
});

describe("Sortable with the keyboard", () => {
  it("grabs, moves and drops, announcing the position", () => {
    render();

    press(el("a1"), " ");
    press(el("a1"), "ArrowDown");
    press(el("a1"), "Enter");

    expect(order("a")).toEqual(["a2", "a1", "a3"]);
    expect(document.querySelector(".az-sortable-live")?.textContent).toBe(
      "Dropped at position 2 of 3.",
    );
  });

  it("stays at the edge instead of wrapping", () => {
    render();

    press(el("a1"), " ");
    press(el("a1"), "ArrowUp");
    press(el("a1"), "Enter");

    expect(order("a")).toEqual(["a1", "a2", "a3"]);
  });

  it("cancels with Escape", () => {
    render();

    press(el("a1"), " ");
    press(el("a1"), "ArrowDown");
    press(el("a1"), "Escape");

    expect(order("a")).toEqual(["a1", "a2", "a3"]);
  });

  it("moves to the next list with ArrowRight", () => {
    render();

    press(el("a1"), " ");
    press(el("a1"), "ArrowRight");
    press(el("a1"), "Enter");

    expect(order("b")).toEqual(["a1", "b1"]);
  });

  it("swaps the horizontal arrows in rtl", () => {
    render("tasks", 'dir="rtl"');

    press(el("a1"), " ");
    press(el("a1"), "ArrowRight");
    expect(order("a")).toEqual(["a1", "a2", "a3"]);

    press(el("a1"), "ArrowLeft");
    press(el("a1"), "Enter");
    expect(order("b")).toEqual(["a1", "b1"]);
  });

  it("ignores keys pressed on elements inside the item", () => {
    document.body.innerHTML = `<ul id="a"><li id="a1"><input id="field" /></li></ul>`;
    new Sortable("#a");

    press(el("field"), " ");

    expect(document.querySelector(".az-sortable-live")).toBeNull();
  });
});

describe("Sortable.move", () => {
  it("moves an item to another list at the given index", () => {
    const { a, b } = render();

    expect(a.move(el("a1"), b, 1)).toBe(true);
    expect(order("b")).toEqual(["b1", "a1"]);
  });

  it("returns false and keeps the DOM for an out-of-range index", () => {
    const { a, b } = render();

    expect(a.move(el("a1"), b, 5)).toBe(false);
    expect(order("a")).toEqual(["a1", "a2", "a3"]);
  });

  it("returns false for lists of another group", () => {
    const { a, b } = render("other");

    expect(a.move(el("a1"), b, 0)).toBe(false);
  });
});
