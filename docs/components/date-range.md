# Date range

Links two date fields (start and end) so the end can never be before the start. It uses [Datepicker](datepicker.md) on both fields, with the same ISO values (`YYYY-MM-DD`) and options.

## Example

```html
<input class="az-control" id="from" data-az-component="daterange" data-az-end="#to" />
<input class="az-control" id="to" />
```

```ts
import { DateRange } from "@codebyazeredo/az-ui";

const range = new DateRange("#from", "#to", { locale: "pt-BR" });
range.start; // "2026-03-10"
range.end; // "2026-03-20"
```

Do not also put `data-az-component="datepicker"` on these fields: `DateRange` creates the pickers itself.

## Behavior

- Choosing the start disables the days before it in the end calendar. Choosing the end disables the days after it in the start calendar.
- Values already in the fields count as limits.
- Moving the start after the current end clears the end.
- Clearing a field removes the limit it was imposing, and the `min` and `max` options still apply.
- It reacts to the `change` event the Datepicker dispatches, so typing a valid date and leaving the field works too.

## Methods and events

`start` and `end` (ISO date, or an empty string when empty or invalid) and `destroy()`, which destroys both pickers. The event `az:daterange:change` (`detail.start`, `detail.end`) fires once per change. The `Datepicker` also gained `setLimits({ min, max })`, which changes its limits for the next time it opens; an empty string removes a limit.
