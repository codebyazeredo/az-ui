# Themes

AZ UI ships a light and a dark theme. A theme is a set of semantic color tokens selected by an attribute, so switching needs no JavaScript and no extra stylesheet.

## Select a theme

```html source
<html data-az-theme="light">
  …
</html>
<html data-az-theme="dark">
  …
</html>
```

Light is the default when the attribute is missing. The attribute works on any element, so a single panel can be dark inside a light page:

```html
<section class="az-card" data-az-theme="dark">
  <div class="az-card-header">Always dark</div>
  <div class="az-card-body">This card reads the dark tokens.</div>
</section>
```

## Switch at runtime

```ts
const root = document.documentElement;

function toggleTheme() {
  const next = root.dataset.azTheme === "dark" ? "light" : "dark";
  root.dataset.azTheme = next;
  localStorage.setItem("theme", next);
}
```

To avoid a flash of the wrong theme, set the attribute in a small inline script in `<head>`, before the stylesheet is applied:

```html source
<script>
  document.documentElement.dataset.azTheme =
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
</script>
```

The library does not follow the operating system preference on its own: you decide when to apply it.

## What changes between themes

Only the semantic tokens in [Colors](colors.md#semantic-tokens): primary, status text colors, background, surfaces, borders, text and the focus ring. Spacing, typography and radii are shared. Shadows are stronger in the dark theme.

## Rules for your own CSS

- Read semantic tokens (`var(--az-color-surface)`), never scale steps (`var(--az-gray-100)`), or your component will not follow the theme.
- Do not hard-code colors. If you need a color the tokens do not have, define a token for it in both themes.
- Test every screen in both themes. The example screens in this site have a theme toggle in the header.

See [Customization](../guides/customization.md) to define your own brand theme.
