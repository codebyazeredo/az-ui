import { Component } from "../../javascript/core/component";
import { ensureId } from "../../javascript/dom/unique-id";
import { Sortable, type SortableEventDetail } from "../sortable";

export interface KanbanMoveDetail {
  card: HTMLElement;
  fromColumn: HTMLElement;
  toColumn: HTMLElement;
  fromLane: HTMLElement | null;
  toLane: HTMLElement | null;
  index: number;
}

const COLUMN_SELECTOR = ".az-kanban-column";
const LANE_SELECTOR = ".az-kanban-lane";
const LIST_SELECTOR = ".az-kanban-list";
const CARD_SELECTOR = ".az-kanban-card";
const FULL_CLASS = "az-kanban-column-full";

export class Kanban extends Component {
  private readonly sortables: Sortable[];

  constructor(target: string | HTMLElement) {
    super("kanban", target, {});

    const lists = [...this.element.querySelectorAll<HTMLElement>(LIST_SELECTOR)];
    if (lists.length === 0) {
      throw new Error("AZUI: kanban requires at least one .az-kanban-list.");
    }

    const group = ensureId(this.element, "az-kanban");
    this.sortables = lists.map((list) => new Sortable(list, { group, items: CARD_SELECTOR }));

    const onDrop = (event: Event): void =>
      this.handleDrop(event as CustomEvent<SortableEventDetail>);
    this.element.addEventListener("az:sortable:drop", onDrop);
    this.track(() => this.element.removeEventListener("az:sortable:drop", onDrop));

    const observer = new MutationObserver(() => this.refreshColumns());
    observer.observe(this.element, { childList: true, subtree: true });
    this.track(() => observer.disconnect());
    this.refreshColumns();
  }

  get columns(): HTMLElement[] {
    return [...this.element.querySelectorAll<HTMLElement>(COLUMN_SELECTOR)];
  }

  override destroy(): void {
    for (const sortable of this.sortables) sortable.destroy();
    super.destroy();
  }

  private handleDrop(event: CustomEvent<SortableEventDetail>): void {
    const { item, from, to, toIndex } = event.detail;
    const fromColumn = from.closest<HTMLElement>(COLUMN_SELECTOR);
    const toColumn = to.closest<HTMLElement>(COLUMN_SELECTOR);
    if (!fromColumn || !toColumn) return;

    if (fromColumn !== toColumn && this.exceedsLimit(toColumn)) {
      event.preventDefault();
      return;
    }

    const detail: KanbanMoveDetail = {
      card: item,
      fromColumn,
      toColumn,
      fromLane: fromColumn.closest<HTMLElement>(LANE_SELECTOR),
      toLane: toColumn.closest<HTMLElement>(LANE_SELECTOR),
      index: toIndex,
    };
    if (!this.emit("move", { cancelable: true, detail })) event.preventDefault();
  }

  private limitOf(column: HTMLElement): number | null {
    const limit = Number(column.dataset.azLimit);

    return Number.isInteger(limit) && limit > 0 ? limit : null;
  }

  private countOf(column: HTMLElement): number {
    return column.querySelectorAll(`${LIST_SELECTOR} > ${CARD_SELECTOR}`).length;
  }

  private exceedsLimit(column: HTMLElement): boolean {
    const limit = this.limitOf(column);

    return limit !== null && this.countOf(column) > limit;
  }

  private refreshColumns(): void {
    for (const column of this.columns) {
      const limit = this.limitOf(column);
      const count = this.countOf(column);
      const counter = column.querySelector<HTMLElement>(".az-kanban-count");
      const label = limit === null ? String(count) : `${count}/${limit}`;
      if (counter && counter.textContent !== label) counter.textContent = label;
      column.classList.toggle(FULL_CLASS, limit !== null && count >= limit);
    }
  }
}
