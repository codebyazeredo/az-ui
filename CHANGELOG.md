# Changelog

Based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Interaction components (Enterprise phase, batch 1): `Collapse`, `Sortable` (native drag and drop between lists of a group, with keyboard and screen reader support), composable `Kanban` (optional lanes, per-column card limit, cancelable `az:kanban:move`), `Tree`, `Stepper` and `Splitter`, with `examples/interaction.html`.
- `Modal` is draggable by its header by default (`draggable` option; it stays within the viewport and recenters on every open).
- Live example pages in `examples/` served by `npm run dev`: components, forms, data, overlays and modals, icons and four complete screens (dashboard, orders, order form, sign in).
- Documentation (Phase 6): foundations, getting started, customization, accessibility, PHP and framework guides, and versioning pages in `docs/`, plus screenshots in `docs/images/`.
- Rewritten `README.md`.
- Icon set: 253 SVG icons in 13 categories (including `logistics`) on a 24×24 grid with `currentColor`, exposed as `AZUI.Icon` (`create`, `sprite`, `names`, `categories`), `az-icon` styles and a catalog in `examples/icons.html`.
- Layout components (Phase 5): Container, Stack, Grid, Row/Column (12 columns with responsive `az-{breakpoint}-col-N` and `grid-cols-N` utilities), Split Layout, Page Header, Content Section, Breadcrumb, Navigation Menu (vertical, horizontal and collapsible groups), Navbar and Sidebar, all CSS only.
- `FileUpload` component: drop zone and file list for `<input type="file">` with thumbnails, type, size and count validation, removal and progress/error reporting. `AZUI.Form.file` accepts `maxSize` and `maxFiles`.
- `Select` component: custom dropdown list for `<select>` and `<select multiple>` (chips for multiple) that keeps the native element synchronized. `AZUI.Form.select` and `multiselect` use it with `az-ui/auto`.
- Data components (Phase 4): Table (sortable headers, row selection, row actions, sizes, loading and empty states), `DataTable` (client-side sorting, search, pagination and selection with cancelable events for server-side data), `Pagination`, Progress, Empty State, Stat, Status Indicator, Key Value, List Group, Timeline, Toolbar, Search and Filter.
- Advanced form fields in `AZUI.Form` and CSS: `multiselect`, `file`, `range`, input group (`prefix`, `suffix`) and character counter (`maxLength`, `counter`, `Counter` class).
- AI context matrix in `.ai/` and project control files (pre-development).
- Basic components (Phase 2): Button, Badge, Alert, Spinner, Skeleton, Divider, Card, Avatar and form fields (input, textarea, select, checkbox, radio, switch) as CSS included in `az-ui/styles.css`.
- Context menu, command menu (`Ctrl/Cmd+K`) and notification panel (`NotificationPanel`) components.
- Interactive components (Phase 3): Modal, Offcanvas, Dropdown, Tooltip, Popover, Tabs, Toast and Datepicker as classes with a shared lifecycle (`show`, `hide`, `destroy`, `az:<component>:<event>` events), Accordion as CSS on native `<details>`, and the optional `az-ui/auto` entry for `data-az-*` initialization.
- `sm` and `lg` size modifiers for Button, Badge, Alert, Card, Spinner, Avatar, form controls, checkbox, radio and switch (`size` option in `AZUI.Form`).
- Declarative form API `AZUI.Form` (`text`, `email`, `password`, `number`, `date`, `input`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `group`, `render`), exported from the package with its types.
- Foundations (Phase 1): color, typography, spacing, border, shadow, motion and z-index tokens; light and dark themes; Inter (default), IBM Plex Sans and Source Sans 3 fonts; opt-in reset (`.az-body`); CSS utilities with responsive variants; ESM build with types, CSS and fonts.

### Changed

- `az-sidebar-sticky` now stretches to the bottom of the viewport (`height` instead of `max-height`).
- `Pagination`, `Datepicker`, `FileUpload` and `Toast` render SVG icons instead of text characters (`‹`, `›`, `↑`, `×`).
