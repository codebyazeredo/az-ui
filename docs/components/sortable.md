# Sortable

Reorders the children of a list by drag and drop, and moves them between lists of the same group. Uses the native drag and drop API, with a keyboard alternative. It does not store anything: listen to the events and save the new order in your system.

## Example

```html
<ul class="az-sortable" data-az-component="sortable" data-az-group="tasks">
  <li>Pick order 1042</li>
  <li>Pack order 1043</li>
</ul>
```

```ts
import { Sortable } from "az-ui";

const sortable = new Sortable("#tasks", { group: "tasks", handle: ".grip" });
```

## Options

| Option      | Type                         | Default      | Purpose                                                                       |
| ----------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `group`     | `string`                     | none         | Lists with the same group exchange items. Without it, the list only reorders. |
| `handle`    | `string`                     | whole item   | CSS selector; dragging starts only from it.                                   |
| `items`     | `string`                     | `*`          | CSS selector for the direct children that can be moved.                       |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | Axis used to find the drop position.                                          |
| `labels`    | `Partial<SortableLabels>`    | English      | Screen reader messages (`{position}` and `{total}` available).                |

## Methods

`items`, `move(item, to, index)` (returns `false` for an invalid index, a list of another group or a prevented drop), `refresh()` and `destroy()`. Children added later are picked up automatically.

## Events

| Event                | Cancelable | `detail`                                     |
| -------------------- | ---------- | -------------------------------------------- |
| `az:sortable:start`  | no         | `item`, `from`, `to`, `fromIndex`, `toIndex` |
| `az:sortable:drop`   | yes        | same; emitted on the destination list        |
| `az:sortable:cancel` | no         | same; the item is back at its origin         |

Calling `preventDefault()` on `az:sortable:drop` returns the item to where it started. Dropping an item at its own position emits nothing.

## Keyboard

Focus an item and press `Space` or `Enter` to grab it. `ArrowUp`/`ArrowDown` move it inside the list (`ArrowLeft`/`ArrowRight` in horizontal lists), the perpendicular arrows move it to the previous or next list of the group (reversed in `dir="rtl"`), `Enter` or `Space` drops it and `Escape` cancels. Each step is announced in a polite live region.

## Notes

Keep an empty list tall enough to be a drop target (`az-sortable` sets a minimum height). Native drag and drop is limited on touch screens; the keyboard alternative stays available.

The `items` option is also available as `data-az-items` (for example `tr` on a `<tbody>`, see [Table](table.md)).
