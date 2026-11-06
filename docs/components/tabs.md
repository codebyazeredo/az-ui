# Tabs

Navigation between related panels. Tabs and panels are paired by order.

## Example

```html
<div class="az-tabs" data-az-component="tabs">
  <div class="az-tabs-list">
    <button class="az-tabs-tab">Details</button>
    <button class="az-tabs-tab">History</button>
  </div>
  <div class="az-tabs-panel">Customer details…</div>
  <div class="az-tabs-panel">Change history…</div>
</div>
```

```ts
import { Tabs } from "az-ui";

const tabs = new Tabs(".az-tabs");
tabs.select(1);
```

## Methods and events

`select(index)`, `selectedIndex`, `destroy()`. Event `az:tabs:change` with `detail.index`. The first tab is selected unless one has `aria-selected="true"`. Using different numbers of tabs and panels throws.

## Accessibility

Sets `role="tablist"`, `tab` and `tabpanel`, `aria-selected`, `aria-controls` and `aria-labelledby`. Only the selected tab is in the tab order. Keyboard: `ArrowLeft`/`ArrowRight` (wrapping), `Home` and `End` select and focus a tab.

## Notes

Use tabs for peers of the same content, not for steps of a process.
