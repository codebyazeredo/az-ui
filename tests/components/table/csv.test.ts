import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadCsv, tableToCsv } from "../../../src/components/table";

function render(body = ""): HTMLTableElement {
  document.body.innerHTML = `
    <table id="orders">
      <thead>
        <tr>
          <th class="az-table-select"></th>
          <th>Order</th>
          <th>Customer</th>
          <th>Total</th>
          <th class="az-table-actions"></th>
        </tr>
      </thead>
      <tbody>
        ${
          body ||
          `<tr><td><input type="checkbox" /></td><td>1001</td><td>Acme</td><td>10.5</td><td><button>Edit</button></td></tr>
           <tr aria-selected="true"><td></td><td>1002</td><td>Beta</td><td>-3</td><td></td></tr>
           <tr hidden><td></td><td>1003</td><td>Gamma</td><td>7</td><td></td></tr>`
        }
      </tbody>
    </table>`;

  return document.getElementById("orders") as HTMLTableElement;
}

function row(order: string, customer: string, total = "1"): string {
  return `<tr><td></td><td>${order}</td><td>${customer}</td><td>${total}</td><td></td></tr>`;
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("tableToCsv", () => {
  it("writes the header and every row without the select and actions columns", () => {
    expect(tableToCsv(render())).toBe(
      ["Order,Customer,Total", "1001,Acme,10.5", "1002,Beta,-3", "1003,Gamma,7"].join("\r\n"),
    );
  });

  it("quotes cells with the delimiter, quotes and line breaks", () => {
    const multiline = `<tr><td></td><td>3</td><td data-az-export="Line one&#10;Line two">x</td><td>1</td><td></td></tr>`;
    const table = render(row("1", "Smith, John") + row("2", 'The "Best" Co') + multiline);

    expect(tableToCsv(table).split("\r\n").slice(1).join("|")).toBe(
      '1,"Smith, John",1|2,"The ""Best"" Co",1|3,"Line one\nLine two",1',
    );
  });

  it("leaves out the row handle column", () => {
    document.body.innerHTML = `<table id="t"><thead><tr><th class="az-table-handle"></th><th>Task</th></tr></thead><tbody><tr><td class="az-table-handle">::</td><td>Pick</td></tr></tbody></table>`;

    expect(tableToCsv(document.getElementById("t") as HTMLTableElement)).toBe("Task\r\nPick");
  });

  it("collapses whitespace inside a cell", () => {
    const table = render(row("1", "  Acme \n   Logistics  "));

    expect(tableToCsv(table)).toContain("1,Acme Logistics,1");
  });

  it("neutralizes text that could run as a spreadsheet formula", () => {
    const table = render(row("=SUM(A1)", "+cmd", "@x") + row("-cmd", "Acme", "-5.5"));
    const lines = tableToCsv(table).split("\r\n");

    expect(lines[1]).toBe("'=SUM(A1),'+cmd,'@x");
    expect(lines[2]).toBe("'-cmd,Acme,-5.5");
  });

  it("keeps plain numbers, including negative ones, untouched", () => {
    const table = render(row("-5", "+7", "-0.25"));

    expect(tableToCsv(table).split("\r\n")[1]).toBe("-5,+7,-0.25");
  });

  it("does not alter the text when sanitize is false", () => {
    const table = render(row("=1+1", "Acme"));

    expect(tableToCsv(table, { sanitize: false })).toContain("=1+1,Acme");
  });

  it("uses data-az-export instead of the displayed text", () => {
    const table = render(
      `<tr><td></td><td>1</td><td>Acme</td><td data-az-export="1500.00">R$ 1.500,00</td><td></td></tr>`,
    );

    expect(tableToCsv(table)).toContain("1,Acme,1500.00");
  });

  it("leaves out hidden columns", () => {
    const table = render();
    for (const tableRow of table.rows) tableRow.cells[2]?.setAttribute("hidden", "");

    expect(tableToCsv(table).split("\r\n")[0]).toBe("Order,Total");
  });

  it("exports only the visible or the selected rows when asked", () => {
    const table = render();

    expect(tableToCsv(table, { rows: "visible" }).split("\r\n")).toHaveLength(3);
    expect(tableToCsv(table, { rows: "selected" })).toBe(
      ["Order,Customer,Total", "1002,Beta,-3"].join("\r\n"),
    );
  });

  it("omits the header and supports another delimiter", () => {
    const table = render();

    expect(tableToCsv(table, { header: false, delimiter: ";", rows: "selected" })).toBe(
      "1002;Beta;-3",
    );
  });

  it("quotes cells that contain a custom delimiter", () => {
    const table = render(row("1", "a;b"));

    expect(tableToCsv(table, { delimiter: ";" })).toContain('1;"a;b";1');
  });

  it("returns an empty string for a table without rows", () => {
    document.body.innerHTML = `<table id="empty"></table>`;

    expect(tableToCsv(document.getElementById("empty") as HTMLTableElement)).toBe("");
  });
});

describe("downloadCsv", () => {
  function stubDownload(): { blobs: Blob[]; link: () => HTMLAnchorElement | undefined } {
    const blobs: Blob[] = [];
    URL.createObjectURL = vi.fn((blob: Blob | MediaSource) => {
      blobs.push(blob as Blob);
      return "blob:csv";
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    return { blobs, link: () => click.mock.contexts[0] as HTMLAnchorElement | undefined };
  }

  async function firstBytes(blob: Blob): Promise<number[]> {
    const buffer = await new Promise<ArrayBuffer>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(blob);
    });

    return [...new Uint8Array(buffer).slice(0, 3)];
  }

  it("downloads a file with the given name and a UTF-8 BOM", async () => {
    const { blobs, link } = stubDownload();

    downloadCsv(render(), "orders.csv");

    expect(link()?.download).toBe("orders.csv");
    expect(blobs[0]?.type).toBe("text/csv;charset=utf-8");
    expect(await firstBytes(blobs[0]!)).toEqual([0xef, 0xbb, 0xbf]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:csv");
    expect(document.querySelector("a")).toBeNull();
  });

  it("omits the BOM when asked", async () => {
    const { blobs } = stubDownload();

    downloadCsv(render(), "orders.csv", { bom: false });

    expect(await firstBytes(blobs[0]!)).toEqual([...new TextEncoder().encode("Ord")]);
  });
});
