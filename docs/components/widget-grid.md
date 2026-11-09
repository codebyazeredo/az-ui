# Widget grid

A dashboard of widgets (indicators, lists, charts you provide) that users can reorder by dragging and make wider or narrower. The component keeps the layout; your system saves it, so each user gets their own panel.

## Example

```html
<div class="az-widget-grid" id="panel" data-az-columns="4">
  <section class="az-widget" data-az-widget="sales" data-az-span="2" data-az-title="Sales">
    ...
  </section>
  <section class="az-widget" data-az-widget="stock" data-az-title="Stock">...</section>
  <section class="az-widget" data-az-widget="late" data-az-span="3" data-az-title="Late orders">
    ...
  </section>
</div>
```

```ts
import { WidgetGrid } from "@codebyazeredo/az-ui";

const grid = new WidgetGrid("#panel");

grid.setLayout(JSON.parse(localStorage.getItem("panel") ?? "[]"));
panel.addEventListener("az:widgetgrid:change", (event) => {
  localStorage.setItem("panel", JSON.stringify(event.detail.layout));
});
```

Each widget needs a unique `data-az-widget` id. `data-az-span` (1 to the number of columns, default 1) is its width. `data-az-title` names it for assistive technology and defaults to the id.

## Options

| Option    | Data attribute    | Default           | Description                                                |
| --------- | ----------------- | ----------------- | ---------------------------------------------------------- |
| `columns` | `data-az-columns` | `4`               | Number of columns of the grid (a whole number, 1 or more). |
| `labels`  | none              | `Resize {widget}` | `{ resize }`, the accessible name of each resize handle.   |

## Layout

`layout` returns the widgets in order as `{ id, span }`. `setLayout(layout)` reorders the widgets and applies the spans: ids that do not exist are ignored, widgets missing from the list stay at the end in their current order and spans are limited to 1 to `columns`. `setLayout` does not emit an event. `resize(id, span)` changes one widget.

Widgets flow in rows, left to right: the layout has an order and widths, not free positions.

## Events

| Event                  | `detail` | When                                           |
| ---------------------- | -------- | ---------------------------------------------- |
| `az:widgetgrid:change` | `layout` | After a reorder or a width change by the user. |

## Using it

Drag a widget to move it. Hover a widget to see the handle on its end edge: drag it to change the width, or focus it and use `ArrowLeft`/`ArrowRight` (reversed in `dir="rtl"`), `Home` and `End`. Widgets are focusable: `Space` grabs, the arrows move, `Enter` drops and `Escape` cancels, as in [Sortable](sortable.md).

## Accessibility

Each handle is a focusable `role="separator"` with an accessible name and `aria-valuenow`, `aria-valuemin` and `aria-valuemax` (in columns). Moves are announced to screen readers by the Sortable.
