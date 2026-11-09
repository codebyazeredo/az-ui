# Collapse

Shows and hides a block of content from one or more triggers. For a group of related sections, use [Accordion](accordion.md).

## Example

```html
<button data-az-toggle="collapse" data-az-target="#shipment-details">Shipment details</button>

<div class="az-collapse" id="shipment-details" hidden>Carrier, route and delivery window.</div>
```

With `az-ui/auto`, the trigger works without JavaScript. Without it:

```ts
import { Collapse } from "az-ui";

const collapse = new Collapse("#shipment-details", { open: true });
collapse.toggle();
```

## Options

| Option | Type      | Default            | Purpose                                                  |
| ------ | --------- | ------------------ | -------------------------------------------------------- |
| `open` | `boolean` | follows the markup | Initial state. Without it, the `hidden` attribute rules. |

## Methods and properties

`show()`, `hide()`, `toggle()`, `isOpen` and `destroy()`.

## Events

| Event                | Cancelable | When            |
| -------------------- | ---------- | --------------- |
| `az:collapse:show`   | yes        | Before opening. |
| `az:collapse:shown`  | no         | After opening.  |
| `az:collapse:hide`   | yes        | Before closing. |
| `az:collapse:hidden` | no         | After closing.  |

## Accessibility

Every trigger pointing to the content receives `aria-expanded` and `aria-controls`, kept in sync on each change. Triggers should be `<button>` elements so they work with the keyboard.
