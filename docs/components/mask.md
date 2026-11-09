# Mask

Formats an `<input>` while the user types, from a pattern you write. It also formats pasted text. The field keeps the formatted text as its value; read `rawValue` for the characters without the literals.

## Example

```html
<input class="az-control" data-az-component="mask" data-az-mask="99/99/9999" inputmode="numeric" />
```

```ts
import { Mask } from "az-ui";

const mask = new Mask("#document", { pattern: "999.999.999-99" });
mask.rawValue; // "12345678901"
```

## Pattern

| Symbol | Accepts                      |
| ------ | ---------------------------- |
| `9`    | A digit.                     |
| `a`    | A letter (any language).     |
| `*`    | A letter or a digit.         |
| other  | A literal, inserted for you. |

Characters that do not fit are ignored and text beyond the pattern is cut. A literal appears only when more data follows it, so `99/99/9999` shows `25` and then `25/1`. Trailing literals (as in `(99)`) appear once the pattern is complete.

## Options

| Option    | Data attribute | Description                                        |
| --------- | -------------- | -------------------------------------------------- |
| `pattern` | `data-az-mask` | The pattern. Required; without it the mask throws. |

## Properties and events

`rawValue`, `isComplete` and `destroy()`. The event `az:mask:complete` (`detail.value`) fires once each time the pattern becomes complete.

## Behavior

The caret stays after the character just typed, even when editing in the middle. Pressing `Backspace` right after a literal removes the character before it instead of getting stuck.

## Notes

Currency and numbers with separators are not pattern based and are not covered. Validation (for example, whether a date exists) is left to the application. Set `inputmode` yourself to get the right mobile keyboard.
