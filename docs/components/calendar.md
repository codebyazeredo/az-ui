# Calendar

A month view with events on their days, for delivery schedules, shifts or any list of dated items. It is data driven: you give it events and it draws them and tells you what the user clicked. It stores nothing. For picking a date in a form, use [Datepicker](datepicker.md).

## Example

```html
<div id="deliveries"></div>
```

```ts
import { Calendar } from "az-ui";

const calendar = new Calendar("#deliveries", { locale: "pt-BR", firstDayOfWeek: 1 });

calendar.setEvents([
  { id: "1001", date: "2026-11-12", title: "Acme - dock 3", variant: "success" },
  { id: "1002", date: "2026-11-12", title: "Atlas - dock 1" },
]);

deliveries.addEventListener("az:calendar:eventclick", (event) => openOrder(event.detail.event.id));
deliveries.addEventListener("az:calendar:navigate", (event) => loadMonth(event.detail));
```

## Options

| Option            | Data attribute       | Default                 | Description                                                       |
| ----------------- | -------------------- | ----------------------- | ----------------------------------------------------------------- |
| `locale`          | `data-az-locale`     | `<html lang>` or `"en"` | Month and weekday names, via `Intl`.                              |
| `firstDayOfWeek`  | `data-az-first-day`  | `0`                     | `0` is Sunday, `1` is Monday.                                     |
| `maxEventsPerDay` | `data-az-max-events` | `3`                     | Events shown in a day before "+N more".                           |
| `labels`          | none                 | English                 | `previousMonth`, `nextMonth`, `today` and `more` (use `{count}`). |

## Events (data)

`{ id, date, title, variant? }`: `date` is `YYYY-MM-DD` (an invalid one throws) and `variant` is `default`, `success`, `warning`, `danger` or `info`. Titles are shown as text, never as HTML. Days of the neighbor months that appear in the grid also show their events.

## Methods and properties

`setEvents(events)` (replaces them), `setMonth(date)` (any date of the month), `previous()`, `next()`, `today()`, `month` (`{ year, month }`, month from 0 to 11) and `destroy()`.

## Events emitted

| Event                    | `detail`        | When                                                         |
| ------------------------ | --------------- | ------------------------------------------------------------ |
| `az:calendar:select`     | `date`          | A day (or its "+N more") is clicked, or chosen with `Enter`. |
| `az:calendar:eventclick` | `event`         | An event is clicked.                                         |
| `az:calendar:navigate`   | `year`, `month` | The visible month changed. Load that month's events here.    |

## Keyboard

The focused day is the only tab stop. Arrows move by day and week, `PageUp`/`PageDown` by month, `Home`/`End` to the start and end of the week, and `Enter` or `Space` select the day. Events and "+N more" are regular buttons.

## Accessibility

The grid has `role="grid"`; every day button has the full date as its accessible name and today is marked. Colors are never the only way to tell events apart: keep the title meaningful.
