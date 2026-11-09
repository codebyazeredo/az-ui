# Popover

Contextual panel opened from a button, with room for text and actions.

## Example

```html
<button class="az-btn" data-az-component="popover" data-az-target="#help">Details</button>

<div class="az-popover" id="help" hidden>
  <h3 class="az-popover-title">Billing cycle</h3>
  <p>Invoices are issued on the first business day.</p>
</div>
```

```ts
import { Popover } from "@codebyazeredo/az-ui";

new Popover("#details-button", { target: "#help", placement: "right" });
```

## Options

| Option      | Data attribute      | Default    | Description                                                               |
| ----------- | ------------------- | ---------- | ------------------------------------------------------------------------- |
| `target`    | `data-az-target`    | required   | Selector of the popover element.                                          |
| `placement` | `data-az-placement` | `"bottom"` | `"top" \| "bottom" \| "left" \| "right"`, flipping when there is no room. |

## Methods and events

`show()`, `hide()`, `toggle()`, `destroy()`, `isOpen`. Events `az:popover:show`, `shown`, `hide`, `hidden` (dispatched on the trigger).

## Notes

Add `hidden` to the popover element so it stays closed before JavaScript runs.

## Accessibility

The trigger gets `aria-expanded` and `aria-controls`; the popover gets `role="dialog"` (not modal) and `aria-labelledby` when it contains `az-popover-title`. Focus moves to the popover on open; `Escape` closes it and returns focus to the trigger. Clicking outside closes it.
