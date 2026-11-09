# Stepper

Sequential steps for wizards, such as an order form split into customer, items and review. The component tracks the current step and shows the matching panel. It does not validate: listen to `az:stepper:change` and decide whether the user may leave the step.

## Example

```html
<div class="az-stepper" id="order-steps">
  <ol class="az-stepper-list">
    <li class="az-stepper-step">
      <span class="az-stepper-marker">1</span><span class="az-stepper-label">Customer</span>
    </li>
    <li class="az-stepper-step">
      <span class="az-stepper-marker">2</span><span class="az-stepper-label">Items</span>
    </li>
  </ol>
  <div class="az-stepper-panel">Customer fields</div>
  <div class="az-stepper-panel">Item fields</div>
</div>
```

```ts
import { Stepper } from "az-ui";

const stepper = new Stepper("#order-steps");
stepper.setState(0, "complete");
stepper.next();
```

Panels are optional; when present there must be one per step. Add `az-stepper-vertical` to the container for a vertical list.

## Methods and properties

| Member                       | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| `current`                    | Index of the current step.                                             |
| `go(index)`                  | Returns `false` for an invalid or current index, or a prevented change. |
| `next()` / `previous()`      | Same, relative to the current step.                                    |
| `setState(index, state)`     | `"pending"`, `"complete"` or `"error"`, shown on the step marker.      |
| `destroy()`                  | Restores the markup.                                                   |

## Events

| Event                 | Cancelable | `detail`       |
| --------------------- | ---------- | -------------- |
| `az:stepper:change`   | yes        | `from`, `to`   |

Call `preventDefault()` to block the change, for example while the current step has invalid fields.

## Accessibility

The current step has `aria-current="step"`. State is also exposed visually only by color, so keep the step label meaningful and show a message for errors.
