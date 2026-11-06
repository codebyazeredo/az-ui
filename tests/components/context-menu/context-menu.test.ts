import { afterEach, describe, expect, it } from "vitest";
import { ContextMenu } from "../../../src/components/context-menu";

function render(): ContextMenu {
  Object.defineProperty(document.documentElement, "clientWidth", {
    value: 1000,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    value: 800,
    configurable: true,
  });
  document.body.innerHTML = `
    <p id="outside">outside</p>
    <div id="area" data-az-menu="#menu">Right click here</div>
    <div class="az-context-menu" id="menu" hidden>
      <button class="az-dropdown-item" id="open">Open</button>
      <button class="az-dropdown-item" id="off" disabled>Disabled</button>
      <button class="az-dropdown-item" id="delete">Delete</button>
    </div>`;

  return new ContextMenu("#area");
}

function openAt(x: number, y: number): MouseEvent {
  const event = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  document.getElementById("area")!.dispatchEvent(event);
  return event;
}

function press(key: string, target: Element = document.activeElement ?? document.body): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ContextMenu", () => {
  it("wires menu semantics and starts closed", () => {
    const menu = render();

    expect(menu.isOpen).toBe(false);
    expect(document.getElementById("menu")!.hidden).toBe(true);
    expect(document.getElementById("menu")!.getAttribute("role")).toBe("menu");
    expect(document.getElementById("open")!.getAttribute("role")).toBe("menuitem");
  });

  it("opens on contextmenu, replaces the native menu and focuses the first item", () => {
    const menu = render();

    const event = openAt(120, 80);

    expect(event.defaultPrevented).toBe(true);
    expect(menu.isOpen).toBe(true);
    expect(document.getElementById("menu")!.style.left).toBe("120px");
    expect(document.getElementById("menu")!.style.top).toBe("80px");
    expect(document.activeElement?.id).toBe("open");
  });

  it("navigates enabled items with the keyboard", () => {
    render();
    openAt(10, 10);

    press("ArrowDown");
    expect(document.activeElement?.id).toBe("delete");
    press("ArrowDown");
    expect(document.activeElement?.id).toBe("open");
    press("End");
    expect(document.activeElement?.id).toBe("delete");
  });

  it("closes with Escape restoring focus, on item click, with Tab and outside", () => {
    const menu = render();
    const area = document.getElementById("area")!;
    area.tabIndex = 0;
    area.focus();

    openAt(10, 10);
    press("Escape");
    expect(menu.isOpen).toBe(false);
    expect(document.activeElement).toBe(area);

    openAt(10, 10);
    document.getElementById("delete")!.click();
    expect(menu.isOpen).toBe(false);

    openAt(10, 10);
    press("Tab", document.getElementById("open")!);
    expect(menu.isOpen).toBe(false);

    openAt(10, 10);
    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(menu.isOpen).toBe(false);
  });

  it("reopens at the new position on a second contextmenu", () => {
    const menu = render();

    openAt(10, 10);
    openAt(50, 60);

    expect(menu.isOpen).toBe(true);
    expect(document.getElementById("menu")!.style.left).toBe("50px");
  });

  it("emits a cancelable show event", () => {
    const menu = render();
    const prevent = (event: Event): void => event.preventDefault();

    document.addEventListener("az:context-menu:show", prevent);
    openAt(10, 10);
    document.removeEventListener("az:context-menu:show", prevent);

    expect(menu.isOpen).toBe(false);
  });

  it("accepts the menu as an option and rejects a missing menu", () => {
    document.body.innerHTML = '<div id="area"></div><div id="menu"></div>';
    expect(() => new ContextMenu("#area", { menu: "#menu" })).not.toThrow();

    document.body.innerHTML = '<div id="area" data-az-menu="#none"></div><div id="other"></div>';
    expect(() => new ContextMenu("#area")).toThrow('"#none" was not found');
    expect(() => new ContextMenu(document.getElementById("other")!)).toThrow("was not found");
  });

  it("removes attributes and listeners on destroy", () => {
    const menu = render();

    menu.destroy();
    const event = openAt(10, 10);

    expect(event.defaultPrevented).toBe(false);
    expect(document.getElementById("menu")!.hasAttribute("role")).toBe(false);
  });
});
