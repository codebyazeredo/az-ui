# Dual Listbox

Two lists, "Available" and "Selected", for choosing several items from a long set, such as the carriers a customer may use. It is built on a `<select multiple>`, which stays in the form (hidden) and always reflects the choice and its order.

## Example

```html
<select class="az-control" name="carriers" multiple data-az-component="duallistbox">
  <option value="north">North Freight</option>
  <option value="blue" selected>Blue Line</option>
  <option value="fast">Fast Cargo</option>
  <option value="old" disabled>Old Carrier</option>
</select>
```

```ts
import { DualListbox } from "@codebyazeredo/az-ui";

const box = new DualListbox("#carriers", { labels: { available: "Carriers" } });
box.values; // ["blue"]
```

## Options

| Option   | Description                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| `labels` | `available`, `selected`, `search` (use `{list}`), `add`, `addAll`, `remove`, `removeAll`. English by default. |

## Using it

- Click items to mark them, then use the arrow buttons. The double arrows move every item that is not disabled and matches the search of that list.
- Double click moves one item.
- Drag items between the lists, or reorder the selected ones. The selected order is kept in the `<select>`, so the form submits the values in that order.
- Each list has its own search field.
- Disabled options are shown but cannot be marked, moved or dropped.

## Methods and events

`values` (selected values in order), `refresh()` (read the `<select>` again after changing its options) and `destroy()` (shows the `<select>` back). The event `az:duallistbox:change` has `detail.values`. Optgroups are not preserved.

## Keyboard

Focus an item and press `Space` to grab it, then `ArrowLeft`/`ArrowRight` to move it to the other list (reversed in `dir="rtl"`), `ArrowUp`/`ArrowDown` to reorder, `Enter` to drop and `Escape` to cancel, as in [Sortable](sortable.md). The buttons and the search fields are regular focusable controls.
