import { afterEach, describe, expect, it, vi } from "vitest";
import { DualListbox } from "../../../src/components/dual-listbox";

function render(): DualListbox {
  document.body.innerHTML = `
    <select id="docs" name="docs" multiple>
      <option value="a">Alpha</option>
      <option value="b" selected>Bravo</option>
      <option value="c">Charlie</option>
      <option value="d" disabled>Delta</option>
    </select>`;

  return new DualListbox("#docs");
}

function lists(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(".az-dual-listbox-list")];
}

function itemsIn(index: number, visibleOnly = false): string[] {
  return [...lists()[index]!.querySelectorAll<HTMLElement>('[role="option"]')]
    .filter((item) => !visibleOnly || !item.hidden)
    .map((item) => item.textContent ?? "");
}

function item(text: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (candidate) => candidate.textContent === text,
  )!;
}

function action(name: string): void {
  document.querySelector<HTMLElement>(`[data-action="${name}"]`)!.click();
}

function selectedValues(): string[] {
  return [...(document.getElementById("docs") as HTMLSelectElement).selectedOptions].map(
    (option) => option.value,
  );
}

function search(index: number, text: string): void {
  const field = document.querySelectorAll<HTMLInputElement>(".az-dual-listbox-search")[index]!;
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("DualListbox", () => {
  it("splits the options between the available and selected lists", () => {
    const box = render();

    expect(itemsIn(0)).toEqual(["Alpha", "Charlie", "Delta"]);
    expect(itemsIn(1)).toEqual(["Bravo"]);
    expect(box.values).toEqual(["b"]);
    expect((document.getElementById("docs") as HTMLElement).hidden).toBe(true);
  });

  it("labels the lists as multi-select listboxes", () => {
    render();
    const [available] = lists();

    expect(available!.getAttribute("role")).toBe("listbox");
    expect(available!.getAttribute("aria-multiselectable")).toBe("true");
    expect(document.getElementById(available!.getAttribute("aria-labelledby")!)!.textContent).toBe(
      "Available",
    );
  });

  it("adds the marked items and syncs the select in the selected order", () => {
    const box = render();

    item("Alpha").click();
    action("add");

    expect(itemsIn(1)).toEqual(["Bravo", "Alpha"]);
    expect(box.values).toEqual(["b", "a"]);
    expect(selectedValues()).toEqual(["b", "a"]);
  });

  it("does nothing when no item is marked", () => {
    const box = render();

    action("add");

    expect(box.values).toEqual(["b"]);
  });

  it("add all skips disabled options", () => {
    const box = render();

    action("add-all");

    expect(box.values).toEqual(["b", "a", "c"]);
    expect(itemsIn(0)).toEqual(["Delta"]);
  });

  it("remove all returns everything in the original order", () => {
    render();
    action("add-all");

    action("remove-all");

    expect(itemsIn(0)).toEqual(["Alpha", "Bravo", "Charlie", "Delta"]);
    expect(selectedValues()).toEqual([]);
  });

  it("removes only the marked selected items", () => {
    const box = render();
    action("add-all");

    item("Alpha").click();
    action("remove");

    expect(box.values).toEqual(["b", "c"]);
    expect(itemsIn(0)).toEqual(["Alpha", "Delta"]);
  });

  it("moves a single item with a double click", () => {
    const box = render();

    item("Charlie").dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

    expect(box.values).toEqual(["b", "c"]);
  });

  it("does not mark or move disabled options", () => {
    const box = render();

    item("Delta").click();
    expect(item("Delta").getAttribute("aria-selected")).toBe("false");

    item("Delta").dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(box.values).toEqual(["b"]);
  });

  it("filters each list with its own search field", () => {
    render();

    search(0, "ch");

    expect(itemsIn(0, true)).toEqual(["Charlie"]);
    expect(itemsIn(1, true)).toEqual(["Bravo"]);
  });

  it("add all moves only the items that match the search", () => {
    const box = render();

    search(0, "al");
    action("add-all");

    expect(box.values).toEqual(["b", "a"]);
  });

  it("syncs the select when an item is dropped into the other list", async () => {
    const box = render();
    const dropped = item("Charlie");

    lists()[1]!.append(dropped);
    dropped.dispatchEvent(
      new CustomEvent("az:sortable:drop", {
        bubbles: true,
        cancelable: true,
        detail: { item: dropped },
      }),
    );
    await flush();

    expect(box.values).toEqual(["b", "c"]);
    expect(selectedValues()).toEqual(["b", "c"]);
  });

  it("reorders the options when the selected list is reordered", async () => {
    const box = render();
    action("add-all");
    const first = item("Bravo");

    lists()[1]!.append(first);
    first.dispatchEvent(
      new CustomEvent("az:sortable:drop", {
        bubbles: true,
        cancelable: true,
        detail: { item: first },
      }),
    );
    await flush();

    expect(box.values).toEqual(["a", "c", "b"]);
    const select = document.getElementById("docs") as HTMLSelectElement;
    expect([...select.options].slice(0, 3).map((option) => option.value)).toEqual(["a", "c", "b"]);
  });

  it("refuses to drop a disabled option", () => {
    render();
    const disabled = item("Delta");
    const event = new CustomEvent("az:sortable:drop", {
      bubbles: true,
      cancelable: true,
      detail: { item: disabled },
    });

    disabled.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("emits az:duallistbox:change with the values", () => {
    render();
    const changed = vi.fn();
    document.addEventListener("az:duallistbox:change", (event) => {
      changed((event as CustomEvent).detail.values);
    });

    item("Alpha").click();
    action("add");

    expect(changed).toHaveBeenCalledWith(["b", "a"]);
  });

  it("refresh reads the select again", () => {
    const box = render();

    (document.getElementById("docs") as HTMLSelectElement).options[0]!.selected = true;
    box.refresh();

    expect(box.values).toEqual(["a", "b"]);
  });

  it("destroy shows the select again and removes the interface", () => {
    const box = render();

    box.destroy();

    expect((document.getElementById("docs") as HTMLElement).hidden).toBe(false);
    expect(document.querySelector(".az-dual-listbox")).toBeNull();
  });

  it("throws on a single select and when initialized twice", () => {
    document.body.innerHTML = `<select id="one"><option>x</option></select>`;
    expect(() => new DualListbox("#one")).toThrow("select multiple");

    document.body.innerHTML = `<select id="docs" multiple></select>`;
    const box = new DualListbox("#docs");
    expect(() => new DualListbox(box.element)).toThrow("already initialized");
  });
});
