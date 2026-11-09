# PHP and server-side

AZ UI is plain CSS classes on native HTML, so it works with any server-rendered stack: plain PHP, Laravel Blade, Symfony Twig, Django, Rails, ASP.NET and others. The server only needs to print the right markup.

## Serve the assets

Build the package once (or install it from npm) and publish `dist/styles.css` and, if you use interactive components, a bundled script.

```html source
<link rel="stylesheet" href="/assets/az-ui/styles.css" />
```

CSS-only components (Button, Table, Card, Alert, layouts and the form fields) need nothing else.

## Render a form field in PHP

Escape every value that comes from users or the database. The markup is the same one `AZUI.Form` produces.

```php
<?php
function renderTextField(string $name, string $label, string $value = '', ?string $error = null): string
{
    $id = 'az-' . htmlspecialchars($name, ENT_QUOTES);
    $errorId = $id . '-error';
    $invalid = $error !== null ? ' aria-invalid="true" aria-describedby="' . $errorId . '"' : '';
    $errorHtml = $error !== null
        ? '<p class="az-field-error" id="' . $errorId . '">' . htmlspecialchars($error) . '</p>'
        : '';

    return '<div class="az-field">'
        . '<label class="az-field-label" for="' . $id . '">' . htmlspecialchars($label) . '</label>'
        . '<input class="az-control" id="' . $id . '" name="' . htmlspecialchars($name, ENT_QUOTES) . '" type="text"'
        . ' value="' . htmlspecialchars($value, ENT_QUOTES) . '"' . $invalid . ' />'
        . $errorHtml
        . '</div>';
}
```

In a template engine, the same markup is just a partial:

```html source
<div class="az-field">
  <label class="az-field-label" for="az-name">Name</label>
  <input class="az-control" id="az-name" name="name" type="text" value="{{ name }}" />
</div>
```

## Server validation errors

Show the message your API or validator returns in the field, and keep it linked to the input.

- Add `aria-invalid="true"` and `aria-describedby` pointing to the `az-field-error` paragraph.
- Use `az-alert az-alert-danger` with `role="alert"` for a form-level error.
- After a failed submit, move focus to the first invalid field or to the error summary.

## Interactive components

Initialize them from attributes with `@codebyazeredo/az-ui/auto`, bundled once with Vite, esbuild or any bundler, and loaded with a `<script type="module">` tag. Server-rendered markup does not need to change.

```html source
<script type="module" src="/assets/app.js"></script>
```

```ts
import "@codebyazeredo/az-ui/auto";
```

For content your server returns later (for example an HTML fragment loaded with `fetch`), initialize it after inserting:

```ts
import { initComponents } from "@codebyazeredo/az-ui/auto";

container.innerHTML = await response.text();
initComponents(container);
```

Only insert HTML your server produced and escaped.

## Declarative form API

`AZUI.Form.render(definition)` returns the field markup as a string and needs no DOM, so it works in Node. There is no PHP port yet.

> **Planned, not available:** a PHP adapter (`AZForm`) published as a separate package. Until it exists, render the markup in PHP as shown above.
