# CSV export

Turns an HTML table into a CSV file, for "Export" buttons. It reads the table as it is on screen, so it works with any data source and with [DataTable](table.md).

## Example

```html
<button class="az-btn" data-az-export-csv="#orders" data-az-filename="orders.csv">Export</button>

<table id="orders" class="az-table">
  ...
</table>
```

```ts
import { downloadCsv, tableToCsv } from "az-ui";

const table = document.querySelector("#orders");
const text = tableToCsv(table, { rows: "selected" });
downloadCsv(table, "orders.csv", { delimiter: ";" });
```

With `az-ui/auto`, a click on `[data-az-export-csv]` (a selector for the `<table>` or an element containing it) downloads the file. `data-az-filename` sets the name (default `table.csv`) and `data-az-rows` the rows (`all`, `visible` or `selected`).

## Options

| Option      | Default | Description                                                                                                                                 |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `delimiter` | `","`   | Column separator. Use `";"` for spreadsheets configured for some European and Latin American locales.                                       |
| `rows`      | `"all"` | `"all"` every body row, `"visible"` rows without `hidden` (the current page of a DataTable), `"selected"` rows with `aria-selected="true"`. |
| `header`    | `true`  | Include the header row.                                                                                                                     |
| `sanitize`  | `true`  | Neutralize cells that start with `=`, `+`, `-` or `@` (see below).                                                                          |
| `bom`       | `true`  | `downloadCsv` only: add a UTF-8 byte order mark so Excel reads accents correctly.                                                           |

## What is exported

- Columns whose header is `hidden` (for example after `DataTable.setColumnVisible`) and the selection, actions and row handle columns (`az-table-select`, `az-table-actions`, `az-table-handle`) are left out.
- The cell text is used with whitespace collapsed. Put `data-az-export` on a cell to export another value, such as a raw number instead of a formatted amount.
- Cells with the delimiter, quotes or line breaks are quoted, and quotes inside are doubled. Lines end with `\r\n`.

## Formula injection

A cell such as `=HYPERLINK(...)` would run as a formula when the file is opened in a spreadsheet. With `sanitize` on, text that starts with `=`, `+`, `-` or `@` (or a tab or carriage return) gets a leading `'`, unless the whole text is a number, so `-5` stays `-5`. Turn it off only when the cells are fully trusted.
