import { afterEach, describe, expect, it, vi } from "vitest";
import { TableColumns } from "../../../src/components/table";

const DEFAULT_WIDTHS: Record<string, number> = { h1: 60, h2: 120, h3: 200 };

function render(wrapper = "", headerAttributes: Record<string, string> = {}): TableColumns {
  const attributes = (id: string): string => headerAttributes[id] ?? "";
  document.body.innerHTML = `
    <div ${wrapper}>
      <table id="orders">
        <thead>
          <tr>
            <th id="h1" ${attributes("h1")}>Order</th>
            <th id="h2" ${attributes("h2")}>Customer</th>
            <th id="h3" ${attributes("h3")}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr><td id="a1">1</td><td id="a2">Acme</td><td id="a3">10</td></tr>
          <tr><td id="b1">2</td><td id="b2">Beta</td><td id="b3">20</td></tr>
        </tbody>
      </table>
    </div>`;
  for (const [id, fallback] of Object.entries(DEFAULT_WIDTHS)) {
    const header = document.getElementById(id) as HTMLElement;
    header.getBoundingClientRect = () =>
      ({ width: parseFloat(header.style.width) || fallback }) as DOMRect;
  }

  return new TableColumns("#orders");
}

function header(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function handleOf(id: string): HTMLElement {
  return header(id).querySelector(".az-table-resize")!;
}

function press(target: HTMLElement, key: string, shiftKey = false): void {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }),
  );
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TableColumns resizing", () => {
  it("adds a separator handle only to resizable headers", () => {
    render("", { h2: "data-az-resizable" });
    const handle = handleOf("h2");

    expect(handle.getAttribute("role")).toBe("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("vertical");
    expect(handle.getAttribute("aria-label")).toBe("Resize column Customer");
    expect(handle.tabIndex).toBe(0);
    expect(header("h1").querySelector(".az-table-resize")).toBeNull();
  });

  it("uses a fixed table layout", () => {
    render();

    expect(document.getElementById("orders")!.classList.contains("az-table-fixed")).toBe(true);
  });

  it("resize sets the header width in pixels", () => {
    const columns = render();

    columns.resize(1, 150.4);

    expect(header("h2").style.width).toBe("150px");
  });

  it("never goes below the minimum width", () => {
    const columns = render("", { h2: 'data-az-resizable data-az-min-width="100"' });

    columns.resize(1, 20);
    expect(header("h2").style.width).toBe("100px");

    columns.resize(0, 10);
    expect(header("h1").style.width).toBe("48px");
  });

  it("changes the width with the arrow keys and Shift", () => {
    render("", { h2: "data-az-resizable" });

    press(handleOf("h2"), "ArrowRight");
    expect(header("h2").style.width).toBe("130px");

    press(handleOf("h2"), "ArrowLeft", true);
    expect(header("h2").style.width).toBe("80px");
    expect(handleOf("h2").getAttribute("aria-valuenow")).toBe("80");
  });

  it("swaps the arrows in rtl", () => {
    render('dir="rtl"', { h2: "data-az-resizable" });

    press(handleOf("h2"), "ArrowLeft");

    expect(header("h2").style.width).toBe("130px");
  });

  it("ignores other keys", () => {
    render("", { h2: "data-az-resizable" });

    press(handleOf("h2"), "a");

    expect(header("h2").style.width).toBe("");
  });

  it("emits az:tablecolumns:resize with the column and width", () => {
    const columns = render();
    const resized = vi.fn();
    document.getElementById("orders")!.addEventListener("az:tablecolumns:resize", (event) => {
      resized((event as CustomEvent).detail);
    });

    columns.resize(2, 250);

    expect(resized).toHaveBeenCalledWith({ column: 2, width: 250 });
  });
});

describe("TableColumns sticky columns", () => {
  it("marks every cell of a sticky column", () => {
    render("", { h1: "data-az-sticky" });

    for (const id of ["h1", "a1", "b1"]) {
      expect(document.getElementById(id)!.classList.contains("az-table-sticky")).toBe(true);
    }
    expect(document.getElementById("a2")!.classList.contains("az-table-sticky")).toBe(false);
  });

  it("offsets each sticky column by the width of the previous ones", () => {
    render("", { h1: "data-az-sticky", h2: "data-az-sticky" });

    expect(document.getElementById("a1")!.style.getPropertyValue("inset-inline-start")).toBe("0px");
    expect(document.getElementById("a2")!.style.getPropertyValue("inset-inline-start")).toBe(
      "60px",
    );
    expect(document.getElementById("b2")!.style.getPropertyValue("inset-inline-start")).toBe(
      "60px",
    );
  });

  it("recalculates the offsets after a resize", () => {
    const columns = render("", { h1: "data-az-sticky", h2: "data-az-sticky" });

    columns.resize(0, 100);

    expect(document.getElementById("a2")!.style.getPropertyValue("inset-inline-start")).toBe(
      "100px",
    );
  });

  it("refreshSticky reads the headers again", () => {
    const columns = render("", { h1: "data-az-sticky" });

    header("h1").removeAttribute("data-az-sticky");
    header("h3").setAttribute("data-az-sticky", "");
    columns.refreshSticky();

    expect(document.getElementById("a1")!.classList.contains("az-table-sticky")).toBe(false);
    expect(document.getElementById("a3")!.classList.contains("az-table-sticky")).toBe(true);
  });
});

describe("TableColumns lifecycle", () => {
  it("works when initialized on a wrapper element", () => {
    document.body.innerHTML = `<div id="wrap"><table><thead><tr><th data-az-resizable>A</th></tr></thead></table></div>`;

    new TableColumns("#wrap");

    expect(document.querySelector(".az-table-resize")).not.toBeNull();
  });

  it("throws without a table and when initialized twice", () => {
    document.body.innerHTML = `<div id="empty"></div>`;
    expect(() => new TableColumns("#empty")).toThrow("requires a <table>");

    const columns = render();
    expect(() => new TableColumns(columns.element)).toThrow("already initialized");
  });

  it("destroy removes handles, widths, sticky styles and the fixed class", () => {
    const columns = render("", { h1: "data-az-sticky", h2: "data-az-resizable" });
    columns.resize(1, 200);

    columns.destroy();

    expect(document.querySelector(".az-table-resize")).toBeNull();
    expect(header("h2").style.width).toBe("");
    expect(document.getElementById("a1")!.classList.contains("az-table-sticky")).toBe(false);
    expect(document.getElementById("orders")!.classList.contains("az-table-fixed")).toBe(false);
  });
});
