# Icon

Built-in set of 253 functional SVG icons on a 24×24 grid with a 1.5px stroke. Icons use `currentColor`, so they follow the text color of their parent. Browse and copy every icon in the [icon catalog](../../icons.html).

## Example

```ts
import { AZUI } from "az-ui";

const icon = AZUI.Icon.create("search", { size: "lg", label: "Search" });
button.append(icon);
```

The element is built with the DOM API, so no HTML string is involved.

## Sprite

For markup written by hand, insert the sprite once and reference icons with `<use>`:

```ts
document.body.prepend(AZUI.Icon.sprite());
```

```html
<svg class="az-icon" aria-hidden="true"><use href="#az-icon-search"></use></svg>
```

## API

| Member                      | Purpose                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `AZUI.Icon.create(name, o)` | Returns an `<svg class="az-icon">`. Throws on an unknown icon name.     |
| `AZUI.Icon.sprite()`        | Returns a hidden `<svg>` with one `<symbol id="az-icon-{name}">` each.  |
| `AZUI.Icon.names`           | List of available icon names.                                           |
| `AZUI.Icon.categories`      | Icon names grouped by category (actions, arrows, logistics, and so on). |

Options: `size` (`"sm"`, `"md"` default, `"lg"`) and `label`.

## Classes

| Class                      | Purpose                |
| -------------------------- | ---------------------- |
| `az-icon`                  | Base (required), 20px. |
| `az-icon-sm`, `az-icon-lg` | Sizes (16px and 24px). |

## Accessibility

- Without `label`, the icon is decorative (`aria-hidden="true"`). Use it next to visible text.
- When the icon is the only content of a control, pass `label` or give the control an `aria-label`.
- Do not use icons as decoration without a function.
