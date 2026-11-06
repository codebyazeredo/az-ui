# Card

Container for logically related content. CSS only.

## Example

```html
<section class="az-card">
  <div class="az-card-header">Customer</div>
  <div class="az-card-body">Acme Industries</div>
  <div class="az-card-footer">
    <button class="az-btn az-btn-primary az-btn-sm" type="button">Open</button>
  </div>
</section>
```

## Classes

| Class                                              | Purpose                          |
| -------------------------------------------------- | -------------------------------- |
| `az-card`                                          | Container (required).            |
| `az-card-header`, `az-card-body`, `az-card-footer` | Optional parts, in this order.   |
| `az-card-sm`, `az-card-lg`                         | Compact and comfortable padding. |

## Accessibility

Use a semantic element for the container (`section`, `article`) and a real heading inside the header when the card names a topic.

## Notes

Use a card only when it separates content logically. Avoid nesting cards.
