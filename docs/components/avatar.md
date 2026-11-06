# Avatar

Visual representation of a person or entity: initials or an image. CSS only.

## Example

```html
<span class="az-avatar">MA</span>
<span class="az-avatar az-avatar-lg"
  ><img class="az-avatar-image" src="/user.jpg" alt="Matheus Azeredo"
/></span>
```

## Classes

| Class                          | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| `az-avatar`                    | Base (required), 32px, round.                   |
| `az-avatar-sm`, `az-avatar-lg` | Sizes (28px and 40px).                          |
| `az-avatar-square`             | Rounded square, for entities such as companies. |
| `az-avatar-image`              | Applied to an `<img>` inside the avatar.        |

## Accessibility

Images need meaningful `alt` text. When the name is already shown next to the avatar, use `alt=""` and keep initials `aria-hidden="true"`.
