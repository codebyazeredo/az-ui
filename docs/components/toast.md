# Toast

Temporary notification. Created from code; the toast is built with the DOM API, so content is always text.

## Example

```ts
import { Toast } from "az-ui";

Toast.show({ title: "Saved", message: "Customer updated.", variant: "success" });
Toast.show({ message: "Connection lost.", variant: "danger", duration: 0 });
```

## Content

| Property     | Default   | Description                                                |
| ------------ | --------- | ---------------------------------------------------------- |
| `message`    | required  | Text of the toast.                                         |
| `title`      | none      | Bold title above the message.                              |
| `variant`    | `"info"`  | `"info" \| "success" \| "warning" \| "danger"`.            |
| `duration`   | `5000`    | Milliseconds before closing. `0` keeps it until dismissed. |
| `closeLabel` | `"Close"` | Accessible name of the close button.                       |

`Toast.show()` returns the instance, which has `hide()` and `destroy()`. Toasts are added to a shared `.az-toast-container` fixed at the top right.

## Events

`az:toast:show`, `shown`, `hide`, `hidden`. `hide` is cancelable. A hidden toast is removed from the page.

## Accessibility

`role="status"` (polite) for info, success and warning; `role="alert"` for danger. The timer pauses while the pointer is over the toast or focus is inside it. Do not rely on toasts for information users must act on: use an [Alert](alert.md) or a [Modal](modal.md).

## Notes

To initialize an existing element, use `new Toast(element, { duration })` and call `show()`.
