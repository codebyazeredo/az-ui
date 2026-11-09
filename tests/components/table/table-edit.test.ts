import { afterEach, describe, expect, it, vi } from "vitest";
import { TableEdit } from "../../../src/components/table";

function render(): TableEdit {
  document.body.innerHTML = `
    <table id="orders">
      <thead><tr><th>Order</th><th>Customer</th><th>Quantity</th></tr></thead>
      <tbody>
        <tr id="r1">
          <td>1001</td>
          <td id="name" data-az-edit="text"><strong>Acme</strong></td>
          <td id="qty" data-az-edit="number">10</td>
        </tr>
        <tr id="r2"><td>1002</td><td id="plain">Beta</td><td id="qty2" data-az-edit="number" data-az-value="5.5">5,5 kg</td></tr>
      </tbody>
    </table>`;

  return new TableEdit("#orders");
}

function cell(id: string): HTMLTableCellElement {
  return document.getElementById(id) as HTMLTableCellElement;
}

function input(): HTMLInputElement {
  return document.querySelector("#orders input") as HTMLInputElement;
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function startEditing(id: string): void {
  cell(id).dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("TableEdit", () => {
  it("makes the editable cells focusable and leaves the others alone", () => {
    render();

    expect(cell("name").tabIndex).toBe(0);
    expect(cell("plain").hasAttribute("tabindex")).toBe(false);
  });

  it("opens a field with the current value on double click", () => {
    const table = render();

    startEditing("name");

    expect(table.isEditing).toBe(true);
    expect(input().value).toBe("Acme");
    expect(input().type).toBe("text");
    expect(input().getAttribute("aria-label")).toBe("Customer");
    expect(document.activeElement).toBe(input());
  });

  it("opens with Enter or F2 on the focused cell", () => {
    render();

    press(cell("name"), "Enter");
    expect(input()).not.toBeNull();
    press(input(), "Escape");

    press(cell("name"), "F2");
    expect(input()).not.toBeNull();
  });

  it("uses a number field and data-az-value as the editable value", () => {
    render();

    startEditing("qty2");

    expect(input().type).toBe("number");
    expect(input().value).toBe("5.5");
  });

  it("ignores cells that are not editable", () => {
    const table = render();

    startEditing("plain");

    expect(table.isEditing).toBe(false);
  });

  it("commits with Enter, updates the text and emits az:tableedit:commit", () => {
    const table = render();
    const committed = vi.fn();
    document.getElementById("orders")!.addEventListener("az:tableedit:commit", (event) => {
      const { oldValue, newValue, column, row } = (event as CustomEvent).detail;
      committed(oldValue, newValue, column, row.id);
    });

    startEditing("qty");
    input().value = "12";
    press(input(), "Enter");

    expect(committed).toHaveBeenCalledWith("10", "12", 2, "r1");
    expect(cell("qty").textContent).toBe("12");
    expect(cell("qty").dataset.azValue).toBe("12");
    expect(table.isEditing).toBe(false);
    expect(document.activeElement).toBe(cell("qty"));
  });

  it("does not emit commit when the value did not change", () => {
    render();
    const committed = vi.fn();
    document.getElementById("orders")!.addEventListener("az:tableedit:commit", committed);

    startEditing("name");
    press(input(), "Enter");

    expect(committed).not.toHaveBeenCalled();
    expect(cell("name").innerHTML).toBe("<strong>Acme</strong>");
  });

  it("cancels with Escape without emitting commit and restores the cell", () => {
    render();
    const committed = vi.fn();
    document.getElementById("orders")!.addEventListener("az:tableedit:commit", committed);

    startEditing("name");
    input().value = "Changed";
    press(input(), "Escape");

    expect(committed).not.toHaveBeenCalled();
    expect(cell("name").innerHTML).toBe("<strong>Acme</strong>");
    expect(document.activeElement).toBe(cell("name"));
  });

  it("restores the old content when az:tableedit:commit is prevented", () => {
    render();
    document.getElementById("orders")!.addEventListener("az:tableedit:commit", (event) => {
      event.preventDefault();
    });

    startEditing("name");
    input().value = "Rejected";
    press(input(), "Enter");

    expect(cell("name").innerHTML).toBe("<strong>Acme</strong>");
    expect(cell("name").dataset.azValue).toBeUndefined();
  });

  it("commits when the field loses focus", () => {
    render();

    startEditing("name");
    input().value = "Beta Co";
    input().dispatchEvent(new Event("blur"));

    expect(cell("name").textContent).toBe("Beta Co");
  });

  it("commits the current cell when another one starts editing", () => {
    const table = render();

    startEditing("name");
    input().value = "Gamma";
    startEditing("qty");

    expect(cell("name").textContent).toBe("Gamma");
    expect(input().type).toBe("number");
    expect(table.isEditing).toBe(true);
  });

  it("destroy cancels an edit in progress and removes the tabindex", () => {
    const table = render();
    startEditing("name");

    table.destroy();

    expect(cell("name").innerHTML).toBe("<strong>Acme</strong>");
    expect(cell("name").hasAttribute("tabindex")).toBe(false);
    cell("qty").dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(document.querySelector("#orders input")).toBeNull();
  });
});
