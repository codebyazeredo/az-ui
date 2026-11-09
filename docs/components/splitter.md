# Splitter

Two resizable panes separated by a handle, for master and detail screens. Resize with the pointer or the keyboard.

## Example

```html
<div class="az-splitter" data-az-component="splitter" style="height: 20rem">
  <div data-az-min="200">List</div>
  <div class="az-splitter-handle"></div>
  <div data-az-min="300">Detail</div>
</div>
```

Add `az-splitter-vertical` to stack the panes. The container needs a height when stacked. The first pane starts at 50%; set `data-az-size="30"` on the container to change it. `data-az-min` sets each pane's minimum size in pixels. If both minimums do not fit, the first pane keeps its minimum.

## Methods and properties

`size` (percentage taken by the first pane), `resize(percent)` (clamped to the minimums) and `destroy()`.

## Events

| Event                | `detail`            |
| -------------------- | ------------------- |
| `az:splitter:resize` | `size` (percentage) |

## Keyboard

Focus the handle and use the arrow keys (`ArrowLeft`/`ArrowRight`, or `ArrowUp`/`ArrowDown` when stacked): 2% per press, 10% with `Shift`. `Home` and `End` go to the limits. The horizontal arrows swap in `dir="rtl"`.

## Accessibility

The handle is a focusable `role="separator"` with `aria-orientation`, `aria-controls` and `aria-valuenow`, `aria-valuemin` and `aria-valuemax` in percent.
