import { afterEach, describe, expect, it, vi } from "vitest";
import { ColumnReorder } from "../../../src/components/table";

function render(wrapper = ""): ColumnReorder {
  document.body.innerHTML = `
    <div ${wrapper}>
      <table id="orders">
        <thead>
          <tr>
            <th id="h1" data-az-reorderable>Order</th>
            <th id="h2" data-az-reorderable>Customer</th>
            <th id="h3" data-az-reorderable>Total</th>
            <th id="h4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Acme</td><td>10</td><td>x</td></tr>
          <tr><td>2</td><td>Beta</td><td>20</td></tr>
        </tbody>
      </table>
    </div>`;

  return new ColumnReorder("#orders");
}

function headerOrder(): string[] {
  return [...document.querySelectorAll("#orders thead th")].map((cell) => cell.textContent ?? "");
}

function rowOrder(index: number): string[] {
  const row = document.querySelectorAll("#orders tbody tr")[index]!;

  return [...row.children].map((cell) => cell.textContent ?? "");
}

function header(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function press(target: HTMLElement, key: string, altKey = true): void {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, altKey, bubbles: true, cancelable: true }),
  );
}

function dragEvent(type: string): Event {
  return Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
    dataTransfer: null,
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ColumnReorder", () => {
  it("makes only the marked headers draggable and focusable", () => {
    render();

    expect(header("h1").draggable).toBe(true);
    expect(header("h1").tabIndex).toBe(0);
    expect(header("h4").draggable).toBe(false);
  });

  it("moves a column in the header and in every row", () => {
    const reorder = render();

    expect(reorder.move(0, 2)).toBe(true);

    expect(headerOrder()).toEqual(["Customer", "Total", "Order", "Actions"]);
    expect(rowOrder(0)).toEqual(["Acme", "10", "1", "x"]);
    expect(rowOrder(1)).toEqual(["Beta", "20", "2"]);
  });

  it("moves the last reorderable column to the start", () => {
    const reorder = render();

    reorder.move(2, 0);

    expect(headerOrder()).toEqual(["Total", "Order", "Customer", "Actions"]);
    expect(rowOrder(0)).toEqual(["10", "1", "Acme", "x"]);
  });

  it("moves the first column to the very end", () => {
    const reorder = render();

    reorder.move(0, 3);

    expect(headerOrder()).toEqual(["Customer", "Total", "Actions", "Order"]);
    expect(rowOrder(0)).toEqual(["Acme", "10", "x", "1"]);
  });

  it("returns false and changes nothing for invalid or equal indexes", () => {
    const reorder = render();

    expect([
      reorder.move(1, 1),
      reorder.move(-1, 2),
      reorder.move(0, 9),
      reorder.move(0.5, 1),
    ]).toEqual([false, false, false, false]);
    expect(headerOrder()).toEqual(["Order", "Customer", "Total", "Actions"]);
  });

  it("can be cancelled with az:columnreorder:reorder", () => {
    const reorder = render();
    const reordered = vi.fn();
    document.getElementById("orders")!.addEventListener("az:columnreorder:reorder", (event) => {
      reordered((event as CustomEvent).detail);
      event.preventDefault();
    });

    expect(reorder.move(0, 1)).toBe(false);
    expect(reordered).toHaveBeenCalledWith({ from: 0, to: 1 });
    expect(headerOrder()).toEqual(["Order", "Customer", "Total", "Actions"]);
  });

  it("moves the focused column with Alt and the arrow keys and keeps the focus", () => {
    render();
    header("h1").focus();

    press(header("h1"), "ArrowRight");

    expect(headerOrder()).toEqual(["Customer", "Order", "Total", "Actions"]);
    expect(document.activeElement).toBe(header("h1"));
  });

  it("ignores the arrows without Alt", () => {
    render();

    press(header("h1"), "ArrowRight", false);

    expect(headerOrder()).toEqual(["Order", "Customer", "Total", "Actions"]);
  });

  it("swaps the arrows in rtl", () => {
    render('dir="rtl"');

    press(header("h2"), "ArrowLeft");

    expect(headerOrder()).toEqual(["Order", "Total", "Customer", "Actions"]);
  });

  it("moves a column by dragging its header onto another", () => {
    render();

    header("h1").dispatchEvent(dragEvent("dragstart"));
    const over = dragEvent("dragover");
    header("h3").dispatchEvent(over);
    header("h3").dispatchEvent(dragEvent("drop"));

    expect(over.defaultPrevented).toBe(true);
    expect(headerOrder()).toEqual(["Customer", "Total", "Order", "Actions"]);
    expect(header("h1").classList.contains("az-table-column-dragging")).toBe(false);
  });

  it("does not accept a drop from outside a drag", () => {
    render();
    const over = dragEvent("dragover");

    header("h3").dispatchEvent(over);

    expect(over.defaultPrevented).toBe(false);
  });

  it("destroy removes draggable and tabindex", () => {
    const reorder = render();

    reorder.destroy();

    expect(header("h1").hasAttribute("draggable")).toBe(false);
    expect(header("h1").hasAttribute("tabindex")).toBe(false);
  });

  it("throws without a table", () => {
    document.body.innerHTML = `<div id="empty"></div>`;

    expect(() => new ColumnReorder("#empty")).toThrow("requires a <table>");
  });
});
