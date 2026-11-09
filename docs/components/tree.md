# Tree

An expandable hierarchy, such as a chart of accounts, a bill of materials or warehouse locations. Follows the ARIA tree pattern with full keyboard support.

## Example

```html
<ul class="az-tree" data-az-component="tree" aria-label="Chart of accounts">
  <li class="az-tree-item" aria-expanded="true">
    <span class="az-tree-label">Assets</span>
    <ul>
      <li class="az-tree-item"><span class="az-tree-label">Cash</span></li>
      <li class="az-tree-item"><span class="az-tree-label">Bank</span></li>
    </ul>
  </li>
  <li class="az-tree-item"><span class="az-tree-label">Liabilities</span></li>
</ul>
```

Branches start collapsed; add `aria-expanded="true"` to start one open. Children are not loaded on demand.

## Methods and properties

`expand(item)`, `collapse(item)`, `select(item)`, `selected` and `destroy()`.

## Events

| Event            | `detail`           | When                      |
| ---------------- | ------------------ | ------------------------- |
| `az:tree:toggle` | `item`, `expanded` | A branch opens or closes. |
| `az:tree:select` | `item`             | An item becomes selected. |

## Keyboard

| Key                     | Action                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Next / previous visible item.                                     |
| `ArrowRight`            | Expand a collapsed branch; on an open one, go to its first child. |
| `ArrowLeft`             | Collapse an open branch; otherwise go to the parent.              |
| `Home` / `End`          | First / last visible item.                                        |
| `Enter` / `Space`       | Select the item.                                                  |

`ArrowLeft` and `ArrowRight` swap in `dir="rtl"`. Clicking the arrow toggles a branch; clicking the label selects it.

## Accessibility

The component sets `role="tree"`, `treeitem` and `group`, keeps `aria-expanded` and `aria-selected` current and uses a single tab stop (roving `tabindex`). Give the tree an accessible name with `aria-label`.
