# Installation

AZ UI is shipped as the npm package `@codebyazeredo/az-ui`: ES modules, TypeScript declarations, one stylesheet and optional fonts. It has no runtime dependencies and does not require any framework.

> **Not published yet.** The package name is reserved for the first release. Until then, build it from the repository with `npm run build` and install the generated tarball with `npm pack`.

## Requirements

- A bundler that understands ES modules and CSS imports (Vite, webpack, Rollup, esbuild, Parcel and similar). Node 22 or later is needed to build the library itself.
- A browser from the supported list: the last two versions of Chrome, Edge, Firefox, Safari and iOS Safari.
- Components that are only CSS (Button, Card, Table, layouts and others) work with the stylesheet alone, on any stack.

## Install

```bash
npm install @codebyazeredo/az-ui
```

The package works with npm, pnpm, yarn and bun.

## Import the styles

Import the stylesheet once, in your application entry point.

```ts
import "@codebyazeredo/az-ui/styles.css";
```

It contains the tokens, the light and dark themes, every component, the utilities and the default font (Inter). Without a bundler, copy `node_modules/az-ui/dist/styles.css` to your public folder and link it with a `<link>` tag.

## Set up the page

```html source
<html lang="en" data-az-theme="light">
  <body class="az-body">
    ...
  </body>
</html>
```

| Piece           | Purpose                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-az-theme` | `light` (default) or `dark`. See [Themes](../foundations/themes.md).                                                           |
| `az-body`       | Optional. Applies `box-sizing`, font, color and background. Without it, AZ UI does not change any element that is not its own. |

## Import the JavaScript

Interactive components (Modal, Dropdown, Tabs, Datepicker and so on) are classes. Import only the ones you use:

```ts
import { Modal, Tabs } from "@codebyazeredo/az-ui";
```

Or initialize components from HTML attributes with the optional entry:

```ts
import "@codebyazeredo/az-ui/auto";
```

Importing `@codebyazeredo/az-ui` has no side effects, so unused components are removed by tree shaking. See the [JavaScript API](../javascript/overview.md).

## Choose a font

Inter is the default. Other families are opt-in, so nothing is downloaded unless you ask for it:

```ts
import "@codebyazeredo/az-ui/fonts/ibm-plex-sans.css";
```

Then add the matching class (`az-font-ibm-plex-sans`) to the element that should use it. The same pattern works for `source-sans-3`. Use `az-font-system` to rely on the system font and download nothing. Details in [Typography](../foundations/typography.md).

## TypeScript

Declarations are included. `AZUI.Form` definitions, component options and events are typed, and the types are exported from the main entry.

## Next steps

- [Quick start](quick-start.md): build your first screen.
- [Frameworks](../guides/frameworks.md): React, Vue, Angular, Svelte and more.
- [PHP and server-side](../guides/php.md): use the CSS classes from any template engine.
