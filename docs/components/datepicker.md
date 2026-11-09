# Datepicker

Calendar attached to a text input. The value is always an ISO date (`YYYY-MM-DD`).

## Example

```html
<input
  class="az-control"
  data-az-component="datepicker"
  data-az-min="2026-01-01"
  placeholder="YYYY-MM-DD"
/>
```

```ts
import { Datepicker } from "@codebyazeredo/az-ui";

new Datepicker("#due-date", { locale: "pt-BR", firstDayOfWeek: 1, max: "2026-12-31" });
```

## Options

| Option           | Data attribute               | Default                 | Description                                              |
| ---------------- | ---------------------------- | ----------------------- | -------------------------------------------------------- |
| `min`, `max`     | `data-az-min`, `data-az-max` | none                    | Inclusive ISO limits; days outside are disabled.         |
| `locale`         | `data-az-locale`             | `<html lang>` or `"en"` | Month, weekday and day names, via `Intl`.                |
| `firstDayOfWeek` | `data-az-first-day`          | `0`                     | `0` is Sunday, `1` is Monday.                            |
| `labels`         | none                         | English                 | `dialog`, `previousMonth`, `nextMonth` accessible names. |

## Behavior

Click or `ArrowDown` on the input opens the calendar on the month of the current value (or today, clamped to the limits). Choosing a day writes the value, dispatches `input` and `change` on the input, emits `az:datepicker:select` (`detail.value`), closes and returns focus to the input.

## Methods and events

`show()`, `hide()`, `destroy()`, `isOpen`. Events `az:datepicker:show`, `shown`, `hide`, `hidden`, `select`.

## Accessibility

The input gets `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`. The calendar is a labelled dialog with a `grid`; each day has a full-date accessible name and only one day is in the tab order. Keyboard: arrows move by day and week, `Home`/`End` by week start and end, `PageUp`/`PageDown` by month, `Enter`/`Space` select, `Escape` closes.

## Notes

The input keeps accepting typed ISO dates, which the calendar reads when it opens. Parsing other formats is left to the application. Must be used on an `<input>`; otherwise it throws.
