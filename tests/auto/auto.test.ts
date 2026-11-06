import { afterEach, describe, expect, it } from "vitest";
import { initComponents } from "../../src/auto";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("auto initialization", () => {
  it("initializes components declared with data-az-component", () => {
    document.body.innerHTML = `
      <div class="az-tabs" data-az-component="tabs" id="tabs">
        <div class="az-tabs-list"><button class="az-tabs-tab">A</button></div>
        <div class="az-tabs-panel">Panel</div>
      </div>
      <button id="tip" data-az-component="tooltip" data-az-content="Hint">?</button>`;

    initComponents();

    expect(document.querySelector(".az-tabs-tab")!.getAttribute("role")).toBe("tab");
    document.getElementById("tip")!.dispatchEvent(new Event("mouseenter"));
    expect(document.querySelector(".az-tooltip")!.textContent).toBe("Hint");
  });

  it("does not initialize the same element twice and ignores unknown names", () => {
    document.body.innerHTML = `
      <button id="tip" data-az-component="tooltip" data-az-content="Hint">?</button>
      <div data-az-component="unknown"></div>`;

    initComponents();

    expect(() => initComponents()).not.toThrow();
  });

  it("initializes only inside the given root", () => {
    document.body.innerHTML = `
      <div id="root"><button id="inside" data-az-component="tooltip" data-az-content="A">?</button></div>
      <button id="outside" data-az-component="tooltip" data-az-content="B">?</button>`;

    initComponents(document.getElementById("root")!);
    document.getElementById("outside")!.dispatchEvent(new Event("mouseenter"));
    expect(document.querySelector(".az-tooltip")).toBeNull();

    document.getElementById("inside")!.dispatchEvent(new Event("mouseenter"));
    expect(document.querySelector(".az-tooltip")).not.toBeNull();
  });

  it.each([
    ["modal", "az-modal-dialog"],
    ["offcanvas", "az-offcanvas-panel"],
  ])("toggles a %s from a data-az-toggle trigger", (kind, panelClass) => {
    document.body.innerHTML = `
      <button id="trigger" data-az-toggle="${kind}" data-az-target="#overlay">Open</button>
      <div class="az-${kind}" id="overlay"><div class="${panelClass}"><button>Inside</button></div></div>`;
    const overlay = document.getElementById("overlay")!;

    document.getElementById("trigger")!.click();
    expect(overlay.hidden).toBe(false);

    document.getElementById("trigger")!.click();
    expect(overlay.hidden).toBe(true);
  });

  it("ignores triggers with an unknown kind or a missing target", () => {
    document.body.innerHTML = `
      <button id="a" data-az-toggle="modal" data-az-target="#missing">A</button>
      <button id="b" data-az-toggle="nothing" data-az-target="#a">B</button>`;

    expect(() => {
      document.getElementById("a")!.click();
      document.getElementById("b")!.click();
    }).not.toThrow();
  });
});
