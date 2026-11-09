# Tag Input

A field where the user types values and turns them into removable chips, for labels, e-mails, plate numbers or order codes.

## Example

```html
<div class="az-tag-input" data-az-component="taginput">
  <input class="az-tag-input-field" aria-label="Labels" />
  <input type="hidden" name="labels" value="urgent,fragile" />
</div>
```

The visible field is only for typing. The hidden field, optional, always holds the tags separated by commas and is what the form submits. Tags already in it are shown as chips.

## Options

| Option   | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `labels` | `{ remove: "Remove {tag}" }`, the accessible name of each remove button. |

## Methods and properties

`tags`, `add(tag)`, `remove(index)` and `destroy()`. `add` returns `false` for an empty tag, a duplicate, a tag with a comma or a prevented `az:taginput:add`.

## Events

| Event                | Cancelable | `detail` |
| -------------------- | ---------- | -------- |
| `az:taginput:add`    | yes        | `tag`    |
| `az:taginput:remove` | no         | `tag`    |
| `az:taginput:change` | no         | `tags`   |

Call `preventDefault()` on `add` to validate, for example to accept only valid e-mails.

## Keyboard

`Enter` or `,` adds the typed text. `Backspace` on an empty field removes the last tag. Pasting text with commas or line breaks adds each piece. Each remove button is focusable and has its own accessible name.
