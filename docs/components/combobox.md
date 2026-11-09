# Combobox

A text field with a list of suggestions, for choosing customers, products or addresses. Options can be local or loaded from a search function (an API, for example).

## Example

```html
<input
  class="az-control"
  name="city"
  data-az-component="combobox"
  data-az-options='[{"value":"1","label":"Santos"},{"value":"2","label":"Campinas"}]'
/>
```

```ts
import { Combobox } from "az-ui";

new Combobox("#customer", {
  source: async (query, signal) => {
    const response = await fetch(`/api/customers?q=${encodeURIComponent(query)}`, { signal });
    return response.json(); // [{ value, label }]
  },
});
```

The component wraps the input and adds a hidden field that receives the input's `name` and holds the chosen **value**, so forms submit the value and not the visible text.

## Options

| Option     | Default                          | Description                                                         |
| ---------- | -------------------------------- | ------------------------------------------------------------------- |
| `options`  | `data-az-options` (JSON) or `[]` | Local `{ value, label }` list, filtered ignoring case and accents.  |
| `source`   | none                             | `(query, signal) => Promise<ComboboxOption[]>`. Replaces `options`. |
| `minChars` | `0` local, `1` with `source`     | Characters needed before listing.                                   |
| `debounce` | `250`                            | Milliseconds to wait after typing before calling `source`.          |
| `labels`   | English                          | `loading`, `empty` and `error` messages.                            |

## Behavior with `source`

The list shows `loading` while waiting, `empty` for no results and `error` when the promise rejects. A response that arrives after a newer search is ignored, and the previous request receives an aborted `signal`, so pass it to `fetch`.

## Methods and events

`value` (selected `value` or `null`), `isOpen`, `select(option)`, `clear()` and `destroy()` (unwraps the input and restores its `name`). Typing text that differs from the chosen label clears the value.

| Event                | `detail` |
| -------------------- | -------- |
| `az:combobox:search` | `query`  |
| `az:combobox:select` | `option` |

The hidden field also receives a `change` event on every selection or clear.

## Accessibility

Follows the ARIA combobox pattern: `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant` on the input, and a `listbox` of `option` items. `ArrowDown`/`ArrowUp` navigate (and wrap), `Enter` selects, `Escape` closes. Focus stays on the input.
