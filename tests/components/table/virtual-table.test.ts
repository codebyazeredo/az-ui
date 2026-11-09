import { afterEach, describe, expect, it, vi } from "vitest";
import { VirtualTable } from "../../../src/components/table";

const ROW_HEIGHT = 40;
const VIEWPORT = 200;

function renderRow(index: number): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${index}</td><td>Row ${index}</td>`;

  return row;
}

function render(
  rowCount = 100,
  overrides: Partial<ConstructorParameters<typeof VirtualTable>[1]> = {},
): { table: VirtualTable; draw: ReturnType<typeof vi.fn> } {
  document.body.innerHTML = `
    <div id="wrap">
      <table id="t">
        <thead><tr><th>#</th><th>Name</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>`;
  const wrap = document.getElementById("wrap") as HTMLElement;
  Object.defineProperty(wrap, "clientHeight", { value: VIEWPORT, configurable: true });
  Object.defineProperty(wrap, "scrollTop", { value: 0, writable: true, configurable: true });
  const draw = vi.fn(renderRow);

  return {
    table: new VirtualTable(wrap, {
      rowCount,
      rowHeight: ROW_HEIGHT,
      renderRow: draw,
      overscan: 2,
      ...overrides,
    }),
    draw,
  };
}

function scrollTo(top: number): void {
  const wrap = document.getElementById("wrap") as HTMLElement;
  wrap.scrollTop = top;
  wrap.dispatchEvent(new Event("scroll"));
}

function renderedTexts(): string[] {
  return [...document.querySelectorAll("#t tbody tr:not(.az-table-spacer) td:first-child")].map(
    (cell) => cell.textContent ?? "",
  );
}

function spacerHeights(): string[] {
  return [...document.querySelectorAll<HTMLElement>(".az-table-spacer td")].map(
    (cell) => cell.style.height,
  );
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("VirtualTable", () => {
  it("renders only the visible rows plus the overscan at the start", () => {
    const { table, draw } = render();

    expect(table.range).toEqual({ start: 0, end: 7 });
    expect(draw).toHaveBeenCalledTimes(7);
    expect(renderedTexts()).toEqual(["0", "1", "2", "3", "4", "5", "6"]);
    expect(spacerHeights()).toEqual(["0px", `${(100 - 7) * ROW_HEIGHT}px`]);
  });

  it("renders other rows and moves the spacers when scrolling", () => {
    const { table } = render();

    scrollTo(400);

    expect(table.range).toEqual({ start: 8, end: 17 });
    expect(renderedTexts()[0]).toBe("8");
    expect(renderedTexts().at(-1)).toBe("16");
    expect(spacerHeights()).toEqual([`${8 * ROW_HEIGHT}px`, `${(100 - 17) * ROW_HEIGHT}px`]);
  });

  it("does not render again while the window stays the same", () => {
    const { draw } = render();

    scrollTo(0);
    scrollTo(0);

    expect(draw).toHaveBeenCalledTimes(7);
  });

  it("shows the last rows without a gap when scrolled to the end", () => {
    const { table } = render();

    scrollTo(100 * ROW_HEIGHT - VIEWPORT);

    expect(table.range).toEqual({ start: 93, end: 100 });
    expect(renderedTexts().at(-1)).toBe("99");
    expect(spacerHeights()[1]).toBe("0px");
  });

  it("setRowCount with fewer rows adjusts the scroll position and the window", () => {
    const { table } = render();
    scrollTo(3800);

    table.setRowCount(10);

    expect((document.getElementById("wrap") as HTMLElement).scrollTop).toBe(
      10 * ROW_HEIGHT - VIEWPORT,
    );
    expect(table.range).toEqual({ start: 3, end: 10 });
    expect(document.getElementById("t")!.getAttribute("aria-rowcount")).toBe("11");
  });

  it("setRowCount with more rows extends the bottom spacer", () => {
    const { table } = render(10);

    table.setRowCount(1000);

    expect(table.range.end).toBe(7);
    expect(spacerHeights()[1]).toBe(`${(1000 - 7) * ROW_HEIGHT}px`);
  });

  it("ignores an invalid row count", () => {
    const { table } = render();

    table.setRowCount(-1);
    table.setRowCount(2.5);

    expect(table.range).toEqual({ start: 0, end: 7 });
  });

  it("handles a table with no rows", () => {
    const { table } = render(0);

    expect(table.range).toEqual({ start: 0, end: 0 });
    expect(renderedTexts()).toEqual([]);
    expect(spacerHeights()).toEqual(["0px", "0px"]);
    expect(() => table.scrollToRow(5)).not.toThrow();
  });

  it("scrollToRow moves the scroll position and renders around the row", () => {
    const { table } = render();

    table.scrollToRow(50);

    expect((document.getElementById("wrap") as HTMLElement).scrollTop).toBe(50 * ROW_HEIGHT);
    expect(table.range.start).toBe(48);
  });

  it("scrollToRow clamps to the last row", () => {
    const { table } = render();

    table.scrollToRow(1000);

    expect(renderedTexts().at(-1)).toBe("99");
  });

  it("refresh draws the current window again", () => {
    const { table, draw } = render();

    table.refresh();

    expect(draw).toHaveBeenCalledTimes(14);
  });

  it("sets aria-rowcount and aria-rowindex counting the header", () => {
    render();

    expect(document.getElementById("t")!.getAttribute("aria-rowcount")).toBe("101");
    expect(document.querySelector("#t tbody tr:nth-child(2)")!.getAttribute("aria-rowindex")).toBe(
      "2",
    );
  });

  it("gives the spacers the number of header columns", () => {
    render();

    expect(document.querySelector<HTMLTableCellElement>(".az-table-spacer td")!.colSpan).toBe(2);
  });

  it("destroy empties the body, removes aria-rowcount and stops listening", () => {
    const { table, draw } = render();

    table.destroy();
    scrollTo(400);

    expect(document.querySelector("#t tbody")!.children).toHaveLength(0);
    expect(document.getElementById("t")!.hasAttribute("aria-rowcount")).toBe(false);
    expect(draw).toHaveBeenCalledTimes(7);
  });

  it("throws without a tbody or with invalid sizes", () => {
    document.body.innerHTML = `<div id="wrap"><table></table></div>`;
    expect(() => new VirtualTable("#wrap", { rowCount: 1, rowHeight: 40, renderRow })).toThrow(
      "requires a <table> with a <tbody>",
    );

    document.body.innerHTML = `<div id="wrap"><table><tbody></tbody></table></div>`;
    expect(() => new VirtualTable("#wrap", { rowCount: 1, rowHeight: 0, renderRow })).toThrow(
      "requires rowHeight > 0",
    );
    expect(() => new VirtualTable("#wrap", { rowCount: -1, rowHeight: 40, renderRow })).toThrow(
      "requires rowHeight > 0",
    );
  });
});
