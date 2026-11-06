# Notification panel

Persistent list of notifications opened from a button, with an unread counter. For temporary messages use a [Toast](toast.md). The class is named `NotificationPanel` to avoid clashing with the browser `Notification` API.

## Example

```html
<div class="az-notification" data-az-component="notification">
  <button class="az-btn az-notification-toggle">
    Notifications <span class="az-notification-count"></span>
  </button>
  <div class="az-popover az-notification-panel" hidden>
    <div class="az-notification-header">
      <h2 class="az-notification-title">Notifications</h2>
      <button class="az-btn az-btn-ghost az-btn-sm" data-az-notification-read-all>
        Mark all as read
      </button>
    </div>
    <ul class="az-notification-list">
      <li class="az-notification-item az-notification-item-unread">
        <a class="az-notification-link" href="/orders/12">
          Order 12 was approved
          <span class="az-notification-time">5 min ago</span>
        </a>
      </li>
    </ul>
    <p class="az-notification-empty" hidden>No notifications</p>
  </div>
</div>
```

```ts
import { NotificationPanel } from "az-ui";

const panel = new NotificationPanel(".az-notification");
panel.markAllAsRead();
```

## Behavior

The count is the number of items with `az-notification-item-unread`; it is hidden at zero. Clicking an item link marks that item as read; `data-az-notification-read-all` marks all. After adding or removing items in code, call `refresh()` to recount and toggle the empty message. Opening and closing reuse the [Popover](popover.md), so its events (`az:popover:*`) and placement rules apply.

## Methods and events

`markAsRead(item)`, `markAllAsRead()`, `refresh()`, `unreadCount`, `destroy()`. Event `az:notification:read` with `detail.unreadCount`.

## Accessibility

The toggle gets `aria-expanded` and `aria-controls`, and the panel `role="dialog"`. Focus moves to the panel on open; `Escape` closes it and returns focus to the toggle. The counter is visible text inside the button, so it is part of the accessible name. Mark unread items with more than color: the style also uses bold text and a side bar.

## Notes

The panel markup uses the `az-popover` class for its base style. Add `hidden` so it stays closed before JavaScript runs.
