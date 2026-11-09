import { Component } from "../../javascript/core/component";
import { insertionIndex, type SortableDirection } from "./insertion-index";

export interface SortableLabels {
  grabbed: string;
  moved: string;
  dropped: string;
  cancelled: string;
}

export interface SortableOptions {
  group?: string;
  handle?: string;
  items?: string;
  direction?: SortableDirection;
  labels?: Partial<SortableLabels>;
}

export interface SortableEventDetail {
  item: HTMLElement;
  from: HTMLElement;
  to: HTMLElement;
  fromIndex: number;
  toIndex: number;
}

interface ActiveMove {
  item: HTMLElement;
  from: Sortable;
  fromIndex: number;
  dropped: boolean;
}

const DEFAULT_LABELS: SortableLabels = {
  grabbed:
    "Grabbed item, position {position} of {total}. Use the arrow keys to move, Enter to drop and Escape to cancel.",
  moved: "Position {position} of {total}.",
  dropped: "Dropped at position {position} of {total}.",
  cancelled: "Move cancelled.",
};

const DRAGGING_CLASS = "az-sortable-dragging";
const groups = new Map<string, Set<Sortable>>();
let liveRegion: HTMLElement | null = null;

function announce(message: string): void {
  if (!liveRegion?.isConnected) {
    liveRegion = document.createElement("div");
    liveRegion.className = "az-sortable-live";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("role", "status");
    document.body.append(liveRegion);
  }
  liveRegion.textContent = message;
}

function fill(template: string, position: number, total: number): string {
  return template.replace("{position}", String(position)).replace("{total}", String(total));
}

export class Sortable extends Component<SortableOptions> {
  private static active: ActiveMove | null = null;

  private readonly labels: SortableLabels;
  private readonly direction: SortableDirection;
  private handlePressed = false;

  constructor(target: string | HTMLElement, options: SortableOptions = {}) {
    super("sortable", target, options);

    this.labels = { ...DEFAULT_LABELS, ...options.labels };
    this.direction = options.direction ?? "vertical";
    this.register();

    this.listen(this.element, "mousedown", (event) => {
      const { handle } = this.options;
      this.handlePressed =
        handle !== undefined && event.target instanceof Element && !!event.target.closest(handle);
    });
    this.listen(this.element, "dragstart", (event) => this.handleDragStart(event));
    this.listen(this.element, "dragover", (event) => this.handleDragOver(event));
    this.listen(this.element, "drop", (event) => this.handleDrop(event));
    this.listen(this.element, "dragend", () => Sortable.cancelActive());
    this.listen(this.element, "keydown", (event) => this.handleKey(event));

    const observer = new MutationObserver(() => this.refresh());
    observer.observe(this.element, { childList: true });
    this.track(() => observer.disconnect());
    this.refresh();
  }

