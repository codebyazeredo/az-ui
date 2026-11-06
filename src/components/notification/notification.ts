import { Component } from "../../javascript/core/component";
import { Popover } from "../popover";

const UNREAD_CLASS = "az-notification-item-unread";
const ITEM_SELECTOR = ".az-notification-item";

export class NotificationPanel extends Component {
  private readonly popover: Popover;
  private readonly count: HTMLElement | null;
  private readonly empty: HTMLElement | null;

  constructor(target: string | HTMLElement) {
    super("notification", target, {});

    const toggle = this.element.querySelector<HTMLElement>(".az-notification-toggle");
    const panel = this.element.querySelector<HTMLElement>(".az-notification-panel");
    if (!toggle || !panel) {
      throw new Error(
        "AZUI: notification requires .az-notification-toggle and .az-notification-panel.",
      );
    }
    this.count = this.element.querySelector<HTMLElement>(".az-notification-count");
    this.empty = this.element.querySelector<HTMLElement>(".az-notification-empty");
    this.popover = new Popover(toggle, { target: panel, placement: "bottom" });

    this.listen(panel, "click", (event) => {
      if (!(event.target instanceof Element)) return;

      const item = event.target.closest<HTMLElement>(ITEM_SELECTOR);
      if (item && event.target.closest(".az-notification-link")) this.markAsRead(item);
      if (event.target.closest("[data-az-notification-read-all]")) this.markAllAsRead();
    });
    this.refresh();
  }

  get unreadCount(): number {
    return this.element.querySelectorAll(`.${UNREAD_CLASS}`).length;
  }

  markAsRead(item: HTMLElement): void {
    item.classList.remove(UNREAD_CLASS);
    this.refresh();
    this.emit("read", { detail: { unreadCount: this.unreadCount } });
  }

  markAllAsRead(): void {
    for (const item of this.element.querySelectorAll(`.${UNREAD_CLASS}`)) {
      item.classList.remove(UNREAD_CLASS);
    }
    this.refresh();
    this.emit("read", { detail: { unreadCount: 0 } });
  }

  refresh(): void {
    const unread = this.unreadCount;
    if (this.count) {
      this.count.textContent = String(unread);
      this.count.hidden = unread === 0;
    }
    if (this.empty) {
      this.empty.hidden = this.element.querySelector(ITEM_SELECTOR) !== null;
    }
  }

  override destroy(): void {
    this.popover.destroy();
    super.destroy();
  }
}
