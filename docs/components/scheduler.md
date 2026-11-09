# Scheduler

A one-day schedule by resource: docks, vehicles, teams or rooms in the rows and the hours of the day in the columns. Events are blocks you can move between resources and times, resize and select. It is data driven: you give it resources and events, it draws them and tells you what the user changed. It stores nothing.

## Example

```html
<div id="docks"></div>
```

```ts
import { Scheduler } from "@codebyazeredo/az-ui";

const schedule = new Scheduler("#docks", {
  date: "2026-11-10",
  startHour: 6,
  endHour: 20,
  slotMinutes: 30,
  resources: [
    { id: "d1", label: "Dock 1" },
    { id: "d2", label: "Dock 2" },
  ],
  events: [
    { id: "t1", resource: "d1", start: "2026-11-10T08:00", end: "2026-11-10T09:30", title: "Acme" },
  ],
});

docks.addEventListener("az:scheduler:move", async (event) => {
  const { event: before, resource, start, end } = event.detail;
  if (!(await save(before.id, resource, start, end))) event.preventDefault();
});
docks.addEventListener("az:scheduler:create", (event) => openForm(event.detail));
```

## Options

| Option         | Default | Description                                                                                              |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `resources`    | -       | `{ id, label }` for each row.                                                                            |
| `events`       | `[]`    | `{ id, resource, start, end, title, variant? }`. Times are local, `YYYY-MM-DDTHH:mm`, with no time zone. |
| `date`         | -       | The day shown, `YYYY-MM-DD`.                                                                             |
| `startHour`    | `6`     | First hour of the day shown (0 to 23).                                                                   |
| `endHour`      | `20`    | Hour where the day shown ends (up to 24). Must be after `startHour`.                                     |
| `slotMinutes`  | `30`    | Size of a slot. It must divide 60. Moves and resizes snap to slots.                                      |
| `slotWidth`    | `48`    | Width of a slot in pixels.                                                                               |
| `allowOverlap` | `false` | When `false`, a change that overlaps another event of the same resource is refused.                      |
| `labels`       | English | `moved` and `resized` screen reader messages (`{title}`, `{resource}`, `{start}`, `{end}`).              |

Invalid data (an unreadable date, an event that ends before it starts, an unknown resource, a duplicate id) throws an error that names the problem. Event `variant` is `default`, `success`, `warning`, `danger` or `info`. Titles are shown as text, never as HTML. Events outside the hours shown, or on another day, are not drawn; events that cross the edge are cut.

## Methods and properties

`setEvents(events)`, `setResources(resources)`, `setDate(date)`, `events` (a copy of the current events, updated after user changes) and `destroy()`.

## Events emitted

| Event                 | Cancelable | `detail`                                                                 |
| --------------------- | ---------- | ------------------------------------------------------------------------ |
| `az:scheduler:move`   | yes        | `event` (as it was), `resource`, `start`, `end` (the proposed values)    |
| `az:scheduler:resize` | yes        | same                                                                     |
| `az:scheduler:select` | no         | `event`                                                                  |
| `az:scheduler:create` | no         | `resource`, `start`, `end` (one slot) of the empty slot that was clicked |

Cancel `move` or `resize` to refuse the change (for example when the server rejects it): the block stays where it was. If it is not cancelled the event is updated and redrawn. Creating is by click only: offer your own "New" button for keyboard users.

## Using it

Drag a block to move it (the row under the pointer decides the resource) and drag its end edge to change the duration; click an empty slot to create. With the keyboard, focus a block: `ArrowLeft`/`ArrowRight` move one slot (the time axis always runs left to right, also in `dir="rtl"` pages), `ArrowUp`/`ArrowDown` change resource, `Shift` + `ArrowLeft`/`ArrowRight` shorten or lengthen by one slot, and `Enter` selects. Each change is announced to screen readers.

## Accessibility

The schedule is a `grid` with a row per resource and the resource name as the row header. Each block is a button with an accessible name such as "Acme, Dock 1, 08:00 to 09:30".
