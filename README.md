# AZ UI

Component library and Design System for enterprise web applications, independent of frameworks.

- npm package: `az-ui` (not published yet)
- CSS prefix: `az-` · JavaScript namespace: `AZUI`

## Status

Phase 1 (Foundations) and Phase 2 (basic components and the declarative form API) are implemented. Interactive components (Modal, Dropdown, Tabs...) do not exist yet. Docs: [`docs/components/`](docs/components) and [`docs/forms/declarative-api.md`](docs/forms/declarative-api.md); live demo in `examples/components.html`. Project context lives in [`.ai/`](.ai/README.md) and progress in [`.ai/development/roadmap.md`](.ai/development/roadmap.md).

## Usage (foundations)

```ts
import "az-ui/styles.css"; // tokens, themes, Inter font and utilities
```

```html
<html data-az-theme="light">
  <body class="az-body">
    <div class="az-d-flex az-flex-column az-md-flex-row az-gap-3">…</div>
  </body>
</html>
```

- **Theme:** `data-az-theme="light"` (default) or `"dark"` on the root element.
- **`az-body`:** optional class that applies `box-sizing`, font, color and background. Without it, the library does not change any element of the page.
- **Alternative fonts:** `import "az-ui/fonts/ibm-plex-sans.css"` and use the `az-font-ibm-plex-sans` class (same for `source-sans-3`). `az-font-system` uses the system font without downloading files.
- **Customization:** override tokens, for example `:root { --az-font-family: "My Font", sans-serif; }`.
- **Responsive utilities:** `az-{sm|md|lg|xl}-<utility>` (mobile-first), for example `az-md-d-flex`.

## Development

```bash
npm install
npm run dev        # local server; open /examples/foundations.html
npm run build      # dist/: ESM, types, CSS and fonts
npm test           # tests (includes dist/ when it exists)
npm run lint
```

Full specification: [`.ai/specifications.md`](.ai/specifications.md). License: [MIT](LICENSE); fonts keep their OFL license in `fonts/<family>/`.
