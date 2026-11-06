# Quick start

Build a small screen with the stylesheet, one HTML-only component and one interactive component.

## 1. A page with components

Components are classes on native elements. Every example on this site is live and the code below it is the exact markup that renders it.

```html
<section class="az-card">
  <div class="az-card-header">Approve order #1042</div>
  <div class="az-card-body">Acme Ltd. · 14 items · $4,820.00</div>
  <div class="az-card-footer az-stack az-stack-horizontal az-stack-sm">
    <button class="az-btn az-btn-primary" type="button">Approve</button>
    <button class="az-btn" type="button">Reject</button>
  </div>
</section>
```

## 2. A form field

Labels, help text and errors are linked with `for`, `id` and `aria-describedby`.

```html
<div class="az-field">
  <label class="az-field-label" for="quick-email">Work email</label>
  <input class="az-control" id="quick-email" type="email" placeholder="ana@acme.com" />
  <p class="az-field-help">We send the approval receipt here.</p>
</div>
```

The same field can be generated from a definition with the [declarative form API](../forms/declarative-api.md).

## 3. An interactive component

With `az-ui/auto` imported once, attributes are enough to open a modal. The component adds the dialog role and ARIA attributes itself.

```html
<button
  class="az-btn az-btn-primary"
  type="button"
  data-az-toggle="modal"
  data-az-target="#quick-modal"
>
  Open modal
</button>

<div class="az-modal" id="quick-modal" hidden>
  <div class="az-modal-dialog">
    <div class="az-modal-header">
      <h2 class="az-modal-title">Discard changes?</h2>
    </div>
    <div class="az-modal-body">Unsaved changes will be lost.</div>
    <div class="az-modal-footer">
      <button class="az-btn" type="button" data-az-dismiss>Keep editing</button>
      <button class="az-btn az-btn-danger" type="button" data-az-dismiss>Discard</button>
    </div>
  </div>
</div>
```

For options, events and `show()`/`hide()`, use the class instead:

```ts
import { Modal } from "az-ui";

const modal = new Modal("#quick-modal");
document.addEventListener("az:modal:hide", (event) => {
  if (hasUnsavedChanges()) event.preventDefault();
});
modal.show();
```

## Where to go next

- Browse the component catalog in the sidebar. Each page lists classes, options, events, states and accessibility notes.
- Open the example screens to see complete pages: a [dashboard](../../examples/dashboard.html), an [orders list](../../examples/orders.html) and an [order form](../../examples/order-form.html).
- Read [Customization](../guides/customization.md) to apply your brand with tokens.
