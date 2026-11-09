# Kanban

A board of columns whose cards can be dragged between them. You compose it: columns, cards and optional lanes (one row per person, team or any criterion) are plain markup. Built on [Sortable](sortable.md), so it has the same keyboard support. It stores nothing: listen to `az:kanban:move` and save the change in your system.

## Example

```html
<div class="az-kanban" data-az-component="kanban">
  <section class="az-kanban-column" data-az-limit="3">
    <header class="az-kanban-header">
      <span>In progress</span>
      <span class="az-kanban-count"></span>
    </header>
    <div class="az-kanban-list">
      <div class="az-kanban-card">Load truck 12</div>
    </div>
  </section>
  <section class="az-kanban-column">
    <header class="az-kanban-header">
      <span>Done</span>
      <span class="az-kanban-count"></span>
    </header>
    <div class="az-kanban-list"></div>
  </section>
</div>
```

With lanes, wrap the columns of each row in `az-kanban-lane` and add an optional `az-kanban-lane-title`:

```html
<div class="az-kanban" data-az-component="kanban">
  <div class="az-kanban-lane">
    <h3 class="az-kanban-lane-title">Ana</h3>
    <section class="az-kanban-column">...</section>
    <section class="az-kanban-column">...</section>
  </div>
  <div class="az-kanban-lane">...</div>
</div>
```

## Classes

| Class                   | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `az-kanban`             | Board.                                                                   |
| `az-kanban-lane`        | Optional row. Cards can move between lanes.                              |
| `az-kanban-lane-title`  | Optional lane heading.                                                   |
| `az-kanban-column`      | Column. `data-az-limit="N"` sets a maximum number of cards.              |
| `az-kanban-header`      | Column header.                                                           |
| `az-kanban-count`       | Optional; filled with the card count (`2/3` with a limit).               |
| `az-kanban-list`        | Drop area holding the cards.                                             |
| `az-kanban-card`        | Card container. Its content is yours: avatar, badge, due date and so on. |
| `az-kanban-column-full` | Added automatically when a column reaches its limit.                     |

## Behavior

Dropping a card in a column that is already at its limit puts it back. Reordering inside a full column is always allowed. Cards added later are picked up automatically.

## Methods and events

`columns` and `destroy()`.

| Event            | Cancelable | `detail`                                                        |
| ---------------- | ---------- | --------------------------------------------------------------- |
| `az:kanban:move` | yes        | `card`, `fromColumn`, `toColumn`, `fromLane`, `toLane`, `index` |

Call `preventDefault()` to refuse a move, for example a workflow rule that forbids going from "To do" straight to "Done". The card returns to where it started.

## Accessibility

Cards are focusable. `Space` or `Enter` grabs, the arrows move (up/down inside a column, left/right between columns, reversed in `dir="rtl"`), `Enter` drops and `Escape` cancels, with each step announced to screen readers.
