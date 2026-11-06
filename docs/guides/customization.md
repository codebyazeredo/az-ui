# Customization

AZ UI is customized with tokens, not with overrides of component selectors. Change a custom property and every component that reads it follows, in both themes.

## Apply your brand color

Override the semantic tokens after importing `az-ui/styles.css`. Define them for both themes so dark mode keeps its contrast.

```css
:root,
[data-az-theme="light"] {
  --az-color-primary: #0b5c3a;
  --az-color-primary-hover: #084a2f;
  --az-color-primary-text: #0b5c3a;
  --az-focus-ring-color: #1f8a5b;
}

[data-az-theme="dark"] {
  --az-color-primary: #1f8a5b;
  --az-color-primary-hover: #26a06a;
  --az-color-primary-text: #7fd1a8;
  --az-focus-ring-color: #7fd1a8;
}
```

Check that text on `--az-color-primary` (white by default) and `--az-color-primary-text` on the surface keep at least 4.5:1 contrast.

## Scope a brand to part of the page

Override semantic tokens (`--az-color-*`) on the container. Scale steps such as `--az-primary-700` are already resolved on the root, so overriding them on a child has no effect.

```html source
<section class="brand-acme">
  <button class="az-btn az-btn-primary" type="button">Acme action</button>
</section>
```

```css
.brand-acme {
  --az-color-primary: #8a2b1d;
  --az-color-primary-hover: #70221a;
  --az-color-primary-text: #8a2b1d;
}
```

This is the basis for white-label products: one stylesheet, one class per brand.

## Shape, density and type

```css
:root {
  --az-radius-md: 2px;
  --az-control-height-md: 36px;
  --az-font-size-base: 1rem;
  --az-font-family: "Acme Sans", system-ui, sans-serif;
}
```

Every component reads these tokens, so the change is global. See [Spacing and tokens](../foundations/spacing-and-tokens.md) for the full list.

## Rules that keep upgrades safe

- Override tokens. Do not write selectors such as `.az-btn { … }` to restyle components; they depend on internal structure that can change between minor versions.
- Do not use `!important`. Utilities already come last in the cascade.
- Load your overrides after `az-ui/styles.css`.
- Keep the focus ring visible. If you change its color, keep 3:1 contrast against the background.
- Prefer a modifier class of your own (`.my-toolbar`) that sets tokens over copying component CSS.

## Fonts

Bundled alternatives are opt-in, as described in [Typography](../foundations/typography.md#fonts). For a corporate font, set `--az-font-family` and load the font with your own `@font-face`.
