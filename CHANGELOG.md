# Changelog

Based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- AI context matrix in `.ai/` and project control files (pre-development).
- Basic components (Phase 2): Button, Badge, Alert, Spinner, Skeleton, Divider, Card, Avatar and form fields (input, textarea, select, checkbox, radio, switch) as CSS included in `az-ui/styles.css`.
- Interactive components (Phase 3): Modal, Offcanvas, Dropdown, Tooltip, Popover, Tabs, Toast and Datepicker as classes with a shared lifecycle (`show`, `hide`, `destroy`, `az:<component>:<event>` events), Accordion as CSS on native `<details>`, and the optional `az-ui/auto` entry for `data-az-*` initialization.
- `sm` and `lg` size modifiers for Button, Badge, Alert, Card, Spinner, Avatar, form controls, checkbox, radio and switch (`size` option in `AZUI.Form`).
- Declarative form API `AZUI.Form` (`text`, `email`, `password`, `number`, `date`, `input`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `group`, `render`), exported from the package with its types.
- Foundations (Phase 1): color, typography, spacing, border, shadow, motion and z-index tokens; light and dark themes; Inter (default), IBM Plex Sans and Source Sans 3 fonts; opt-in reset (`.az-body`); CSS utilities with responsive variants; ESM build with types, CSS and fonts.
