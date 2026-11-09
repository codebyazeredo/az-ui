# Barcode input

Tells a barcode reader apart from a person typing. USB and Bluetooth readers behave like a keyboard: they type the code very fast and finish with `Enter`. When that happens the component emits an event with the code and clears the field. Normal typing is left alone.

## Example

```html
<input class="az-control" data-az-component="barcode" autofocus />
```

```ts
import { BarcodeInput } from "@codebyazeredo/az-ui";

const field = document.querySelector("#scan");
new BarcodeInput(field, { maxInterval: 80 });
field.addEventListener("az:barcode:scan", (event) => addItem(event.detail.code));
```

## Options

| Option        | Data attribute         | Default | Description                                                   |
| ------------- | ---------------------- | ------- | ------------------------------------------------------------- |
| `minLength`   | `data-az-min-length`   | `4`     | Shorter codes are never treated as a scan.                    |
| `maxInterval` | `data-az-max-interval` | `50`    | Maximum milliseconds between keys. Raise it for slow readers. |

## Behavior

On `Enter`, the text is a scan when it has at least `minLength` characters, every character came from a key press (not paste or edits) and every gap between keys is at most `maxInterval`. The scan prevents the `Enter` (so the form does not submit), emits `az:barcode:scan` with `detail.code` and empties the field. Otherwise `Enter` works as usual.

Readers that finish with `Tab` instead of `Enter` are not supported.

## Events

| Event             | `detail` |
| ----------------- | -------- |
| `az:barcode:scan` | `code`   |

`isScan(intervals, maxInterval)` is exported for custom handling.
