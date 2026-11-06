# Button

Action element. CSS only; use a native `<button>` (or `<a>` for navigation).

## Example

```html
<button class="az-btn az-btn-primary" type="button">Save</button>
<button class="az-btn" type="button">Cancel</button>
```

## Classes

| Class                                                                                   | Purpose                                       |
| --------------------------------------------------------------------------------------- | --------------------------------------------- |
| `az-btn`                                                                                | Base (required). Neutral appearance.          |
| `az-btn-primary`, `az-btn-secondary`, `az-btn-outline`, `az-btn-ghost`, `az-btn-danger` | Variants.                                     |
| `az-btn-sm`, `az-btn-lg`                                                                | Sizes (default is `md`, 32px).                |
| `az-btn-loading`                                                                        | Disables pointer events while an action runs. |

## States

Hover, focus (visible ring), disabled (`disabled` or `aria-disabled="true"`) and loading.

```html
<button class="az-btn az-btn-primary az-btn-loading" type="button" aria-busy="true">
  <span class="az-spinner az-spinner-sm" aria-hidden="true"></span>Saving
</button>
```

## Accessibility

- Always set `type` on `<button>` inside forms.
- Set `aria-busy="true"` while loading; the spinner is decorative.
- Icon-only buttons need an `aria-label`.

## Notes

Use one `az-btn-primary` per view. Use `az-btn-danger` only for destructive actions.
