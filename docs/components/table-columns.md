# Table columns

Resizable and fixed (sticky) columns for wide tables. To let users reorder columns, see [Column reorder](column-reorder.md).

## Example

```html
<div class="az-table-wrap" style="max-height: 24rem">
  <table class="az-table" data-az-component="tablecolumns">
    <thead>
      <tr>
        <th data-az-sticky data-az-resizable style="width: 6rem">Order</th>
        <th data-az-resizable data-az-min-width="120">Customer</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ...
    </tbody>
  </table>
</div>
```

The component works on a `<table>` or on an element that contains one, and adds `az-table-fixed` (`table-layout: fixed`) so the widths of the header cells rule the columns.

## Resizing

A header with `data-az-resizable` gets a handle at its end. Drag it, or focus it and press `ArrowLeft`/`ArrowRight` (10 px, 50 px with `Shift`; reversed in `dir="rtl"`). `data-az-min-width` sets the minimum width in pixels (default 48).

## Fixed columns

A header with `data-az-sticky` keeps its column in view while the table scrolls sideways. Fixed columns should be the first ones; each offset is the sum of the widths of the fixed columns before it, recalculated after every resize. Call `refreshSticky()` if the markup or the widths change in other ways.

## Methods and events

`resize(column, width)` (pixels, never below the minimum), `refreshSticky()` and `destroy()`.

| Event                    | `detail`          |
| ------------------------ | ----------------- |
| `az:tablecolumns:resize` | `column`, `width` |

## Accessibility

Each handle is a focusable `role="separator"` with an accessible name ("Resize column Customer") and `aria-valuenow` and `aria-valuemin` in pixels.
