# Column reorder

Lets users move table columns by dragging the header or with the keyboard. It moves the cells of every row, so the table markup stays the same.

## Example

```html
<table class="az-table" data-az-component="columnreorder">
  <thead>
    <tr>
      <th data-az-reorderable>Order</th>
      <th data-az-reorderable>Customer</th>
      <th data-az-reorderable>Total</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    ...
  </tbody>
</table>
```

Only headers with `data-az-reorderable` can be moved, but a column can be dropped next to any other column.

## Using it

Drag a header onto another one. With the keyboard, focus a header and press `Alt` + `ArrowLeft` or `ArrowRight` (reversed in `dir="rtl"`); the focus stays on the moved header.

## Methods and events

`move(from, to)` moves a column by index and returns `false` for invalid or equal indexes, or when the event is cancelled. `destroy()` removes `draggable` and `tabindex`.

| Event                      | Cancelable | `detail`     |
| -------------------------- | ---------- | ------------ |
| `az:columnreorder:reorder` | yes        | `from`, `to` |

Save the new order in your handler, for example to remember it per user.

## Limitations

Do not combine it with `DataTable.setColumnVisible`, which identifies columns by position. Rows with fewer cells than the header keep their missing cells missing. Avoid `data-az-reorderable` and `data-az-resizable` on the same header: dragging the resize handle of a draggable header may start a column drag instead of a resize.
