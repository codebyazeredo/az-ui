# Command menu

Searchable list of commands opened with `Ctrl+K` / `Cmd+K`. Built on the same overlay as [Modal](modal.md).

## Example

```html
<button class="az-btn" data-az-toggle="command-menu" data-az-target="#commands">Search…</button>

<div class="az-command-menu" id="commands" data-az-component="command-menu" hidden>
  <div class="az-command-menu-panel" aria-label="Command menu">
    <input
      class="az-command-menu-input"
      placeholder="Type a command"
      aria-label="Search commands"
    />
    <div class="az-command-menu-list">
      <button class="az-command-menu-item" data-az-command="orders">Open orders</button>
      <a class="az-command-menu-item" href="/customers" data-az-command="customers">Customers</a>
    </div>
    <p class="az-command-menu-empty" hidden>No results</p>
  </div>
</div>
```

```ts
import { CommandMenu } from "az-ui";

const menu = new CommandMenu("#commands", { shortcut: "k" });
document.addEventListener("az:command-menu:select", (event) => {
  run((event as CustomEvent<{ command: string }>).detail.command);
});
```

## Options

| Option                             | Default | Description                                                  |
| ---------------------------------- | ------- | ------------------------------------------------------------ |
| `shortcut`                         | `"k"`   | Key used with `Ctrl` or `Cmd`. `null` disables the shortcut. |
| `closeOnBackdrop`, `closeOnEscape` | `true`  | Same as Modal.                                               |

The shortcut only works once the menu is initialized, so use `data-az-component="command-menu"` (with `az-ui/auto`) or create it on page load.

## Behavior

Typing filters the commands, ignoring case and accents. The first match is active; `ArrowDown`/`ArrowUp` move the active command (wrapping) while focus stays in the input; `Enter` or a click runs it: the item receives a `click` (so links and buttons work), `az:command-menu:select` is emitted with `detail.command` (from `data-az-command`) and `detail.label`, and the menu closes. The query is cleared on every open.

## Methods and events

`show()`, `hide()`, `toggle()`, `destroy()`, `isOpen`. Events `az:command-menu:show`, `shown`, `hide`, `hidden`, `select`.

## Accessibility

Dialog semantics with focus trap, focus return and scroll lock (as Modal). The input is a `combobox` controlling a `listbox` of `option` items and exposes the active command with `aria-activedescendant`. Give the panel an `aria-label` or an `az-command-menu-title` element.
