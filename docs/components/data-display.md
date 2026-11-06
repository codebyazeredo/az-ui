# Data display: Progress, Stat, Status Indicator, Key Value, List Group, Timeline, Empty State

CSS-only building blocks for dashboards and detail screens.

## Progress

```html
<div
  class="az-progress az-progress-success"
  role="progressbar"
  aria-valuenow="60"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Upload"
>
  <div class="az-progress-bar" style="width: 60%"></div>
</div>
```

Variants `az-progress-success`, `-warning`, `-danger`; sizes `az-progress-sm`, `az-progress-lg`. Always set `role="progressbar"` with `aria-valuenow` and a name; the width is yours to update.

## Stat

```html
<div class="az-stat">
  <span class="az-stat-label">Open orders</span>
  <span class="az-stat-value">1,284</span>
  <span class="az-stat-trend az-stat-trend-up">+4.2% this week</span>
</div>
```

Trend modifiers: `az-stat-trend-up` and `az-stat-trend-down`. Do not rely on color alone; write the sign or direction in the text.

## Status Indicator

```html
<span class="az-status az-status-success">Active</span>
```

A colored dot plus text. Variants `az-status-success`, `-warning`, `-danger`, `-info` (neutral by default). The text carries the meaning.

## Key Value

```html
<dl class="az-key-value">
  <dt class="az-key-value-key">Customer</dt>
  <dd class="az-key-value-value">Acme Ltd.</dd>
  <dt class="az-key-value-key">Status</dt>
  <dd class="az-key-value-value">Active</dd>
</dl>
```

Two-column description list for detail screens.

## List Group

```html
<ul class="az-list-group">
  <li class="az-list-group-item" aria-current="true">Overview</li>
  <li class="az-list-group-item">History</li>
</ul>
```

Items can be `<li>` or `<a class="az-list-group-item">` (hover and focus styles). `aria-current="true"` highlights the current item.

## Timeline

```html
<ol class="az-timeline">
  <li class="az-timeline-item az-timeline-success">
    <div class="az-timeline-title">Order approved</div>
    <div class="az-timeline-time">Nov 6, 10:42</div>
    <p class="az-timeline-text">Approved by finance.</p>
  </li>
</ol>
```

Tones `az-timeline-primary`, `-success`, `-warning`, `-danger`. Use an ordered list for chronological events.

## Empty State

```html
<div class="az-empty-state">
  <p class="az-empty-state-title">No records found</p>
  <p class="az-empty-state-text">Try changing the filters.</p>
  <div class="az-empty-state-actions">
    <button class="az-btn az-btn-primary" type="button">Clear filters</button>
  </div>
</div>
```

Pair it with a [DataTable](./table.md) through `az-table-empty`.
