# JavaScript API

Interactive components are classes exported by `@codebyazeredo/az-ui`. Each one wraps an element, adds behavior and ARIA attributes, and can be removed with `destroy()`.

```ts
import { Modal } from "@codebyazeredo/az-ui";

const modal = new Modal("#modal"); // selector or HTMLElement
modal.show();
modal.hide();
modal.toggle();
modal.destroy();
```

## Lifecycle

- One instance per element and component. A second `new Modal(element)` throws `AZUI: the element is already initialized as modal.`
- `destroy()` removes listeners, restores attributes, releases scroll locks and allows initializing the element again.
- A missing element, a missing required child or a wrong element type throws an `Error` whose message starts with `AZUI:`.

## Events

Components dispatch bubbling `CustomEvent`s named `az:<component>:<event>` on their element.

| Event                  | When                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `show`, `hide`         | Before opening or closing. Cancelable with `preventDefault()`.                      |
| `shown`, `hidden`      | After opening or closing.                                                           |
| `az:tabs:change`       | After a tab is selected by the user or `select()`. `detail.index` is the new index. |
| `az:datepicker:select` | After a date is picked. `detail.value` is `YYYY-MM-DD`.                             |

```ts
document.addEventListener("az:modal:hide", (event) => {
  if (hasUnsavedChanges()) event.preventDefault();
});
```

## Automatic initialization

The main entry has no side effects. To initialize components from HTML attributes, import the optional entry once:

```ts
import "@codebyazeredo/az-ui/auto";
```

| Attribute                                                                                                                  | Effect                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `data-az-component="tabs \| dropdown \| tooltip \| popover \| datepicker \| notification \| context-menu \| command-menu"` | Creates the component on that element when the page is ready. |
| `data-az-toggle="modal \| offcanvas \| command-menu"` and `data-az-target="#id"`                                           | Clicking the element toggles the target.                      |
| `data-az-dismiss`                                                                                                          | Inside a modal or offcanvas, closes it.                       |

For content added later, call `initComponents(container)` (exported by `@codebyazeredo/az-ui/auto`).

Use attributes for static pages and the class API when you need `show()`, events or options. Both can be mixed: `Component.find` is used internally, so an instance created in code is reused by the attributes.

## Accessibility

Every component sets the ARIA roles and states it needs, manages focus (overlays trap focus and return it on close) and supports `Escape`. See each component page.
