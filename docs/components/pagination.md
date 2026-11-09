# Pagination

Page navigation. The component renders the buttons; the consumer decides what each page shows, so it works with client data and with server-side paging.

## Example

```html
<nav
  class="az-pagination"
  id="pages"
  data-az-component="pagination"
  data-az-total="250"
  data-az-page-size="25"
></nav>
```

```ts
import { Pagination } from "@codebyazeredo/az-ui";

const pagination = new Pagination("#pages", { total: 250, pageSize: 25 });
document.addEventListener("az:pagination:change", (event) => {
  const { page, pageSize } = (event as CustomEvent).detail;
});
pagination.update({ total: 120 });
pagination.goTo(3);
```

## Options

| Option     | Data attribute      | Description                                                  |
| ---------- | ------------------- | ------------------------------------------------------------ |
| `total`    | `data-az-total`     | Total number of records. Default `0`.                        |
| `pageSize` | `data-az-page-size` | Records per page. Default `10`.                              |
| `page`     | `data-az-page`      | Initial page. Default `1`.                                   |
| `labels`   | -                   | `navigation`, `previous`, `next`, `page` (accessible names). |

## Methods and events

`page`, `pageCount`, `pageSize`, `goTo(page)`, `update({ total, pageSize })`, `destroy()`. Event `az:pagination:change` with `detail.page` and `detail.pageSize`, emitted by `goTo` and clicks (not by `update`). Pages are clamped to the valid range; there is always at least one page.

## Accessibility

The container gets `aria-label` (unless it already has one); the current page has `aria-current="page"`; previous and next are disabled at the limits. After a click, focus moves to the current page button.
