import { afterEach, describe, expect, it, vi } from "vitest";
import { Sortable } from "../../../src/components/sortable";

function render(): Sortable {
  document.body.innerHTML = `
    <table>
      <tbody id="body">
        <tr id="r1"><td class="az-table-handle">::</td><td>One</td></tr>
        <tr id="r2"><td class="az-table-handle">::</td><td>Two</td></tr>
        <tr id="r3"><td class="az-table-handle">::</td><td>Three</td></tr>
      </tbody>
    </table>`;
  ["r1", "r2", "r3"].forEach((id, index) => {
    document.getElementById(id)!.getBoundingClientRect = () =>
      ({ top: index * 100, left: 0, width: 100, height: 100 }) as DOMRect;
  });

  return new Sortable("#body", { items: "tr" });
}

function dragEvent(type: string, clientY = 0): Event {
  return Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
    clientX: 0,
    clientY,
    dataTransfer: null,
  });
}

function order(): string[] {
  return [...document.querySelectorAll("#body > tr")].map((row) => row.id);
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Sortable on table rows", () => {
  it("makes the rows draggable", () => {
    render();

    expect(document.getElementById("r1")!.draggable).toBe(true);
    expect(document.getElementById("r1")!.tabIndex).toBe(0);
  });

  it("reorders rows on drop and reports the new index", () => {
    render();
    const dropped = vi.fn();
    document.getElementById("body")!.addEventListener("az:sortable:drop", (event) => {
      dropped((event as CustomEvent).detail.toIndex);
    });

    document.getElementById("r1")!.dispatchEvent(dragEvent("dragstart"));
    document.getElementById("body")!.dispatchEvent(dragEvent("dragover", 260));
    document.getElementById("body")!.dispatchEvent(dragEvent("drop"));

    expect(order()).toEqual(["r2", "r3", "r1"]);
    expect(dropped).toHaveBeenCalledWith(2);
  });

  it("moves a row with the keyboard", () => {
    render();
    const row = document.getElementById("r1")!;

    for (const key of [" ", "ArrowDown", "Enter"]) {
      row.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    }

    expect(order()).toEqual(["r2", "r1", "r3"]);
  });
});
