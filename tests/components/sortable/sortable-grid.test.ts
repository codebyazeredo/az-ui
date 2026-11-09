import { afterEach, describe, expect, it } from "vitest";
import { Sortable } from "../../../src/components/sortable";
import { insertionIndex } from "../../../src/components/sortable/insertion-index";

const CELL = 100;
const BOXES = [
  { top: 0, left: 0, width: CELL, height: CELL },
  { top: 0, left: CELL, width: CELL, height: CELL },
  { top: CELL, left: 0, width: CELL, height: CELL },
  { top: CELL, left: CELL, width: CELL, height: CELL },
];

function at(x: number, y: number): number {
  return insertionIndex(BOXES, { x, y }, "grid");
}

function dragEvent(type: string, clientX = 0, clientY = 0): Event {
  return Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
    clientX,
    clientY,
    dataTransfer: null,
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("insertionIndex in a grid", () => {
  it("counts the boxes of the rows above the pointer", () => {
    expect(at(10, 150)).toBe(2);
    expect(at(300, 250)).toBe(4);
  });

  it("uses the horizontal midpoint inside the same row", () => {
    expect(at(60, 50)).toBe(1);
    expect(at(10, 50)).toBe(0);
    expect(at(160, 50)).toBe(2);
  });

  it("ignores the rows below the pointer", () => {
    expect(at(500, 50)).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(insertionIndex([], { x: 10, y: 10 }, "grid")).toBe(0);
  });
});

describe("Sortable with direction grid", () => {
  it("reorders items in two dimensions on dragover", () => {
    document.body.innerHTML = `<div id="grid"><div id="a"></div><div id="b"></div><div id="c"></div><div id="d"></div></div>`;
    ["a", "b", "c", "d"].forEach((id, index) => {
      document.getElementById(id)!.getBoundingClientRect = () =>
        ({
          top: Math.floor(index / 2) * CELL,
          left: (index % 2) * CELL,
          width: CELL,
          height: CELL,
        }) as DOMRect;
    });
    new Sortable("#grid", { direction: "grid" });

    document.getElementById("a")!.dispatchEvent(dragEvent("dragstart"));
    document.getElementById("grid")!.dispatchEvent(dragEvent("dragover", 150, 150));
    document.getElementById("grid")!.dispatchEvent(dragEvent("drop"));

    expect([...document.getElementById("grid")!.children].map((item) => item.id)).toEqual([
      "b",
      "c",
      "a",
      "d",
    ]);
  });
});
