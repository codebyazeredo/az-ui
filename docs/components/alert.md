# Alert

Contextual message about the result of an action or the state of a page. CSS only.

## Example

```html
<div class="az-alert az-alert-danger" role="alert">
  <p class="az-alert-title">Payment failed</p>
  The card was declined.
</div>
```

## Classes

| Class                                                                      | Purpose                               |
| -------------------------------------------------------------------------- | ------------------------------------- |
| `az-alert`                                                                 | Base (required). Same look as `info`. |
| `az-alert-success`, `az-alert-warning`, `az-alert-danger`, `az-alert-info` | Variants.                             |
| `az-alert-title`                                                           | Optional bold title.                  |
| `az-alert-sm`, `az-alert-lg`                                               | Compact and comfortable density.      |

## Accessibility

- Use `role="alert"` only for urgent messages that appear dynamically; use `role="status"` for the rest.
- Text color keeps at least 4.5:1 contrast in both themes.

## Notes

The alert has no dismiss button; it is static content.
