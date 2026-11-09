# Table edit

Edit cells in place, like a spreadsheet. The component shows a field, confirms or cancels, and tells you what changed. It does not save anything: validate and save in the `az:tableedit:commit` event.

## Example

```html
<table id="items" class="az-table" data-az-component="tableedit">
  <thead>
    <tr>
      <th>Product</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pallet</td>
      <td data-az-edit="number">10</td>
    </tr>
  </tbody>
</table>
```

```ts
document.querySelector("#items").addEventListener("az:tableedit:commit", (event) => {
  const { row, column, oldValue, newValue } = event.detail;
  if (!isValidQuantity(newValue)) event.preventDefault(); // keeps the old value
});
```

## Editable cells

Add `data-az-edit="text"` or `data-az-edit="number"` to a `<td>`. Optional attributes:

| Attribute       | Purpose                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `data-az-value` | The raw value to edit when the text shown is formatted (for example `5,5 kg`). |
| `data-az-label` | Accessible name of the field. Defaults to the text of the column header.       |

## Using it

Double click a cell, or focus it and press `Enter` or `F2`. `Enter` confirms, `Escape` cancels and leaving the field confirms. Only one cell is edited at a time: starting another one confirms the current one. After confirming or cancelling, focus returns to the cell.

## Methods and events

`edit(cell)`, `commit()`, `cancel()`, `isEditing`, `refresh()` (call after adding rows, so the new cells become focusable) and `destroy()`.

| Event                 | Cancelable | `detail`                                        |
| --------------------- | ---------- | ----------------------------------------------- |
| `az:tableedit:commit` | yes        | `cell`, `row`, `column`, `oldValue`, `newValue` |

The event only fires when the value changed. If it is not cancelled, the cell text and `data-az-value` receive the new value; if it is, the cell goes back to what it showed before. A cell showing formatted text will show the raw new value: format it in your own handler.

## Accessibility

Editable cells are focusable (`tabindex="0"`) and open with the keyboard. The field has an accessible name from the column header.
