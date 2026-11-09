# Dropdown

Menu of actions opened from a button.

## Example

```html
<div class="az-dropdown" data-az-component="dropdown">
  <button class="az-btn az-dropdown-toggle">Actions</button>
  <div class="az-dropdown-menu" hidden>
    <a class="az-dropdown-item" href="/edit">Edit</a>
    <button class="az-dropdown-item">Duplicate</button>
    <hr class="az-dropdown-divider" />
    <button class="az-dropdown-item" disabled>Archive</button>
  </div>
</div>
```

```ts
import { Dropdown } from "@codebyazeredo/az-ui";

const dropdown = new Dropdown(".az-dropdown");
```

## Classes

`az-dropdown` (container), `az-dropdown-toggle`, `az-dropdown-menu`, `az-dropdown-menu-end` (aligns to the right edge), `az-dropdown-item`, `az-dropdown-divider`.

## Methods and events

`show()`, `hide()`, `toggle()`, `destroy()`, `isOpen`. Events `az:dropdown:show`, `shown`, `hide`, `hidden`.

## Accessibility

The button gets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; the menu gets `role="menu"` and items `role="menuitem"`. Keyboard: `ArrowDown`/`ArrowUp` on the button open the menu on the first/last item; arrows, `Home` and `End` move between enabled items; `Escape` closes and returns focus to the button; `Tab` closes. Clicking outside closes.

## Notes

Add `hidden` to the menu so it stays closed before JavaScript runs. The menu is positioned with CSS below the container. For navigation inside a page with many links, prefer a navigation menu.
