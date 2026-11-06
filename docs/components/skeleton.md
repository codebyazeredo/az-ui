# Skeleton

Placeholder for content that is loading. CSS only. Set the size with utilities or inline styles.

## Example

```html
<div aria-hidden="true">
  <div class="az-skeleton az-skeleton-text" style="width: 60%"></div>
  <div class="az-skeleton az-skeleton-circle" style="width: 32px"></div>
</div>
```

## Classes

| Class                | Purpose                                 |
| -------------------- | --------------------------------------- |
| `az-skeleton`        | Base (required).                        |
| `az-skeleton-text`   | Height of one line of text.             |
| `az-skeleton-circle` | Square aspect ratio with a round shape. |

## Accessibility

- Mark the placeholder group `aria-hidden="true"` and set `aria-busy="true"` on the region being loaded.
- The pulse animation is disabled with `prefers-reduced-motion`.
