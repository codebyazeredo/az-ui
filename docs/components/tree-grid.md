# Tree grid

A table whose rows form a hierarchy, such as a chart of accounts, a bill of materials or a warehouse with aisles, racks and positions. Follows the ARIA treegrid pattern, with the same keyboard model as [Tree](tree.md).

## Example

```html
<table class="az-table" data-az-component="treegrid" aria-label="Chart of accounts">
  <thead>
    <tr>
      <th>Account</th>
      <th class="az-table-numeric">Balance</th>
    </tr>
  </thead>
  <tbody>
    <tr data-az-level="1" aria-expanded="true">
      <td>1 Assets</td>
      <td class="az-table-numeric">100</td>
    </tr>
    <tr data-az-level="2">
      <td>1.1 Cash</td>
      <td class="az-table-numeric">40</td>
    </tr>
    <tr data-az-level="2">
      <td>1.2 Receivables</td>
      <td class="az-table-numeric">60</td>
    </tr>
  </tbody>
</table>
```

Rows are in display order and each one declares its depth in `data-az-level` (1 is the top). A row has children when the next row is deeper. Branches start collapsed; add `aria-expanded="true"` to start one open. Children are not loaded on demand.

## Methods and events

`expand(row)`, `collapse(row)`, `expandAll()`, `collapseAll()`, `isExpanded(row)` and `destroy()`.

| Event                | `detail`          |
| -------------------- | ----------------- |
| `az:treegrid:toggle` | `row`, `expanded` |

Collapsing a row hides all its descendants. Expanding it shows its children, but not the children of a child that is still collapsed.

## Keyboard

Rows have a roving tab stop. `ArrowDown`/`ArrowUp` move through the visible rows, `ArrowRight` expands a branch or enters its first child, `ArrowLeft` collapses it or goes to the parent (swapped in `dir="rtl"`) and `Home`/`End` go to the first and last visible row. Clicking the arrow in the first cell toggles the row.

## Accessibility

The table gets `role="treegrid"`, each row `aria-level` and, for branches, `aria-expanded`. Give the table an accessible name with `aria-label`.

## Limitation

Do not combine it with the sorting, search or pagination of [DataTable](table.md): they would reorder or hide rows without regard for the hierarchy.
