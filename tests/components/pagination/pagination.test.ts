import { afterEach, describe, expect, it, vi } from "vitest";
import { Pagination } from "../../../src/components/pagination";

function render(config = {}): Pagination {
  document.body.innerHTML = `<nav id="pages" class="az-pagination"></nav>`;

  return new Pagination("#pages", { total: 100, pageSize: 10, ...config });
}

function labels(): string[] {
  return [...document.querySelectorAll("#pages > *")].map((node) => node.textContent ?? "");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Pagination", () => {
  it("renders previous, pages with ellipsis and next", () => {
    render({ page: 5 });

    expect(labels()).toEqual(["", "1", "…", "4", "5", "6", "…", "10", ""]);
    const buttons = document.querySelectorAll(".az-pagination-item");
    expect(buttons[0]!.querySelector("svg.az-icon")).not.toBeNull();
    expect(buttons[buttons.length - 1]!.querySelector("svg.az-icon")).not.toBeNull();
    expect(document.querySelector('[aria-current="page"]')!.textContent).toBe("5");
    expect(document.getElementById("pages")!.getAttribute("aria-label")).toBe("Pagination");
  });

  it("disables previous on the first page and next on the last", () => {
    const pagination = render();
    const [previous] = document.querySelectorAll<HTMLButtonElement>(".az-pagination-item");
    expect(previous!.disabled).toBe(true);

    pagination.goTo(10);
    const buttons = document.querySelectorAll<HTMLButtonElement>(".az-pagination-item");
    expect(buttons[buttons.length - 1]!.disabled).toBe(true);
  });

  it("changes page on click, emits the event and keeps focus on the current page", () => {
    const pagination = render();
    const change = vi.fn((event: Event) => (event as CustomEvent).detail);
    document.addEventListener("az:pagination:change", change);

    document.querySelector<HTMLElement>('[aria-label="Page 2"]')!.click();
    document.removeEventListener("az:pagination:change", change);

    expect(pagination.page).toBe(2);
    expect(change).toHaveReturnedWith({ page: 2, pageSize: 10 });
    expect(document.activeElement?.textContent).toBe("2");
  });

  it("clamps pages, ignores unchanged pages and recomputes on update", () => {
    const pagination = render();
    const change = vi.fn();
    document.addEventListener("az:pagination:change", change);

    pagination.goTo(1);
    pagination.goTo(99);
    expect(pagination.page).toBe(10);

    pagination.update({ total: 25 });
    document.removeEventListener("az:pagination:change", change);

    expect(pagination.pageCount).toBe(3);
    expect(pagination.page).toBe(3);
    expect(change).toHaveBeenCalledTimes(1);
  });

  it("reads options from data attributes and always has one page", () => {
    document.body.innerHTML = `<nav id="pages" data-az-total="0" data-az-page-size="5"></nav>`;
    const pagination = new Pagination("#pages");

    expect(pagination.pageCount).toBe(1);
    expect(pagination.pageSize).toBe(5);
  });

  it("clears its markup and listeners on destroy", () => {
    const pagination = render();

    pagination.destroy();

    expect(document.getElementById("pages")!.children).toHaveLength(0);
    expect(document.getElementById("pages")!.hasAttribute("aria-label")).toBe(false);
  });
});
