# Tooltip

Short helper text shown on hover and focus.

## Example

```html
<button class="az-btn" data-az-component="tooltip" data-az-content="Export to CSV">Export</button>
```

```ts
import { Tooltip } from "@codebyazeredo/az-ui";

new Tooltip("#export", { content: "Export to CSV", placement: "bottom" });
```

## Options

| Option      | Data attribute      | Default | Description                                                                                 |
| ----------- | ------------------- | ------- | ------------------------------------------------------------------------------------------- |
| `content`   | `data-az-content`   | none    | Text. Without it the tooltip never opens.                                                   |
| `placement` | `data-az-placement` | `"top"` | `"top" \| "bottom" \| "left" \| "right"`. Flips to the opposite side when there is no room. |

## Methods and events

`show()`, `hide()`, `destroy()`, `isOpen`. Events `az:tooltip:show`, `shown`, `hide`, `hidden`.

## Accessibility

The tooltip has `role="tooltip"` and the trigger gets `aria-describedby` while it is open. It opens on keyboard focus and closes on blur and `Escape`. Content is text only and must not be the only way to learn something important; use a [Popover](popover.md) for interactive content.
