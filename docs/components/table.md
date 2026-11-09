# Table and DataTable

`az-table` is the CSS for data tables: sortable headers, row selection, row actions, sizes and a loading state. `DataTable` adds client-side sorting, search, pagination and selection on top of the same markup. Rows are always written by the consumer, so data can come from anywhere (server, API, static HTML).

## Example

```html
<input class="az-control" id="people-search" placeholder="Search" />

<div
  class="az-table-wrap"
  data-az-component="datatable"
  data-az-search="#people-search"
  data-az-pagination="#people-pages"
  data-az-page-size="10"
>
  <table class="az-table az-table-hover">
    <thead>
      <tr>
        <th class="az-table-select">
          <span class="az-check"
            ><input
              class="az-check-input"
              type="checkbox"
              aria-label="Select all"
              data-az-select-all
          /></span>
        </th>
        <th><button class="az-table-sort" type="button">Name</button></th>
        <th class="az-table-numeric" data-az-sort-type="number">
          <button class="az-table-sort" type="button">Age</button>
        </th>
        <th class="az-table-actions" aria-label="Actions"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <span class="az-check"
            ><input
              class="az-check-input"
              type="checkbox"
              aria-label="Select row"
              data-az-select-row
          /></span>
        </td>
        <td>Ana</td>
        <td class="az-table-numeric" data-az-sort-value="30">30 years</td>
        <td class="az-table-actions">
          <button class="az-btn az-btn-ghost az-btn-sm" type="button">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="az-table-empty" hidden>
    <div class="az-empty-state"><p class="az-empty-state-title">No records found</p></div>
  </div>
</div>
<nav id="people-pages" class="az-pagination"></nav>
```

```ts
import { DataTable } from "@codebyazeredo/az-ui";

const table = new DataTable("#people", {
  search: "#people-search",
  pagination: "#people-pages",
  pageSize: 20,
});
table.setLoading(true);
table.setColumnVisible(2, false);
table.refresh();
table.selectedRows;
table.clearSelection();
```

## Classes

| Class                                 | Purpose                                                          |
| ------------------------------------- | ---------------------------------------------------------------- |
| `az-table-wrap`                       | Scroll container and border (responsive tables). Component root. |
| `az-table`                            | The `<table>`.                                                   |
| `az-table-striped`, `az-table-hover`  | Zebra rows and row hover.                                        |
| `az-table-sm`, `az-table-lg`          | Denser and roomier cells.                                        |
| `az-table-numeric`                    | Right-aligned tabular numbers.                                   |
| `az-table-select`, `az-table-actions` | Selection column and row-actions column (kept narrow).           |
| `az-table-sort`                       | Button inside a sortable `<th>`; arrow follows `aria-sort`.      |
| `az-table-empty`                      | Element shown when no row matches. Put an Empty State inside it. |

## Options

| Option       | Data attribute       | Description                                                         |
| ------------ | -------------------- | ------------------------------------------------------------------- |
| `search`     | `data-az-search`     | Selector or `<input>` that filters rows (ignores case and accents). |
| `pagination` | `data-az-pagination` | Selector or element for [Pagination](./pagination.md).              |
| `pageSize`   | `data-az-page-size`  | Rows per page when `pagination` is set. Default `10`.               |

Other attributes: `data-az-sort-type="number"` on a `<th>` sorts that column numerically; `data-az-sort-value` on a `<td>` overrides the text used for sorting; `aria-selected="true"` on a `<tr>` marks a selected row.

## Methods and events

`refresh()` (call after replacing rows), `setLoading(boolean)`, `setColumnVisible(index, visible)`, `selectedRows`, `clearSelection()`, `destroy()`.

| Event                 | Detail                  | Cancelable | Notes                                                           |
| --------------------- | ----------------------- | ---------- | --------------------------------------------------------------- |
| `az:datatable:sort`   | `{ column, direction }` | Yes        | Cancel to sort on the server; headers still update `aria-sort`. |
| `az:datatable:search` | `{ query }`             | Yes        | Cancel to filter on the server; rows are not filtered locally.  |
| `az:datatable:select` | `{ count }`             | No         | Selection changed.                                              |

For server-side data, cancel `sort` and `search`, fetch, replace the `<tbody>` and call `refresh()`; use [Pagination](./pagination.md) directly and its `az:pagination:change` event instead of the `pagination` option.

## Reordering rows

Use [Sortable](sortable.md) on the `<tbody>`, with `data-az-items="tr"`, to let users drag rows. Put a handle column first with `az-table-handle` and set `data-az-handle` so only the handle starts a drag. Listen to `az:sortable:drop` and save the new order.

```html
<tbody data-az-component="sortable" data-az-items="tr" data-az-handle=".az-table-handle">
  <tr>
    <td class="az-table-handle" aria-hidden="true">::</td>
    <td>Pick order 1042</td>
  </tr>
</tbody>
```

Rows are also focusable: `Space` grabs, the arrows move, `Enter` drops and `Escape` cancels.

## States

Hover, selected (`aria-selected`), sorted (`aria-sort`), loading (`aria-busy="true"` dims the body) and empty.

## Accessibility

Native `<table>` semantics. Sort buttons are real buttons and the header exposes `aria-sort`. Give selection checkboxes an `aria-label`. `setLoading` sets `aria-busy` on the wrapper.
