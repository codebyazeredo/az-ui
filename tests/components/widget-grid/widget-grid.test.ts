import { afterEach, describe, expect, it, vi } from "vitest";
import { WidgetGrid } from "../../../src/components/widget-grid";

function render(wrapper = "", gridAttributes = ""): WidgetGrid {
  document.body.innerHTML = `
    <div ${wrapper}>
      <div class="az-widget-grid" id="grid" ${gridAttributes}>
        <section class="az-widget" data-az-widget="sales" data-az-span="2" data-az-title="Sales">Sales</section>
        <section class="az-widget" data-az-widget="stock">Stock</section>
        <section class="az-widget" data-az-widget="late" data-az-span="3">Late orders</section>
      </div>
    </div>`;

  return new WidgetGrid("#grid");
}

function widget(id: string): HTMLElement {
  return document.querySelector(`[data-az-widget="${id}"]`) as HTMLElement;
}

function handle(id: string): HTMLElement {
  return widget(id).querySelector(".az-widget-resize") as HTMLElement;
}

function ids(): string[] {
  return [...document.querySelectorAll<HTMLElement>("#grid > .az-widget")].map(
    (item) => item.dataset.azWidget ?? "",
  );
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("WidgetGrid", () => {
  it("sets the column count and the span of every widget", () => {
    render();
    const grid = document.getElementById("grid") as HTMLElement;

    expect(grid.style.getPropertyValue("--az-widget-columns")).toBe("4");
    expect(widget("sales").style.getPropertyValue("--az-widget-span")).toBe("2");
    expect(widget("stock").style.getPropertyValue("--az-widget-span")).toBe("1");
  });

  it("reads the column count from data-az-columns", () => {
    render("", 'data-az-columns="6"');

    expect(
      (document.getElementById("grid") as HTMLElement).style.getPropertyValue(
        "--az-widget-columns",
      ),
    ).toBe("6");
    expect(handle("sales").getAttribute("aria-valuemax")).toBe("6");
  });

  it("adds an accessible resize handle to each widget", () => {
    render();
    const resize = handle("sales");

    expect(resize.getAttribute("role")).toBe("separator");
    expect(resize.getAttribute("aria-label")).toBe("Resize Sales");
    expect(resize.getAttribute("aria-valuenow")).toBe("2");
    expect(resize.getAttribute("aria-valuemin")).toBe("1");
    expect(handle("stock").getAttribute("aria-label")).toBe("Resize stock");
  });

  it("layout lists the widgets in DOM order with their spans", () => {
    const grid = render();

    expect(grid.layout).toEqual([
      { id: "sales", span: 2 },
      { id: "stock", span: 1 },
      { id: "late", span: 3 },
    ]);
  });

  it("setLayout with the current layout changes nothing", () => {
    const grid = render();
    const before = grid.layout;

    grid.setLayout(before);

    expect(grid.layout).toEqual(before);
    expect(ids()).toEqual(["sales", "stock", "late"]);
  });

  it("setLayout reorders the widgets and applies the spans", () => {
    const grid = render();

    grid.setLayout([
      { id: "late", span: 1 },
      { id: "sales", span: 4 },
      { id: "stock", span: 2 },
    ]);

    expect(ids()).toEqual(["late", "sales", "stock"]);
    expect(grid.layout).toEqual([
      { id: "late", span: 1 },
      { id: "sales", span: 4 },
      { id: "stock", span: 2 },
    ]);
  });

  it("setLayout ignores unknown ids and keeps missing widgets at the end", () => {
    const grid = render();

    grid.setLayout([
      { id: "ghost", span: 2 },
      { id: "late", span: 2 },
    ]);

    expect(ids()).toEqual(["late", "sales", "stock"]);
  });

  it("setLayout limits the spans to the available columns", () => {
    const grid = render();

    grid.setLayout([
      { id: "sales", span: 99 },
      { id: "stock", span: 0 },
    ]);

    expect(grid.layout.map((item) => item.span)).toEqual([4, 1, 3]);
  });

  it("setLayout does not emit az:widgetgrid:change", () => {
    const grid = render();
    const changed = vi.fn();
    document.getElementById("grid")!.addEventListener("az:widgetgrid:change", changed);

    grid.setLayout([{ id: "late", span: 1 }]);

    expect(changed).not.toHaveBeenCalled();
  });

  it("resizes with the arrow keys, Home and End and updates aria-valuenow", () => {
    render();

    press(handle("stock"), "ArrowRight");
    expect(widget("stock").dataset.azSpan).toBe("2");
    expect(handle("stock").getAttribute("aria-valuenow")).toBe("2");

    press(handle("stock"), "End");
    expect(widget("stock").dataset.azSpan).toBe("4");

    press(handle("stock"), "ArrowRight");
    expect(widget("stock").dataset.azSpan).toBe("4");

    press(handle("stock"), "Home");
    expect(widget("stock").dataset.azSpan).toBe("1");
  });

  it("swaps the arrows in rtl", () => {
    render('dir="rtl"');

    press(handle("stock"), "ArrowLeft");

    expect(widget("stock").dataset.azSpan).toBe("2");
  });

  it("emits az:widgetgrid:change with the layout when a widget is resized", () => {
    const grid = render();
    const changed = vi.fn();
    document.getElementById("grid")!.addEventListener("az:widgetgrid:change", (event) => {
      changed((event as CustomEvent).detail.layout);
    });

    grid.resize("stock", 3);
    grid.resize("stock", 3);

    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed.mock.calls[0]?.[0]).toContainEqual({ id: "stock", span: 3 });
  });

  it("emits az:widgetgrid:change after a widget is dropped in a new place", async () => {
    render();
    const changed = vi.fn();
    document.getElementById("grid")!.addEventListener("az:widgetgrid:change", (event) => {
      changed((event as CustomEvent).detail.layout.map((item: { id: string }) => item.id));
    });
    const moved = widget("late");

    document.getElementById("grid")!.prepend(moved);
    moved.dispatchEvent(
      new CustomEvent("az:sortable:drop", {
        bubbles: true,
        cancelable: true,
        detail: { item: moved },
      }),
    );
    await flush();

    expect(changed).toHaveBeenCalledWith(["late", "sales", "stock"]);
  });

  it("does not emit change when the drop was cancelled", async () => {
    render();
    const changed = vi.fn();
    const grid = document.getElementById("grid")!;
    grid.addEventListener("az:widgetgrid:change", changed);
    grid.addEventListener("az:sortable:drop", (event) => event.preventDefault());
    const moved = widget("late");

    moved.dispatchEvent(
      new CustomEvent("az:sortable:drop", {
        bubbles: true,
        cancelable: true,
        detail: { item: moved },
      }),
    );
    await flush();

    expect(changed).not.toHaveBeenCalled();
  });

  it("makes the widgets sortable in a grid", () => {
    render();

    expect(widget("sales").draggable).toBe(true);
    expect(widget("sales").tabIndex).toBe(0);
  });

  it("destroy removes the handles and the variables and stops the sorting", () => {
    const grid = render();

    grid.destroy();

    expect(document.querySelector(".az-widget-resize")).toBeNull();
    expect(
      (document.getElementById("grid") as HTMLElement).style.getPropertyValue(
        "--az-widget-columns",
      ),
    ).toBe("");
    expect(widget("sales").style.getPropertyValue("--az-widget-span")).toBe("");
    expect(widget("sales").hasAttribute("draggable")).toBe(false);
  });

  it("throws for an invalid column count, no widgets, a widget without id and a second init", () => {
    document.body.innerHTML = `<div id="grid" class="az-widget-grid" data-az-columns="-2"><div class="az-widget" data-az-widget="a"></div></div>`;
    expect(() => new WidgetGrid("#grid")).toThrow("columns must be");

    document.body.innerHTML = `<div id="grid"></div>`;
    expect(() => new WidgetGrid("#grid")).toThrow("at least one .az-widget");

    document.body.innerHTML = `<div id="grid"><div class="az-widget"></div></div>`;
    expect(() => new WidgetGrid("#grid")).toThrow("data-az-widget id");

    const grid = render();
    expect(() => new WidgetGrid(grid.element)).toThrow("already initialized");
  });
});
