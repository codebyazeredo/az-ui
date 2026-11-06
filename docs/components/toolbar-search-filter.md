# Toolbar, Search and Filter

CSS-only helpers for the area above a table or list.

## Toolbar

```html
<div class="az-toolbar">
  <button class="az-btn az-btn-primary" type="button">New</button>
  <span class="az-toolbar-spacer"></span>
  <button class="az-btn az-btn-outline" type="button">Export</button>
</div>
```

A wrapping row of actions. `az-toolbar-spacer` pushes the following items to the end.

## Search

```html
<div class="az-search">
  <input class="az-control" type="search" placeholder="Search" aria-label="Search" />
</div>
```

Adds a search icon to an `az-control`. Connect it to a [DataTable](./table.md) with `data-az-search`. Always provide a label (`aria-label` or `<label>`).

## Filter

```html
<form class="az-filter">
  <div class="az-field">
    <label class="az-field-label" for="status">Status</label>
    <select class="az-control az-select" id="status">
      <option>All</option>
    </select>
  </div>
  <button class="az-btn az-btn-primary" type="submit">Apply</button>
</form>

<ul class="az-filter-chips">
  <li class="az-filter-chip">
    Status: Active
    <button class="az-filter-chip-remove" type="button" aria-label="Remove filter Status">×</button>
  </li>
</ul>
```

`az-filter` lays out filter fields; `az-filter-chips` lists the active filters, each removable. Applying filters is up to the consumer (client or server).
