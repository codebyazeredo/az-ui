# Changelog

Based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

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
