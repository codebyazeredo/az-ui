# Spinner

Loading indicator. CSS only. It uses `currentColor`, so it follows the text color of its parent.

## Example

```html
<span class="az-spinner" role="status" aria-label="Loading"></span>
```

## Classes

| Class                            | Purpose                |
| -------------------------------- | ---------------------- |
| `az-spinner`                     | Base (required), 20px. |
| `az-spinner-sm`, `az-spinner-lg` | Sizes (14px and 32px). |

## Accessibility

- Standalone spinner: `role="status"` and `aria-label`.
- Inside a button or another labelled element: `aria-hidden="true"`.
- With `prefers-reduced-motion`, the rotation slows down instead of stopping, so progress stays visible.
