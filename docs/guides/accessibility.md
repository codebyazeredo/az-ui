# Accessibility

AZ UI targets **WCAG 2.2 level AA**. Accessibility is part of every component, not a later fix: semantic HTML first, ARIA only where HTML cannot express the state, and full keyboard operation.

## What every component guarantees

- Semantic elements: buttons are `<button>`, navigation is `<nav>`, tables are `<table>`.
- A visible focus ring on every interactive element, using `--az-focus-ring-*`.
- Labels linked to fields; help and error text linked with `aria-describedby`; invalid fields marked with `aria-invalid="true"`.
- State attributes where native HTML has none: `aria-expanded`, `aria-selected`, `aria-current`, `aria-busy`, `aria-disabled`.
- Text contrast of at least 4.5:1 in both themes for the shipped tokens.
- Motion is reduced when the user asks for it (`prefers-reduced-motion`).

## Overlays

Modal, Offcanvas, Dropdown, Popover, Command menu and Context menu manage focus:

- Focus moves into the overlay when it opens and returns to the trigger when it closes.
- Modal, Offcanvas and Command menu trap focus and lock page scroll.
- `Escape` closes any overlay.
- Roles and relationships (`dialog`, `menu`, `listbox`, `aria-controls`, `aria-activedescendant`) are set by the component, so you write plain markup.

## Keyboard reference

| Component    | Keys                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| Tabs         | `ArrowLeft` / `ArrowRight` move and select (wrapping), `Home` and `End` jump       |
| Command menu | `Ctrl+K` / `Cmd+K` opens, `ArrowDown` / `ArrowUp` move, `Enter` runs, `Esc` closes |
| Modal        | `Tab` stays inside the dialog, `Esc` closes                                        |
| Accordion    | Native `<details>`: `Enter` or `Space` toggles                                     |
| Table        | Sortable headers are buttons: `Enter` or `Space` sorts                             |

Each component page documents its own keyboard behavior and ARIA attributes in an "Accessibility" section.

## What you are responsible for

The library cannot know your content. Please:

- Give icon-only buttons an `aria-label`.
- Use one `h1` per page and do not skip heading levels.
- Write link and button text that makes sense out of context.
- Do not rely on color alone: pair status colors with text or an icon.
- Give every `<input>` a `<label>`, or an `aria-label` when a visible label is not possible.
- Announce dynamic changes: `role="status"` for non-urgent messages, `role="alert"` only for urgent ones.

## Verification status

- Automated tests check roles, labels, ARIA attributes and keyboard behavior for components.
- Modal, Offcanvas, Dropdown, Tooltip, Popover, Tabs, Toast, Accordion and Datepicker were reviewed manually with a screen reader.
- Notification panel, Command menu and Context menu are implemented and tested automatically, but their manual screen reader review is still pending.
- There is no third-party accessibility audit yet. Do not present AZ UI as certified; run your own audit on the screens you build.

Found a barrier? Open an issue with the component, browser and assistive technology.
