# Declarative form API

`AZUI.Form` builds the field markup described in [Form fields](../components/form-fields.md) from option objects.

```ts
import { AZUI } from "az-ui";

const field = AZUI.Form.email({
  name: "email",
  label: "Email",
  required: true,
  helpText: "Work address",
  error: "Email already registered",
});

document.querySelector("form")?.append(field);
```

## Methods

| Method                                              | Returns       | Notes                                                                 |
| --------------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| `text`, `email`, `password`, `number`, `date`       | `HTMLElement` | Shortcuts for `input`.                                                |
| `input({ type, ... })`                              | `HTMLElement` | Generic input.                                                        |
| `textarea`, `select`, `checkbox`, `radio`, `switch` | `HTMLElement` | One field wrapped in `az-field`.                                      |
| `group({ label, fields })`                          | `HTMLElement` | `<fieldset>` with `<legend>`. `fields` are definitions with a `type`. |
| `render(definition)`                                | `string`      | Same markup as a string. Needs no DOM, so it works in Node and SSR.   |

`render` takes a definition, which is the options object plus `type`:

```ts
AZUI.Form.render({ type: "text", name: "username", label: "Username" });
```

## Options

Shared by all fields (`FormFieldOptions`):

| Option                 | Type                                          | Description                                                               |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `name`                 | `string`                                      | Required. Always preserved.                                               |
| `label`                | `string`                                      | Linked to the control with `for`/`id`.                                    |
| `required`, `disabled` | `boolean`                                     | Native attributes.                                                        |
| `helpText`, `error`    | `string`                                      | Linked with `aria-describedby`; `error` also sets `aria-invalid`.         |
| `className`            | `string`                                      | Added to the control.                                                     |
| `id`                   | `string`                                      | Defaults to `az-<name>` (plus `-<value>` for checkbox, radio and switch). |
| `attributes`           | `Record<string, string \| number \| boolean>` | Extra attributes. `id`, `name` and `class` cannot be overridden.          |

Text-like fields (`ControlFieldOptions`) also accept `placeholder`, `readonly` and `size` (`"sm" | "md" | "lg"`). The selects ignore `readonly`.

| Field                | Extra options                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------- |
| input                | `value: string \| number`                                                                |
| `textarea`           | `value`, `rows`                                                                          |
| `select`             | `options: { value, label, disabled? }[]`, `value`, `placeholder` (disabled first option) |
| `checkbox`, `switch` | `value?`, `checked`, `size`                                                              |
| `radio`              | `value` (required), `checked`, `size`                                                    |

## Security

Every string is HTML-escaped. Attribute names are validated and throw on invalid names. The element functions parse only the escaped markup produced by `render`.

## Errors

All failures throw an `Error` starting with `AZUI.Form:`: missing `name` and `id`, invalid attribute name, unknown field `type`.

## Accessibility

Generated fields always have a label association (when `label` is set), `aria-describedby` for help and error text, and `aria-invalid` on errors. Pass a `label` for every field.
