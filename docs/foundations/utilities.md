# Utilities

Single-purpose classes for layout and spacing, generated from the tokens. Utilities load last in `@codebyazeredo/az-ui/styles.css`, so they override component styles without `!important`.

```html
<div class="az-d-flex az-flex-column az-md-flex-row az-gap-3">
  <div class="az-bg-muted az-p-3 az-rounded-md">First</div>
  <div class="az-bg-muted az-p-3 az-rounded-md">Second</div>
</div>
```

## Responsive variants

Prefix with a breakpoint for a mobile-first override: `az-sm-`, `az-md-`, `az-lg-`, `az-xl-`. For example `az-md-d-flex` applies from 768px. Variants exist for display, flex, alignment, text alignment, gap, margin, padding and the grid utilities.

## Responsive utilities

| Group      | Classes                                                                                 |
| ---------- | --------------------------------------------------------------------------------------- |
| Display    | `az-d-none`, `az-d-block`, `az-d-inline`, `az-d-inline-block`, `az-d-flex`, `az-d-grid` |
| Flex       | `az-flex-row`, `az-flex-column`, `az-flex-wrap`, `az-flex-nowrap`                       |
| Alignment  | `az-justify-start`, `-center`, `-between`, `-end`; `az-align-start`, `-center`, `-end`  |
| Text align | `az-text-left`, `az-text-center`, `az-text-right`                                       |
| Gap        | `az-gap-1` … `az-gap-4`                                                                 |
| Margin     | `az-m-0` … `az-m-4`, `az-mt-1` … `az-mt-3`, `az-mb-1` … `az-mb-3`                       |
| Padding    | `az-p-1` … `az-p-4`, `az-px-2`, `az-px-3`, `az-py-2`, `az-py-3`                         |
| Grid       | `az-grid-cols-1`, `-2`, `-3`, `-4`, `-6`; `az-col-1` … `az-col-12` (span)               |

The number is a [spacing step](spacing-and-tokens.md#spacing): `az-p-3` is 12px.

## Static utilities

| Group       | Classes                                                                                |
| ----------- | -------------------------------------------------------------------------------------- |
| Text color  | `az-text-primary`, `-secondary`, `-muted`, `-brand`, `-success`, `-danger`, `-warning` |
| Font size   | `az-text-sm`, `az-text-md`, `az-text-lg`                                               |
| Font weight | `az-fw-normal`, `-medium`, `-semibold`, `-bold`                                        |
| Border      | `az-border`, `az-border-0`, `az-border-top`, `az-border-bottom`                        |
| Radius      | `az-rounded-sm`, `-md`, `-lg`                                                          |
| Size        | `az-w-100`, `az-w-auto`, `az-h-100`, `az-h-auto`, `az-min-w-0`                         |
| Background  | `az-bg-surface`, `-muted`, `-primary`, `-success`, `-warning`, `-danger`               |

## When to use a utility

Use utilities to arrange and space components. If you repeat the same set of utilities in many places, write a named class with tokens instead. Components such as [Stack, Grid and Row](../components/layouts.md) cover most page structure.