  get items(): HTMLElement[] {
    const selector = this.options.items ?? "*";
    return [...this.element.children].filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child.matches(selector),
    );
  }

  move(item: HTMLElement, to: Sortable, index: number): boolean {
    const origin = Sortable.find("sortable", item.parentElement ?? this.element);
    if (!(origin instanceof Sortable) || !to.accepts(origin)) return false;

    const fromIndex = origin.items.indexOf(item);
    const capacity = to.items.filter((candidate) => candidate !== item).length;
    if (fromIndex < 0 || index < 0 || index > capacity) return false;

    to.insert(item, index);
    const detail = this.describe(item, origin, fromIndex, to);
    if (!to.emit("drop", { cancelable: true, detail })) {
      origin.insert(item, fromIndex);
      return false;
    }

    return true;
  }

  refresh(): void {
    for (const item of this.items) {
      item.draggable = true;
      if (!item.hasAttribute("tabindex")) item.tabIndex = 0;
    }
  }

  override destroy(): void {
    const active = Sortable.active;
    if (active && (active.from === this || this.element.contains(active.item))) {
      Sortable.cancelActive();
    }
    for (const item of this.items) {
      item.removeAttribute("draggable");
      item.removeAttribute("tabindex");
    }
    this.unregister();
    super.destroy();
  }

  private static cancelActive(): void {
    const move = Sortable.active;
    if (!move || move.dropped) {
      Sortable.active = null;
      return;
    }

    Sortable.active = null;
    move.item.classList.remove(DRAGGING_CLASS);
    move.from.insert(move.item, move.fromIndex);
    move.from.emit("cancel", {
      detail: move.from.describe(move.item, move.from, move.fromIndex, move.from),
    });
  }

  private register(): void {
    const { group } = this.options;
    if (group === undefined) return;

    const members = groups.get(group) ?? new Set<Sortable>();
    members.add(this);
    groups.set(group, members);
  }

  private unregister(): void {
    const { group } = this.options;
    if (group !== undefined) groups.get(group)?.delete(this);
  }

  private accepts(origin: Sortable): boolean {
    return origin === this || (this.options.group !== undefined && origin.options.group === this.options.group);
  }

  private itemOf(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Node)) return null;

    return this.items.find((item) => item.contains(target)) ?? null;
  }

  private insert(item: HTMLElement, index: number): void {
    const siblings = this.items.filter((sibling) => sibling !== item);
    this.element.insertBefore(item, siblings[index] ?? null);
  }

  private describe(
    item: HTMLElement,
    origin: Sortable,
    fromIndex: number,
    destination: Sortable,
  ): SortableEventDetail {
    return {
      item,
      from: origin.element,
      to: destination.element,
      fromIndex,
      toIndex: destination.items.indexOf(item),
    };
  }

  private begin(item: HTMLElement): ActiveMove {
    const move = { item, from: this, fromIndex: this.items.indexOf(item), dropped: false };
    Sortable.active = move;
    item.classList.add(DRAGGING_CLASS);
    this.emit("start", { detail: this.describe(item, this, move.fromIndex, this) });

    return move;
  }

  private finish(): void {
    const move = Sortable.active;
    if (!move) return;

    move.dropped = true;
    Sortable.active = null;
    move.item.classList.remove(DRAGGING_CLASS);

    const toIndex = this.items.indexOf(move.item);
    if (this === move.from && toIndex === move.fromIndex) return;

    const detail = this.describe(move.item, move.from, move.fromIndex, this);
    if (!this.emit("drop", { cancelable: true, detail })) {
      move.from.insert(move.item, move.fromIndex);
    }
  }

  private handleDragStart(event: DragEvent): void {
    const item = this.itemOf(event.target);
    if (!item || (this.options.handle && !this.handlePressed)) {
      if (item) event.preventDefault();
      return;
    }

    event.dataTransfer?.setData("text/plain", "");
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    this.begin(item);
  }

  private handleDragOver(event: DragEvent): void {
    const move = Sortable.active;
    if (!move || !this.accepts(move.from)) return;

    event.preventDefault();
    const others = this.items.filter((item) => item !== move.item);
    const index = insertionIndex(
      others.map((item) => item.getBoundingClientRect()),
      { x: event.clientX, y: event.clientY },
      this.direction,
    );
    if (this.items.indexOf(move.item) !== index) this.insert(move.item, index);
  }

  private handleDrop(event: DragEvent): void {
    const move = Sortable.active;
    if (!move || !this.accepts(move.from)) return;

    event.preventDefault();
    this.finish();
  }

  private handleKey(event: KeyboardEvent): void {
    const item = this.itemOf(event.target);
    if (!item || event.target !== item) return;

    const move = Sortable.active;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (move) this.dropWithKeyboard(item);
      else this.grab(item);
      return;
    }
    if (!move || move.item !== item) return;

    if (event.key === "Escape") {
      event.preventDefault();
      Sortable.cancelActive();
      announce(this.labels.cancelled);
      return;
    }

    const { within, across } = this.resolveSteps(event.key);
    if (within !== 0) this.moveWithin(item, within);
    else if (across !== 0) this.moveAcross(item, across);
    else return;

    event.preventDefault();
    item.focus();
  }

  private grab(item: HTMLElement): void {
    this.begin(item);
    announce(fill(this.labels.grabbed, this.items.indexOf(item) + 1, this.items.length));
  }

  private dropWithKeyboard(item: HTMLElement): void {
    this.finish();
    announce(fill(this.labels.dropped, this.items.indexOf(item) + 1, this.items.length));
    item.focus();
  }

  private resolveSteps(key: string): { within: number; across: number } {
    const rtl = this.element.closest("[dir]")?.getAttribute("dir") === "rtl";
    const horizontal = key === "ArrowRight" ? (rtl ? -1 : 1) : key === "ArrowLeft" ? (rtl ? 1 : -1) : 0;
    const vertical = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;

    return this.direction === "vertical"
      ? { within: vertical, across: horizontal }
      : { within: horizontal, across: vertical };
  }

  private moveWithin(item: HTMLElement, delta: number): void {
    const target = this.items.indexOf(item) + delta;
    if (target < 0 || target >= this.items.length) return;

    this.insert(item, target);
    announce(fill(this.labels.moved, target + 1, this.items.length));
  }

  private moveAcross(item: HTMLElement, delta: number): void {
    const { group } = this.options;
    const members = [...(group === undefined ? [] : (groups.get(group) ?? []))].sort((a, b) =>
      a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    const neighbor = members[members.indexOf(this) + delta];
    if (!neighbor) return;

    const index = Math.min(this.items.indexOf(item), neighbor.items.length);
    neighbor.insert(item, index);
    announce(fill(this.labels.moved, index + 1, neighbor.items.length));
  }
}
