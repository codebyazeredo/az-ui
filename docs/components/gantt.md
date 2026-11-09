# Gantt

A project timeline: a task list on the left and a bar per task on a day or week scale, with progress, dependencies and a "today" line. Bars can be moved and resized. It is data driven: you give it the tasks, it draws them and tells you what the user changed. It stores nothing.

## Example

```html
<div id="project" style="--az-gantt-max-height: 24rem"></div>
```

```ts
import { Gantt } from "az-ui";

const gantt = new Gantt("#project", {
  zoom: "day",
  tasks: [
    { id: "plan", name: "Plan route", start: "2026-11-10", end: "2026-11-12", progress: 100 },
    {
      id: "load",
      name: "Load trucks",
      start: "2026-11-13",
      end: "2026-11-13",
      dependsOn: ["plan"],
    },
    { id: "ship", name: "Deliver", start: "2026-11-16", end: "2026-11-20", dependsOn: ["load"] },
  ],
});

project.addEventListener("az:gantt:move", (event) => {
  const { task, start, end } = event.detail;
  rescheduleDependents(task.id, start); // moving a task does not move the ones that depend on it
});
```

## Options

| Option      | Default                 | Description                                                                                                    |
| ----------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `tasks`     | -                       | `{ id, name, start, end, progress?, dependsOn?, variant? }`, see below.                                        |
| `zoom`      | `"day"`                 | `"day"` or `"week"` (the header shows weeks and each day is narrower).                                         |
| `dayWidth`  | `32` (day), `12` (week) | Width of a day in pixels.                                                                                      |
| `rowHeight` | `40`                    | Height of a row in pixels.                                                                                     |
| `locale`    | `<html lang>` or `en`   | Month and date names, via `Intl`.                                                                              |
| `labels`    | English                 | `task`, `start`, `end` (column headers) and `moved` (screen reader message with `{name}`, `{start}`, `{end}`). |

A task has `start` and `end` as `YYYY-MM-DD`, the end included (a one-day task has the same start and end and is one day wide). `progress` is 0 to 100 and is shown, not edited. `dependsOn` lists the ids of tasks that must finish first: an arrow is drawn from the end of each one to the start of this task, and an id that does not exist is ignored. `variant` is `default`, `success`, `warning`, `danger` or `info`. Names are shown as text, never as HTML.

The chart covers the earliest start to the latest end, plus two days on each side. Invalid data (an unreadable date, an end before the start, a repeated id, a progress outside 0 to 100, an unknown zoom) throws an error that names the problem.

## Methods and properties

`setTasks(tasks)`, `setZoom(zoom)`, `scrollToToday()`, `tasks` (a copy of the current tasks, updated after user changes) and `destroy()`. Give the element a height (or set `--az-gantt-max-height`) to make the chart scroll while the header and the task column stay in view.

## Events emitted

| Event             | Cancelable | `detail`                                                |
| ----------------- | ---------- | ------------------------------------------------------- |
| `az:gantt:move`   | yes        | `task` (as it was), `start`, `end` (the proposed dates) |
| `az:gantt:resize` | yes        | same                                                    |
| `az:gantt:select` | no         | `task`                                                  |

Cancel `move` or `resize` to refuse the change: the bar stays where it was. If it is not cancelled the task is updated and the chart is redrawn. **Dependent tasks are not rescheduled automatically**: use the event to decide what to do with them.

## Using it

Drag a bar to move the task, drag the left or right edge to change the start or the end (at least one day). With the keyboard, focus a bar: `ArrowLeft`/`ArrowRight` move it one day, `Shift` + `ArrowLeft`/`ArrowRight` shorten or lengthen it by one day and `Enter` selects it. The time axis always runs left to right, also in `dir="rtl"` pages. Each change is announced to screen readers.

## Accessibility

The chart is a `grid` with a row per task and the task name as the row header. Each bar is a button with an accessible name such as "Plan route, 2026-11-10 to 2026-11-12, 50% complete". The dependency arrows are decorative.
