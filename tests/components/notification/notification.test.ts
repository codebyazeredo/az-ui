import { afterEach, describe, expect, it, vi } from "vitest";
import { NotificationPanel } from "../../../src/components/notification";

function render(unread = 2): NotificationPanel {
  document.body.innerHTML = `
    <p id="outside">outside</p>
    <div class="az-notification" id="root">
      <button class="az-btn az-notification-toggle" id="toggle">
        Notifications <span class="az-notification-count" id="count"></span>
      </button>
      <div class="az-popover az-notification-panel" id="panel" hidden>
        <div class="az-notification-header">
          <h2 class="az-notification-title">Notifications</h2>
          <button class="az-btn az-btn-ghost az-btn-sm" id="read-all" data-az-notification-read-all>Mark all as read</button>
        </div>
        <ul class="az-notification-list">
          ${Array.from({ length: 3 }, (_, index) => {
            const isUnread = index < unread;
            return `<li class="az-notification-item${isUnread ? " az-notification-item-unread" : ""}" id="item-${index}"><button class="az-notification-link" id="link-${index}">Item ${index}</button></li>`;
          }).join("")}
        </ul>
        <p class="az-notification-empty" id="empty" hidden>Nothing new</p>
      </div>
    </div>`;

  return new NotificationPanel("#root");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("NotificationPanel", () => {
  it("shows the unread count and keeps the panel closed", () => {
    const panel = render(2);
    const count = document.getElementById("count")!;

    expect(panel.unreadCount).toBe(2);
    expect(count.textContent).toBe("2");
    expect(count.hidden).toBe(false);
    expect(document.getElementById("panel")!.hidden).toBe(true);
  });

  it("hides the count when everything is read", () => {
    render(0);

    expect(document.getElementById("count")!.hidden).toBe(true);
  });

  it("opens from the toggle with popover semantics and closes outside or with Escape", () => {
    render();
    const toggle = document.getElementById("toggle")!;

    toggle.click();
    expect(document.getElementById("panel")!.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-controls")).toBe("panel");

    document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(document.getElementById("panel")!.hidden).toBe(true);

    toggle.click();
    document
      .getElementById("link-0")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.getElementById("panel")!.hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("marks an item as read when its link is clicked and updates the count", () => {
    const panel = render(2);
    const read = vi.fn((event: Event) => (event as CustomEvent).detail);
    document.addEventListener("az:notification:read", read);

    document.getElementById("link-0")!.click();

    expect(
      document.getElementById("item-0")!.classList.contains("az-notification-item-unread"),
    ).toBe(false);
    expect(panel.unreadCount).toBe(1);
    expect(document.getElementById("count")!.textContent).toBe("1");
    expect(read).toHaveReturnedWith({ unreadCount: 1 });

    document.getElementById("link-2")!.click();
    expect(panel.unreadCount).toBe(1);
    document.removeEventListener("az:notification:read", read);
  });

  it("marks everything as read from the button or the API", () => {
    const panel = render(3);

    document.getElementById("read-all")!.click();
    expect(panel.unreadCount).toBe(0);
    expect(document.getElementById("count")!.hidden).toBe(true);

    document.getElementById("item-1")!.classList.add("az-notification-item-unread");
    panel.refresh();
    expect(document.getElementById("count")!.textContent).toBe("1");
    panel.markAllAsRead();
    expect(panel.unreadCount).toBe(0);
  });

  it("recounts and toggles the empty message after the list changes", () => {
    const panel = render(1);
    expect(document.getElementById("empty")!.hidden).toBe(true);

    document.querySelector(".az-notification-list")!.replaceChildren();
    panel.refresh();

    expect(document.getElementById("empty")!.hidden).toBe(false);
    expect(document.getElementById("count")!.hidden).toBe(true);
  });

  it("rejects incomplete markup", () => {
    document.body.innerHTML = '<div id="root"></div>';

    expect(() => new NotificationPanel("#root")).toThrow(".az-notification-toggle");
  });

  it("destroys the inner popover too", () => {
    const panel = render();
    const toggle = document.getElementById("toggle")!;

    panel.destroy();
    toggle.click();

    expect(toggle.hasAttribute("aria-expanded")).toBe(false);
    expect(document.getElementById("panel")!.hidden).toBe(true);
    expect(() => new NotificationPanel("#root")).not.toThrow();
  });
});
