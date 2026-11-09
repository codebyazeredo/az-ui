# Row expand

Shows and hides a detail row under a table row, for order lines, history or any extra information that does not fit in the columns.

## Example

```html
<table id="orders" class="az-table" data-az-component="rowexpand">
  <tbody>
    <tr>
      <td>
        <button class="az-table-expand" data-az-expand aria-label="Show details"></button>
      </td>
      <td>1001</td>
      <td>Acme Logistics</td>
    </tr>
    <tr class="az-table-detail">
      <td colspan="3">Items, carrier and delivery notes.</td>
    </tr>
  </tbody>
</table>
```

The detail row is the `tr.az-table-detail` right after the row. Add `aria-expanded="true"` to a button to start it open. Give each button an accessible name (`aria-label`).

## Methods and events

`expand(row)`, `collapse(row)`, `toggle(row)`, `expandAll()`, `collapseAll()`, `isExpanded(row)` and `destroy()`.

| Event                 | `detail`                    |
| --------------------- | --------------------------- |
| `az:rowexpand:toggle` | `row`, `detail`, `expanded` |

## Accessibility

The button gets `aria-expanded` and `aria-controls` pointing at the detail row, and hidden details are not in the accessibility tree.

## Limitation

Do not combine it with the sorting, search or pagination of [DataTable](table.md): those treat the detail row as a normal row and would separate it from its parent.
