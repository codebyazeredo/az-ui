# Colors

A restrained palette for dense, professional interfaces: a muted steel blue as brand color, cool neutrals, and four status hues kept for meaning only.

## Scales

Every scale has steps from 50 (lightest) to 900. Gray also has 850 and 950 for the dark theme. Components never read these steps directly: they read the [semantic tokens](#semantic-tokens), so a theme can remap them.

```html preview
<p class="docs-swatch-name">primary</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-primary-50)" title="#eef3f8">50</span
  ><span class="docs-swatch" style="background: var(--az-primary-100)" title="#d9e4ee">100</span
  ><span class="docs-swatch" style="background: var(--az-primary-200)" title="#b3c8db">200</span
  ><span class="docs-swatch" style="background: var(--az-primary-300)" title="#86a6c2">300</span
  ><span class="docs-swatch" style="background: var(--az-primary-400)" title="#5a82a6">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-primary-500)"
    title="#3d6688"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-primary-600)"
    title="#2f5272"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-primary-700)"
    title="#23415c"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-primary-800)"
    title="#1b344a"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-primary-900)"
    title="#12222f"
    >900</span
  >
</div>
<p class="docs-swatch-name">secondary</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-secondary-50)" title="#f8fafc">50</span
  ><span class="docs-swatch" style="background: var(--az-secondary-100)" title="#f1f5f9">100</span
  ><span class="docs-swatch" style="background: var(--az-secondary-200)" title="#e2e8f0">200</span
  ><span class="docs-swatch" style="background: var(--az-secondary-300)" title="#cbd5e1">300</span
  ><span class="docs-swatch" style="background: var(--az-secondary-400)" title="#94a3b8">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-secondary-500)"
    title="#64748b"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-secondary-600)"
    title="#526074"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-secondary-700)"
    title="#3f4b5c"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-secondary-800)"
    title="#2b3544"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-secondary-900)"
    title="#1b2330"
    >900</span
  >
</div>
<p class="docs-swatch-name">success</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-success-50)" title="#e9f6f0">50</span
  ><span class="docs-swatch" style="background: var(--az-success-100)" title="#cbeadb">100</span
  ><span class="docs-swatch" style="background: var(--az-success-200)" title="#9ad5b9">200</span
  ><span class="docs-swatch" style="background: var(--az-success-300)" title="#66bc96">300</span
  ><span class="docs-swatch" style="background: var(--az-success-400)" title="#36a173">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-success-500)"
    title="#1e9a6c"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-success-600)"
    title="#16845b"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-success-700)"
    title="#11694a"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-success-800)"
    title="#0d5039"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-success-900)"
    title="#083526"
    >900</span
  >
</div>
<p class="docs-swatch-name">warning</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-warning-50)" title="#fdf6e7">50</span
  ><span class="docs-swatch" style="background: var(--az-warning-100)" title="#faebc7">100</span
  ><span class="docs-swatch" style="background: var(--az-warning-200)" title="#f4d58f">200</span
  ><span class="docs-swatch" style="background: var(--az-warning-300)" title="#ebbb55">300</span
  ><span class="docs-swatch" style="background: var(--az-warning-400)" title="#d9a03a">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-warning-500)"
    title="#b7791f"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-warning-600)"
    title="#965f14"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-warning-700)"
    title="#744a10"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-warning-800)"
    title="#53350d"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-warning-900)"
    title="#36220a"
    >900</span
  >
</div>
<p class="docs-swatch-name">danger</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-danger-50)" title="#fcedeb">50</span
  ><span class="docs-swatch" style="background: var(--az-danger-100)" title="#f8d3ce">100</span
  ><span class="docs-swatch" style="background: var(--az-danger-200)" title="#f0a69d">200</span
  ><span class="docs-swatch" style="background: var(--az-danger-300)" title="#e67a6d">300</span
  ><span class="docs-swatch" style="background: var(--az-danger-400)" title="#d95a4b">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-danger-500)"
    title="#cc4535"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-danger-600)"
    title="#c0392b"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-danger-700)"
    title="#9c2d21"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-danger-800)"
    title="#7a2219"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-danger-900)"
    title="#521610"
    >900</span
  >
</div>
<p class="docs-swatch-name">info</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-info-50)" title="#e8f2f9">50</span
  ><span class="docs-swatch" style="background: var(--az-info-100)" title="#c9e0ef">100</span
  ><span class="docs-swatch" style="background: var(--az-info-200)" title="#94c1de">200</span
  ><span class="docs-swatch" style="background: var(--az-info-300)" title="#5fa1cc">300</span
  ><span class="docs-swatch" style="background: var(--az-info-400)" title="#3c8bbd">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-info-500)"
    title="#3280b2"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-info-600)"
    title="#2874a6"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-info-700)"
    title="#1f5c85"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-info-800)"
    title="#174563"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-info-900)"
    title="#0f2e42"
    >900</span
  >
</div>
<p class="docs-swatch-name">gray</p>
<div class="docs-swatches">
  <span class="docs-swatch" style="background: var(--az-gray-50)" title="#f8fafc">50</span
  ><span class="docs-swatch" style="background: var(--az-gray-100)" title="#f5f7f9">100</span
  ><span class="docs-swatch" style="background: var(--az-gray-200)" title="#dce2e8">200</span
  ><span class="docs-swatch" style="background: var(--az-gray-300)" title="#c5ced8">300</span
  ><span class="docs-swatch" style="background: var(--az-gray-400)" title="#a3aebb">400</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-500)"
    title="#8a96a5"
    >500</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-600)"
    title="#637082"
    >600</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-700)"
    title="#4f5d6e"
    >700</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-800)"
    title="#263445"
    >800</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-850)"
    title="#1f2b39"
    >850</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-900)"
    title="#1a2430"
    >900</span
  ><span
    class="docs-swatch docs-swatch-inverse"
    style="background: var(--az-gray-950)"
    title="#121a24"
    >950</span
  >
</div>
```

Scale tokens are named `--az-<scale>-<step>`, for example `--az-primary-700`. Hover a swatch to see its hex value.

## Semantic tokens

Use these in your own CSS. They change with the theme.

| Token                                                                    | Light                   | Dark                    | Use                               |
| ------------------------------------------------------------------------ | ----------------------- | ----------------------- | --------------------------------- |
| `--az-color-primary`                                                     | `primary-700`           | `primary-500`           | Primary actions, selected state   |
| `--az-color-primary-hover`                                               | `primary-800`           | `primary-600`           | Hover of primary actions          |
| `--az-color-primary-text`                                                | `primary-700`           | `primary-300`           | Brand-colored text and links      |
| `--az-color-success`, `-warning`, `-danger`, `-info`                     | status scales           | status scales           | Fills for status                  |
| `--az-color-success-text`, `-warning-text`, `-danger-text`, `-info-text` | readable on the surface | readable on the surface | Status text                       |
| `--az-color-background`                                                  | `gray-100`              | `gray-950`              | Page background                   |
| `--az-color-surface`                                                     | `white`                 | `gray-900`              | Cards, panels, controls           |
| `--az-color-surface-muted`                                               | `gray-50`               | `gray-850`              | Table headers, code, subtle areas |
| `--az-color-border`, `--az-color-border-strong`                          | `gray-200`, `gray-300`  | `gray-800`, `gray-700`  | Dividers and control borders      |
| `--az-text-primary`                                                      | `gray-800`              | `gray-100`              | Body text                         |
| `--az-text-secondary`                                                    | `gray-700`              | `gray-300`              | Supporting text                   |
| `--az-text-muted`                                                        | `gray-600`              | `gray-400`              | Hints and captions                |
| `--az-text-inverse`                                                      | `white`                 | `white`                 | Text on filled primary or status  |
| `--az-focus-ring-color`                                                  | `primary-500`           | `primary-300`           | Keyboard focus ring               |

## Using color well

- Never use color alone to carry meaning. Pair status colors with text or an icon, as Badge, Alert and Status Indicator do.
- Use status hues for status. Brand color belongs to the primary action: one `az-btn-primary` per view.
- Text on the surface keeps at least 4.5:1 contrast in both themes. If you change the palette, check contrast again.

## Opacity

`--az-opacity-disabled` (0.5) and `--az-opacity-overlay` (0.5) are the only opacity tokens.
