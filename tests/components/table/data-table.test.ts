import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../../../src/components/table";
import type { DataTableOptions } from "../../../src/components/table";

const ROWS = [
  ["Ana", "30"],
  ["Bruno", "4"],
  ["Álvaro", "100"],
  ["Carla", "25"],
];

function render(options: Partial<DataTableOptions> = {}): DataTable {
  const rows = ROWS.map(
    ([name, age]) => `
      <tr>
        <td><input type="checkbox" data-az-select-row></td>
        <td>${name}</td>
        <td>${age}</td>
      </tr>`,
  ).join("");
  document.body.innerHTML = `
    <input id="search">
    <nav id="pages"></nav>
    <div id="table" class="az-table-wrap">
      <table class="az-table">
        <thead>
          <tr>
            <th><input type="checkbox" data-az-select-all></th>
            <th><button class="az-table-sort">Name</button></th>
            <th data-az-sort-type="number"><button class="az-table-sort">Age</button></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="az-table-empty" hidden>Nothing here</div>
    </div>`;

  return new DataTable("#table", options);
}

function names(): string[] {
  return [...document.querySelectorAll<HTMLTableRowElement>("tbody tr")]
    .filter((row) => !row.hidden)
    .map((row) => row.cells[1]!.textContent ?? "");
}

function sortButton(label: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>(".az-table-sort")].find(
    (button) => button.textContent === label,
  )!;
}

function typeSearch(value: string): void {
  const input = document.getElementById("search") as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

function toggle(checkbox: HTMLInputElement): void {
  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("DataTable sorting", () => {
  it("sorts text ascending then descending and updates aria-sort", () => {
    render();
    const header = sortButton("Name").closest("th")!;

    sortButton("Name").click();
    expect(names()).toEqual(["Álvaro", "Ana", "Bruno", "Carla"]);
    expect(header.getAttribute("aria-sort")).toBe("ascending");

    sortButton("Name").click();
    expect(names()).toEqual(["Carla", "Bruno", "Ana", "Álvaro"]);
    expect(header.getAttribute("aria-sort")).toBe("descending");
  });

  it("sorts numerically when the column is numeric and resets other headers", () => {
    render();

    sortButton("Name").click();
    sortButton("Age").click();

    expect(names()).toEqual(["Bruno", "Carla", "Ana", "Álvaro"]);
    expect(sortButton("Name").closest("th")!.getAttribute("aria-sort")).toBe("none");
  });

  it("leaves the order to the consumer when the sort event is cancelled", () => {
    render();
    document.addEventListener("az:datatable:sort", (event) => event.preventDefault(), {
      once: true,
    });

    sortButton("Name").click();

    expect(names()).toEqual(["Ana", "Bruno", "Álvaro", "Carla"]);
    expect(sortButton("Name").closest("th")!.getAttribute("aria-sort")).toBe("ascending");
  });
});

describe("DataTable search", () => {
  it("filters rows ignoring case and accents and shows the empty state", () => {
    const table = render({ search: "#search" });
    const empty = document.querySelector<HTMLElement>(".az-table-empty")!;

    typeSearch("alvaro");
    expect(names()).toEqual(["Álvaro"]);
    expect(empty.hidden).toBe(true);

    typeSearch("zzz");
    expect(names()).toEqual([]);
    expect(empty.hidden).toBe(false);

    table.destroy();
  });

  it("skips client filtering when the search event is cancelled", () => {
    render({ search: "#search" });
    document.addEventListener("az:datatable:search", (event) => event.preventDefault(), {
      once: true,
    });

    typeSearch("zzz");

    expect(names()).toHaveLength(4);
  });
});

describe("DataTable pagination", () => {
  it("shows one page at a time and follows the pagination control", () => {
    render({ pagination: "#pages", pageSize: 3 });

    expect(names()).toEqual(["Ana", "Bruno", "Álvaro"]);

    document.querySelector<HTMLElement>('[aria-label="Page 2"]')!.click();
    expect(names()).toEqual(["Carla"]);
  });

  it("recomputes pages after a search", () => {
    render({ pagination: "#pages", pageSize: 2, search: "#search" });

    typeSearch("a");

    expect(names()).toEqual(["Ana", "Álvaro"]);
    expect(document.querySelectorAll("#pages .az-pagination-item")).toHaveLength(4);

    typeSearch("carla");
    expect(names()).toEqual(["Carla"]);
    expect(document.querySelectorAll("#pages .az-pagination-item")).toHaveLength(3);
  });
});

describe("DataTable selection", () => {
  it("selects rows, marks them and keeps select-all in sync", () => {
    const table = render();
    const checkboxes = document.querySelectorAll<HTMLInputElement>("[data-az-select-row]");
    const selectAll = document.querySelector<HTMLInputElement>("[data-az-select-all]")!;
    const select = vi.fn((event: Event) => (event as CustomEvent).detail.count);
    document.addEventListener("az:datatable:select", select);

    toggle(checkboxes[0]!);
    expect(table.selectedRows).toHaveLength(1);
    expect(checkboxes[0]!.closest("tr")!.getAttribute("aria-selected")).toBe("true");
    expect(selectAll.indeterminate).toBe(true);

    toggle(selectAll);
    expect(table.selectedRows).toHaveLength(4);
    expect(selectAll.checked).toBe(true);
    expect(select).toHaveLastReturnedWith(4);

    table.clearSelection();
    document.removeEventListener("az:datatable:select", select);

    expect(table.selectedRows).toHaveLength(0);
    expect(selectAll.checked).toBe(false);
  });

  it("selects only the rows on the current page", () => {
    const table = render({ pagination: "#pages", pageSize: 3 });

    toggle(document.querySelector<HTMLInputElement>("[data-az-select-all]")!);

    expect(table.selectedRows).toHaveLength(3);
  });
});

describe("DataTable state", () => {
  it("hides and shows columns", () => {
    const table = render();

    table.setColumnVisible(2, false);
    expect(document.querySelectorAll("td[hidden], th[hidden]")).toHaveLength(5);

    table.setColumnVisible(2, true);
    expect(document.querySelectorAll("td[hidden], th[hidden]")).toHaveLength(0);
  });

  it("marks the table as busy while loading", () => {
    const table = render();

    table.setLoading(true);
    expect(table.element.getAttribute("aria-busy")).toBe("true");

    table.setLoading(false);
    expect(table.element.getAttribute("aria-busy")).toBe("false");
  });

  it("reapplies the state when the consumer replaces the rows", () => {
    const table = render();
    sortButton("Name").click();

    document.querySelector("tbody")!.innerHTML =
      "<tr><td></td><td>Zed</td><td>1</td></tr><tr><td></td><td>Abe</td><td>2</td></tr>";
    table.refresh();

    expect(names()).toEqual(["Abe", "Zed"]);
  });

  it("requires a table with a body and a text input for search", () => {
    document.body.innerHTML = `<div id="empty"></div><div id="t"><table><tbody></tbody></table></div><div id="s"></div>`;

    expect(() => new DataTable("#empty")).toThrow("tbody");
    expect(() => new DataTable("#t", { search: "#s" })).toThrow("input");
  });

  it("restores rows and listeners on destroy", () => {
    const table = render();
    sortButton("Name").click();

    table.destroy();
    sortButton("Name").click();

    expect(document.querySelectorAll("tbody tr[hidden]")).toHaveLength(0);
    expect(sortButton("Name").closest("th")!.getAttribute("aria-sort")).toBe("ascending");
  });
});
