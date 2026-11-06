# Modal

Dialog window that requires attention. Behavior comes from the `Modal` class.

## Example

```html
<button class="az-btn az-btn-primary" data-az-toggle="modal" data-az-target="#confirm">
  Delete
</button>

<div class="az-modal" id="confirm" hidden>
  <div class="az-modal-dialog">
    <div class="az-modal-header">
      <h2 class="az-modal-title">Delete customer</h2>
      <button class="az-btn az-btn-ghost az-btn-sm" data-az-dismiss aria-label="Close">×</button>
    </div>
    <div class="az-modal-body">This action cannot be undone.</div>
    <div class="az-modal-footer">
      <button class="az-btn" data-az-dismiss>Cancel</button>
      <button class="az-btn az-btn-danger" data-az-dismiss>Delete</button>
    </div>
  </div>
</div>
```

```ts
import { Modal } from "az-ui";

const modal = new Modal("#confirm", { closeOnBackdrop: false });
modal.show();
```

## Options

| Option            | Default | Description                             |
| ----------------- | ------- | --------------------------------------- |
| `closeOnBackdrop` | `true`  | Click on the backdrop closes the modal. |
| `closeOnEscape`   | `true`  | `Escape` closes the modal.              |

## Methods and events

`show()`, `hide()`, `toggle()`, `destroy()`, `isOpen`. Events: `az:modal:show`, `shown`, `hide`, `hidden` (see [JavaScript API](../javascript/overview.md)).

## Variations

`az-modal-sm` (24rem) and `az-modal-lg` (48rem) on `az-modal`; default is 32rem.

## Accessibility

The dialog gets `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing to `az-modal-title`. Focus moves to the first focusable element, stays inside while open and returns to the opener on close. Page scroll is locked while open.

## Notes

Required structure: `.az-modal` containing `.az-modal-dialog`. Add the `hidden` attribute to `.az-modal` so it stays closed before JavaScript runs. Use a modal only for decisions or tasks that must interrupt the user.
