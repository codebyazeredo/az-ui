# Spacing and tokens

Every design value is a CSS custom property prefixed with `--az-`. Components and utilities read tokens only, so changing a token changes the whole library.

## Spacing

A 4px base. The step number is the token suffix and the utility suffix: `--az-spacing-4` is 16px and `az-p-4` applies it.

```html preview
<div class="az-stack az-stack-sm">
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-1); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>1 · 4px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-2); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>2 · 8px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-3); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>3 · 12px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-4); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>4 · 16px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-6); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>6 · 24px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-8); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>8 · 32px</code>
  </div>
  <div class="az-d-flex az-align-center az-gap-2">
    <span
      style="width: var(--az-spacing-10); height: 16px; background: var(--az-color-primary)"
    ></span
    ><code>10 · 40px</code>
  </div>
</div>
```

Available steps: 1, 2, 3, 4, 5, 6, 8 and 10.

## Sizes

| Token                                    | Value                     |
| ---------------------------------------- | ------------------------- |
| `--az-control-height-sm`, `-md`, `-lg`   | 28px, 32px, 40px          |
| `--az-max-width-sm`, `-md`, `-lg`, `-xl` | 640, 768, 1024 and 1280px |

Controls default to `md` (32px), which is the density most enterprise screens need. Every component with density supports `-sm` and `-lg` modifiers.

## Borders and focus

| Token                                             | Value            |
| ------------------------------------------------- | ---------------- |
| `--az-border-width`                               | 1px              |
| `--az-radius-sm`, `-md`, `-lg`, `-none`           | 4px, 6px, 8px, 0 |
| `--az-focus-ring-width`, `--az-focus-ring-offset` | 2px, 2px         |
| `--az-focus-ring-color`                           | Theme token      |

Corners are deliberately small. Raise `--az-radius-*` if your brand calls for it.

## Shadows

| Token            | Use                                            |
| ---------------- | ---------------------------------------------- |
| `--az-shadow-sm` | Resting raised surfaces                        |
| `--az-shadow-md` | Floating surfaces: dropdowns, popovers, modals |

Shadows are subtle on purpose. Use borders for structure and shadows only for elements that float.

## Motion

| Token                                  | Value                        |
| -------------------------------------- | ---------------------------- |
| `--az-duration-fast`, `-base`, `-slow` | 120ms, 180ms, 240ms          |
| `--az-easing-standard`                 | `cubic-bezier(0.2, 0, 0, 1)` |

With `prefers-reduced-motion: reduce`, the durations collapse to 0.01ms and spinners, skeletons and progress stop animating.

## Layers

| Token             | Value | Layer             |
| ----------------- | ----- | ----------------- |
| `--az-z-dropdown` | 1000  | Dropdowns, menus  |
| `--az-z-sticky`   | 1100  | Sticky headers    |
| `--az-z-backdrop` | 1200  | Overlay backdrops |
| `--az-z-modal`    | 1300  | Modal, offcanvas  |
| `--az-z-popover`  | 1400  | Popovers          |
| `--az-z-toast`    | 1500  | Toasts            |
| `--az-z-tooltip`  | 1600  | Tooltips          |

## Breakpoints

Mobile first. Each breakpoint is available as a token, as a media query and as a utility prefix (`az-md-d-flex`).

| Name | Min width | Token                |
| ---- | --------- | -------------------- |
| `sm` | 640px     | `--az-breakpoint-sm` |
| `md` | 768px     | `--az-breakpoint-md` |
| `lg` | 1024px    | `--az-breakpoint-lg` |
| `xl` | 1280px    | `--az-breakpoint-xl` |

CSS custom properties cannot be used inside media queries, so write the pixel value: `@media (width >= 768px) { … }`. The same values are exported to JavaScript as `BREAKPOINTS`.
