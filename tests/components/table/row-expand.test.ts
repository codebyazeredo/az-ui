import { afterEach, describe, expect, it, vi } from "vitest";
import { RowExpand } from "../../../src/components/table";

function render(secondExpanded = false): RowExpand {
  document.body.innerHTML = `
    <table id="orders">
      <tbody>
        <tr id="r1"><td><button class="az-table-expand" data-az-expand aria-label="Details 1"></button></td><td>1001</td></tr>
        <tr class="az-table-detail" id="d1"><td colspan="2">Detail one</td></tr>
        <tr id="r2"><td><button class="az-table-expand" data-az-expand aria-label="Details 2" ${
          secondExpanded ? 'aria-expanded="true"' : ""
        }></button></td><td>1002</td></tr>
        <tr class="az-table-detail" id="d2"><td colspan="2">Detail two</td></tr>
        <tr id="r3"><td><button data-az-expand aria-label="Details 3"></button></td><td>1003</td></tr>
        <tr id="r4"><td></td><td>1004</td></tr>
      </tbody>
    </table>`;

  return new RowExpand("#orders");
}

function row(id: string): HTMLTableRowElement {
  return document.getElementById(id) as HTMLTableRowElement;
}

function button(rowId: string): HTMLElement {
  return row(rowId).querySelector("[data-az-expand]")!;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("RowExpand", () => {
  it("starts with the details hidden and the buttons collapsed", () => {
    render();

    expect(row("d1").hidden).toBe(true);
    expect(button("r1").getAttribute("aria-expanded")).toBe("false");
  });

  it("points aria-controls at the detail row", () => {
    render();

    expect(button("r1").getAttribute("aria-controls")).toBe("d1");
  });

  it("respects aria-expanded=true in the markup", () => {
    render(true);

    expect(row("d2").hidden).toBe(false);
    expect(row("d1").hidden).toBe(true);
  });

  it("toggles the detail row and aria-expanded with the button", () => {
    render();

    button("r1").click();
    expect(row("d1").hidden).toBe(false);
    expect(button("r1").getAttribute("aria-expanded")).toBe("true");

    button("r1").click();
    expect(row("d1").hidden).toBe(true);
  });

  it("does not affect other rows", () => {
    render();

    button("r1").click();

    expect(row("d2").hidden).toBe(true);
  });

  it("expandAll and collapseAll work on every row with a detail", () => {
    const rows = render();

    rows.expandAll();
    expect([row("d1").hidden, row("d2").hidden]).toEqual([false, false]);

    rows.collapseAll();
    expect([row("d1").hidden, row("d2").hidden]).toEqual([true, true]);
  });

  it("emits az:rowexpand:toggle with the row, the detail and the state", () => {
    const rows = render();
    const toggled = vi.fn();
    document.getElementById("orders")!.addEventListener("az:rowexpand:toggle", (event) => {
      const { row: target, detail, expanded } = (event as CustomEvent).detail;
      toggled(target.id, detail.id, expanded);
    });

    rows.expand(row("r1"));
    rows.expand(row("r1"));

    expect(toggled.mock.calls).toEqual([["r1", "d1", true]]);
  });

  it("ignores a button whose row has no detail", () => {
    const rows = render();

    button("r3").click();

    expect(rows.isExpanded(row("r3"))).toBe(false);
    expect(button("r3").hasAttribute("aria-controls")).toBe(false);
  });

  it("destroy shows the details again and removes the attributes", () => {
    const rows = render();

    rows.destroy();

    expect(row("d1").hidden).toBe(false);
    expect(button("r1").hasAttribute("aria-expanded")).toBe(false);
    button("r1").click();
    expect(row("d1").hidden).toBe(false);
  });
});
