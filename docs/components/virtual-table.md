# Virtual table

Shows thousands of rows without slowing the page: only the rows in view (plus a margin) exist in the DOM, and two spacer rows keep the scroll bar the size of the whole table. It is data driven, unlike [DataTable](table.md), whose rows are written in the markup.

## Example

```html
<div id="orders" class="az-table-wrap az-table-virtual" style="height: 24rem">
  <table class="az-table">
    <thead>
      <tr>
        <th>Order</th>
        <th>Customer</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>
```

```ts
import { VirtualTable } from "az-ui";

const orders = loadOrders(); // 10 000 items

const table = new VirtualTable("#orders", {
  rowCount: orders.length,
  rowHeight: 40,
  renderRow(index) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${orders[index].id}</td><td>${orders[index].customer}</td><td>${orders[index].total}</td>`;
    return row;
  },
});
```

## Options

| Option      | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `rowCount`  | Total number of rows (0 or more).                                                           |
| `rowHeight` | Height in pixels of every row. Must be fixed: make the rows you render exactly this tall.   |
| `renderRow` | `(index) => HTMLTableRowElement`. Build the row for that index. Escape any text you insert. |
| `overscan`  | Extra rows rendered above and below the view. Default `5`.                                  |

The element is the scroll container (give it a height) and must contain a `<table>` with a `<tbody>`. Add `az-table-virtual` to keep the header fixed at the top.

## Methods

`setRowCount(count)` (after loading more data or filtering), `refresh()` (draw the current rows again after the data changed), `scrollToRow(index)`, `range` (`{ start, end }`, `end` exclusive) and `destroy()`.

## Sorting and filtering

They belong to you: sort or filter your data (in memory or on the server), then call `setRowCount` and `refresh`.

## Accessibility

The table gets `aria-rowcount` and each row `aria-rowindex`, so assistive technology knows the real size and position even though most rows are not in the DOM. Spacer rows are hidden from it.

## Limitations

Rows must have a fixed height. A row that leaves the view is removed, so keyboard focus inside it is lost: prefer actions that do not depend on keeping focus in a scrolled-away row.
