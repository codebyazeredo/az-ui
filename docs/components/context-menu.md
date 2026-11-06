# Context menu

Menu of actions that opens at the pointer on right click (or the keyboard context key) over an area. It reuses the item styles of the [Dropdown](dropdown.md).

## Example

```html
<div data-az-component="context-menu" data-az-menu="#row-menu">Right click this row</div>

<div class="az-context-menu" id="row-menu" hidden>
  <button class="az-dropdown-item">Open</button>
  <button class="az-dropdown-item" disabled>Rename</button>
  <hr class="az-dropdown-divider" />
  <button class="az-dropdown-item">Delete</button>
</div>
```

```ts
import { ContextMenu } from "az-ui";

const menu = new ContextMenu("#row", { menu: "#row-menu" });
```

## Options

| Option | Data attribute | Description                                        |
| ------ | -------------- | -------------------------------------------------- |
| `menu` | `data-az-menu` | Required. Selector or element of the menu to open. |

## Methods and events

`show(x, y)` (viewport coordinates), `hide()`, `destroy()`, `isOpen`. Events `az:context-menu:show`, `shown`, `hide`, `hidden`. `show` is cancelable. The native browser menu is replaced inside the area.

## Accessibility

The menu gets `role="menu"` and items `role="menuitem"`. It opens from the keyboard with the context menu key or `Shift+F10` when the area is focusable (add `tabindex="0"`). Focus moves to the first enabled item; arrows, `Home` and `End` navigate; `Escape` closes and returns focus; `Tab` closes. Clicking outside closes. The menu is kept inside the viewport.

## Notes

Never make a context menu the only way to reach an action. Add `hidden` to the menu so it stays closed before JavaScript runs.
