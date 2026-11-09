# Select and multi-select

Dropdown list that replaces the native `<select>` and `<select multiple>` appearance. The native element stays in the DOM (hidden), so form submission, `required`, `FormData`, `change` events and labels keep working. Without JavaScript, the native control with the `az-control az-select` classes is shown instead.

## Example

```html
<label class="az-field-label" for="country">Country</label>
<select class="az-control az-select" id="country" name="country" data-az-component="select">
  <option value="" disabled selected>Choose…</option>
  <option value="br">Brazil</option>
  <option value="pt">Portugal</option>
</select>

<select
  class="az-control az-multiselect"
  id="roles"
  name="roles"
  multiple
  data-az-component="select"
>
  <option value="admin" selected>Admin</option>
  <option value="editor">Editor</option>
</select>
```

```ts
import { Select } from "@codebyazeredo/az-ui";

const select = new Select("#country", { placeholder: "Choose…" });
select.value;
select.refresh();
```

`AZUI.Form.select` and `AZUI.Form.multiselect` already render `data-az-component="select"`; import `@codebyazeredo/az-ui/auto` or create the instance yourself.

## Options

| Option        | Data attribute        | Description                                                                               |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `placeholder` | `data-az-placeholder` | Text shown when nothing is selected. Defaults to the disabled option with an empty value. |

## Methods and events

`value` (`string`, or `string[]` with `multiple`), `isOpen`, `show()`, `hide()`, `toggle()`, `refresh()` and `destroy()`. Call `refresh()` after changing the options, `disabled` or `aria-invalid` of the native element.

| Event                        | Detail      | Notes                             |
| ---------------------------- | ----------- | --------------------------------- |
| `az:select:change`           | `{ value }` | An option was picked by the user. |
| `az:select:show` / `hide`    | -           | Cancelable.                       |
| `az:select:shown` / `hidden` | -           | After opening or closing.         |

A native `change` event is also dispatched on the `<select>`. The selection can be changed programmatically on the native element followed by a `change` event, and `form.reset()` is followed.

## Behavior

Single selection closes the list after a choice. Multiple selection keeps it open and shows the selected options as chips. Options with an empty value that are `disabled` act as the placeholder and are not listed. The list opens below the control; it does not flip upward and has no search field or type-ahead.

## Accessibility

The trigger is a `combobox` button with `aria-expanded`, `aria-controls` and a name taken from the `<label>`. The list is a `listbox` of `option` elements (`aria-selected`, `aria-multiselectable`). Keyboard: `ArrowDown`/`ArrowUp` on the trigger open the list; inside it `ArrowDown`, `ArrowUp`, `Home` and `End` move focus (skipping disabled options), `Enter` or `Space` picks, `Escape` closes and returns focus, `Tab` closes. A label click focuses the trigger.
