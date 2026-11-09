# Typography

Compact, legible type for data-heavy screens. The base size is 15px; controls and tables step down to 14px and 13px to keep density high.

## Scale

```html preview
<div class="az-stack az-stack-sm">
  <div style="font-size: var(--az-font-size-2xl)">2xl · 24px · Quarterly report</div>
  <div style="font-size: var(--az-font-size-xl)">xl · 20px · Section title</div>
  <div style="font-size: var(--az-font-size-lg)">lg · 18px · Subsection title</div>
  <div style="font-size: var(--az-font-size-base)">
    base · 15px · Body text for paragraphs and descriptions
  </div>
  <div style="font-size: var(--az-font-size-md)">
    md · 14px · Controls, table cells and dense content
  </div>
  <div style="font-size: var(--az-font-size-sm)">
    sm · 13px · Help text, captions and secondary data
  </div>
  <div style="font-size: var(--az-font-size-xs)">xs · 12px · Badges and compact labels</div>
</div>
```

| Token                                           | Value                           |
| ----------------------------------------------- | ------------------------------- |
| `--az-font-size-xs` … `--az-font-size-2xl`      | 12, 13, 14, 15, 18, 20 and 24px |
| `--az-font-weight-normal`, `-medium`            | 400, 500                        |
| `--az-font-weight-semibold`, `-bold`            | 600, 700                        |
| `--az-line-height-tight`, `-normal`, `-relaxed` | 1.25, 1.5, 1.65                 |
| `--az-font-family`                              | Font stack used by `az-body`    |

## Fonts

Three families are bundled, all under the SIL Open Font License. Only Inter is loaded by default.

| Family        | How to use                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------ |
| Inter         | Default. Included in `@codebyazeredo/az-ui/styles.css`.                                    |
| IBM Plex Sans | `import "@codebyazeredo/az-ui/fonts/ibm-plex-sans.css"`, then add `az-font-ibm-plex-sans`. |
| Source Sans 3 | `import "@codebyazeredo/az-ui/fonts/source-sans-3.css"`, then add `az-font-source-sans-3`. |
| System        | Add `az-font-system`. Downloads nothing.                                                   |

Add the font class to `<body>` (or any container) to switch the whole page:

```html source
<body class="az-body az-font-ibm-plex-sans">
  ...
</body>
```

To use your own family, override the token and load the font yourself:

```css
:root {
  --az-font-family: "Acme Sans", system-ui, sans-serif;
}
```

## Hierarchy

- One `h1` per page. Do not skip heading levels, and do not use a heading element just for its size: use the utilities `az-text-lg`, `az-text-md`, `az-text-sm` and `az-fw-semibold`.
- Keep line length under about 75 characters for reading text.
- Use `az-text-muted` for secondary information, never for essential content.
