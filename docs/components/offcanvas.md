# Offcanvas

Side panel over the page, for filters, details or navigation. Same behavior as [Modal](modal.md), with the `Offcanvas` class.

## Example

```html
<button class="az-btn" data-az-toggle="offcanvas" data-az-target="#filters">Filters</button>

<div class="az-offcanvas" id="filters" hidden>
  <div class="az-offcanvas-panel">
    <div class="az-offcanvas-header">
      <h2 class="az-offcanvas-title">Filters</h2>
      <button class="az-btn az-btn-ghost az-btn-sm" data-az-dismiss aria-label="Close">×</button>
    </div>
    <div class="az-offcanvas-body">…</div>
    <div class="az-offcanvas-footer">
      <button class="az-btn az-btn-primary" data-az-dismiss>Apply</button>
    </div>
  </div>
</div>
```

```ts
import { Offcanvas } from "@codebyazeredo/az-ui";

new Offcanvas("#filters").show();
```

Add the `hidden` attribute to `.az-offcanvas` so it stays closed before JavaScript runs.

## Options, methods and events

Same as Modal, with events named `az:offcanvas:*`.

## Variations

The panel opens at the end (right in left-to-right pages). Add `az-offcanvas-start` for the start side. `az-offcanvas-sm` (18rem) and `az-offcanvas-lg` (32rem) change the width; default is 22rem.

## Accessibility

Dialog semantics, focus trap, focus return, scroll lock and `Escape`, as in Modal.
