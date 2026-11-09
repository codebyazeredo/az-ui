import { afterEach, describe, expect, it, vi } from "vitest";
import { Kanban } from "../../../src/components/kanban";

function card(id: string, top: number): string {
  return `<div class="az-kanban-card" id="${id}" data-top="${top}">${id}</div>`;
}

function column(id: string, cards: string, limit = ""): string {
  return `
    <section class="az-kanban-column" id="${id}" ${limit}>
      <header class="az-kanban-header">
        <span>${id}</span><span class="az-kanban-count"></span>
      </header>
      <div class="az-kanban-list" id="${id}-list">${cards}</div>
    </section>`;
}

function render(markup: string): Kanban {
  document.body.innerHTML = `<div class="az-kanban" id="board">${markup}</div>`;
  for (const item of document.querySelectorAll<HTMLElement>(".az-kanban-card")) {
    const top = Number(item.dataset.top);
    item.getBoundingClientRect = () => ({ top, left: 0, width: 100, height: 100 }) as DOMRect;
  }

  return new Kanban("#board");
}

function renderBoard(limit = ""): Kanban {
  return render(
    column("todo", card("c1", 0) + card("c2", 100)) +
      column("doing", card("c3", 0), limit) +
      column("done", ""),
  );
}

function dragEvent(type: string, clientY = 0): Event {
  return Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
    clientX: 0,
    clientY,
    dataTransfer: null,
  });
}

function dragCard(cardId: string, listId: string, clientY = 0): void {
  document.getElementById(cardId)!.dispatchEvent(dragEvent("dragstart"));
  document.getElementById(listId)!.dispatchEvent(dragEvent("dragover", clientY));
  document.getElementById(listId)!.dispatchEvent(dragEvent("drop", clientY));
}

function ids(listId: string): string[] {
  return [...document.querySelectorAll(`#${listId} > .az-kanban-card`)].map((item) => item.id);
}

function counts(): string[] {
  return [...document.querySelectorAll(".az-kanban-count")].map((item) => item.textContent ?? "");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Kanban", () => {
  it("makes cards draggable across every column", () => {
    renderBoard();

    dragCard("c1", "doing-list");

    expect(ids("todo-list")).toEqual(["c2"]);
    expect(ids("doing-list")).toEqual(["c1", "c3"]);
  });

  it("works without lanes and with lanes", () => {
    render(
      `<div class="az-kanban-lane" id="ana">${column("a-todo", card("c1", 0))}${column("a-done", "")}</div>` +
        `<div class="az-kanban-lane" id="bob">${column("b-todo", card("c2", 0))}</div>`,
    );
    const moved = vi.fn();
    document.getElementById("board")!.addEventListener("az:kanban:move", (event) => {
      moved((event as CustomEvent).detail);
    });

    dragCard("c1", "b-todo-list");

    expect(moved).toHaveBeenCalledWith(
      expect.objectContaining({
        card: document.getElementById("c1"),
        fromLane: document.getElementById("ana"),
        toLane: document.getElementById("bob"),
      }),
    );
  });

  it("shows the count and keeps it updated after a move", async () => {
    renderBoard();
    expect(counts()).toEqual(["2", "1", "0"]);

    dragCard("c1", "done-list");
    await Promise.resolve();

    expect(counts()).toEqual(["1", "1", "1"]);
  });

  it("drops into an empty column", () => {
    renderBoard();

    dragCard("c1", "done-list");

    expect(ids("done-list")).toEqual(["c1"]);
  });

  it("accepts a drop that reaches the limit exactly", () => {
    renderBoard('data-az-limit="2"');

    dragCard("c1", "doing-list");

    expect(ids("doing-list")).toContain("c1");
  });

  it("blocks a drop that exceeds the column limit", () => {
    renderBoard('data-az-limit="1"');

    dragCard("c1", "doing-list");

    expect(ids("todo-list")).toEqual(["c1", "c2"]);
    expect(ids("doing-list")).toEqual(["c3"]);
  });

  it("marks a full column and shows the limit in the count", async () => {
    renderBoard('data-az-limit="1"');
    await Promise.resolve();

    expect(document.getElementById("doing")!.classList.contains("az-kanban-column-full")).toBe(
      true,
    );
    expect(counts()[1]).toBe("1/1");
  });

  it("reorders inside a column even when it is full", () => {
    render(column("todo", card("c1", 0) + card("c2", 100), 'data-az-limit="2"'));

    dragCard("c1", "todo-list", 260);

    expect(ids("todo-list")).toEqual(["c2", "c1"]);
  });

  it("reverts when az:kanban:move is prevented", () => {
    renderBoard();
    document.getElementById("board")!.addEventListener("az:kanban:move", (event) => {
      event.preventDefault();
    });

    dragCard("c1", "done-list");

    expect(ids("todo-list")).toEqual(["c1", "c2"]);
    expect(ids("done-list")).toEqual([]);
  });

  it("throws without any list", () => {
    document.body.innerHTML = `<div class="az-kanban" id="board"></div>`;

    expect(() => new Kanban("#board")).toThrow("requires at least one");
  });

  it("destroy releases the sortable lists", () => {
    const kanban = renderBoard();

    kanban.destroy();

    expect(document.getElementById("c1")!.hasAttribute("draggable")).toBe(false);
  });
});
