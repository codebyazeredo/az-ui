import { afterEach, describe, expect, it, vi } from "vitest";
import { CommandMenu } from "../../../src/components/command-menu";
import type { CommandMenuOptions } from "../../../src/components/command-menu";

function render(options: Partial<CommandMenuOptions> = {}): CommandMenu {
  document.body.innerHTML = `
    <button id="opener">Open</button>
    <div class="az-command-menu" id="cmd">
      <div class="az-command-menu-panel" aria-label="Commands">
        <input class="az-command-menu-input" id="input" aria-label="Search" />
        <div class="az-command-menu-list">
          <button class="az-command-menu-item" id="orders" data-az-command="orders">Open orders</button>
          <button class="az-command-menu-item" id="customers" data-az-command="customers">Customers</button>
          <a class="az-command-menu-item" id="settings" href="#settings" data-az-command="settings">Configurações</a>
        </div>
        <p class="az-command-menu-empty" id="empty" hidden>No results</p>
      </div>
    </div>`;

  return new CommandMenu("#cmd", options);
}

function type(text: string): void {
  const input = document.getElementById("input") as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function press(key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  (document.activeElement ?? document.body).dispatchEvent(event);
  return event;
}

function visibleIds(): string[] {
  return [...document.querySelectorAll<HTMLElement>(".az-command-menu-item")]
    .filter((item) => !item.hidden)
    .map((item) => item.id);
}

function activeId(): string | null {
  return document.querySelector('[aria-selected="true"]')?.id ?? null;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("CommandMenu", () => {
  it("starts hidden with combobox and listbox semantics", () => {
    const menu = render();
    const input = document.getElementById("input")!;

    expect(menu.isOpen).toBe(false);
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).toBe(
      document.querySelector(".az-command-menu-list")!.id,
    );
    expect(document.querySelector(".az-command-menu-list")!.getAttribute("role")).toBe("listbox");
    expect(document.getElementById("orders")!.getAttribute("role")).toBe("option");
    expect(document.querySelector(".az-command-menu-panel")!.getAttribute("role")).toBe("dialog");
  });

  it("opens with the input focused, all commands visible and the first one active", () => {
    const menu = render();

    menu.show();

    expect(menu.isOpen).toBe(true);
    expect(document.activeElement?.id).toBe("input");
    expect(visibleIds()).toEqual(["orders", "customers", "settings"]);
    expect(activeId()).toBe("orders");
    expect(document.getElementById("input")!.getAttribute("aria-activedescendant")).toBe("orders");
  });

  it("filters ignoring case and accents, and shows the empty message", () => {
    const menu = render();
    menu.show();

    type("CUST");
    expect(visibleIds()).toEqual(["customers"]);
    expect(activeId()).toBe("customers");

    type("configuracoes");
    expect(visibleIds()).toEqual(["settings"]);

    type("zzz");
    expect(visibleIds()).toEqual([]);
    expect(document.getElementById("empty")!.hidden).toBe(false);
    expect(document.getElementById("input")!.hasAttribute("aria-activedescendant")).toBe(false);

    type("");
    expect(visibleIds()).toHaveLength(3);
    expect(document.getElementById("empty")!.hidden).toBe(true);
  });

  it("moves the active command with arrows, wrapping, and keeps focus on the input", () => {
    render().show();

    press("ArrowDown");
    expect(activeId()).toBe("customers");
    press("ArrowUp");
    press("ArrowUp");
    expect(activeId()).toBe("settings");
    expect(document.activeElement?.id).toBe("input");
  });

  it("runs the active command on Enter, emits select and closes", () => {
    const menu = render();
    const selected = vi.fn((event: Event) => (event as CustomEvent).detail);
    const clicked = vi.fn();
    document.addEventListener("az:command-menu:select", selected);
    document.getElementById("customers")!.addEventListener("click", clicked);
    menu.show();

    press("ArrowDown");
    press("Enter");

    expect(clicked).toHaveBeenCalledTimes(1);
    expect(selected).toHaveReturnedWith({ command: "customers", label: "Customers" });
    expect(menu.isOpen).toBe(false);
    document.removeEventListener("az:command-menu:select", selected);
  });

  it("selects a command by clicking it", () => {
    const menu = render();
    menu.show();

    document.getElementById("orders")!.click();

    expect(menu.isOpen).toBe(false);
  });

  it("does nothing on Enter when no command matches", () => {
    const menu = render();
    menu.show();
    type("zzz");

    press("Enter");

    expect(menu.isOpen).toBe(true);
  });

  it("resets the query every time it opens", () => {
    const menu = render();
    menu.show();
    type("cust");
    menu.hide();

    menu.show();

    expect((document.getElementById("input") as HTMLInputElement).value).toBe("");
    expect(visibleIds()).toHaveLength(3);
  });

  it("toggles with Ctrl+K or Cmd+K and ignores other keys", () => {
    const menu = render();

    const event = press("k", { ctrlKey: true });
    expect(menu.isOpen).toBe(true);
    expect(event.defaultPrevented).toBe(true);

    press("k", { metaKey: true });
    expect(menu.isOpen).toBe(false);

    press("k");
    press("j", { ctrlKey: true });
    expect(menu.isOpen).toBe(false);
  });

  it("supports a custom shortcut and disabling it", () => {
    const custom = render({ shortcut: "p" });
    press("k", { ctrlKey: true });
    expect(custom.isOpen).toBe(false);
    press("P", { ctrlKey: true });
    expect(custom.isOpen).toBe(true);
    custom.destroy();

    const disabled = render({ shortcut: null });
    press("k", { ctrlKey: true });
    expect(disabled.isOpen).toBe(false);
  });

  it("closes with Escape and the backdrop like other overlays, returning focus", () => {
    const menu = render();
    document.getElementById("opener")!.focus();

    menu.show();
    press("Escape");
    expect(menu.isOpen).toBe(false);
    expect(document.activeElement?.id).toBe("opener");

    menu.show();
    document.getElementById("cmd")!.click();
    expect(menu.isOpen).toBe(false);
  });

  it("removes semantics, shortcut and listeners on destroy", () => {
    const menu = render();

    menu.destroy();
    press("k", { ctrlKey: true });

    expect(menu.isOpen).toBe(false);
    expect(document.getElementById("input")!.hasAttribute("role")).toBe(false);
    expect(document.getElementById("orders")!.hasAttribute("role")).toBe(false);
  });

  it("rejects incomplete markup", () => {
    document.body.innerHTML = '<div id="cmd"><div class="az-command-menu-panel"></div></div>';

    expect(() => new CommandMenu("#cmd")).toThrow(".az-command-menu-input");
  });
});
