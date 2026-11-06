# Divider

Visual separator between groups of content. CSS only.

## Example

```html
<hr class="az-divider" />

<div class="az-d-flex">
  <span>Edit</span>
  <span class="az-divider az-divider-vertical" role="separator" aria-orientation="vertical"></span>
  <span>Delete</span>
</div>
```

## Classes

| Class                 | Purpose                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `az-divider`          | Horizontal rule (use on `<hr>`).                                                  |
| `az-divider-vertical` | Vertical rule inside a flex row. Add `role="separator"` when it is not an `<hr>`. |

## Accessibility

`<hr>` already has the `separator` role. Use dividers instead of boxes to group content.
