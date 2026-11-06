# Layouts

CSS-only building blocks to compose full screens. Complete pages built with these components are in the [example screens](../../examples/screens/dashboard.html).

## Container

```html
<main class="az-container az-container-lg">…</main>
```

Centers content with side padding. Default max width is `--az-max-width-xl`; use `az-container-sm`, `-md`, `-lg` for narrower pages or `az-container-fluid` for full width.

## Stack

```html
<div class="az-stack az-stack-sm">…</div>
<div class="az-stack az-stack-horizontal">…</div>
```

Flex with a uniform gap (16px). `az-stack` is vertical; `az-stack-horizontal` wraps items in a row, centered vertically. Sizes `az-stack-sm` (8px) and `az-stack-lg` (24px).

## Flex

There is no Flex component: use the utilities `az-d-flex`, `az-flex-row`, `az-flex-column`, `az-flex-wrap`, `az-justify-*`, `az-align-*` and `az-gap-*`. All of them have responsive variants (`az-md-flex-column`).

## Grid

```html
<div class="az-grid az-grid-cols-1 az-md-grid-cols-3">…</div>
<div class="az-grid az-grid-fit" style="--az-grid-min-width: 14rem">…</div>
```

Equal columns. `az-grid-cols-{1,2,3,4,6}` fixes the count and accepts breakpoint prefixes (`az-md-grid-cols-3`). `az-grid-fit` fits as many columns as the minimum width allows (default 16rem, set with `--az-grid-min-width`). Gap sizes: `az-grid-sm`, `az-grid-lg`.

## Row and Column

```html
<div class="az-row">
  <div class="az-col-12 az-md-col-8">…</div>
  <div class="az-col-12 az-md-col-4">…</div>
</div>
```

A 12-column grid for asymmetric layouts. Children span the full width by default; `az-col-{1..12}` sets the span and accepts breakpoint prefixes (`az-sm-col-6`, `az-md-col-4`, `az-lg-col-3`, `az-xl-col-2`). Gap sizes: `az-row-sm`, `az-row-lg`.

Prefixes follow the utility breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280 (mobile-first).

## Split Layout

```html
<div class="az-split-layout">
  <div class="az-split-layout-aside">List</div>
  <div class="az-split-layout-main">Detail</div>
</div>
```

Two panes, such as list and detail. The aside has a 20rem basis and the main area at least 24rem; when the container is too narrow the panes stack. Adjust with `--az-split-layout-aside-width` and `--az-split-layout-main-min-width`. Sizes: `az-split-layout-sm`, `az-split-layout-lg`.

## Page Header

```html
<div class="az-page-header">
  <div class="az-page-header-main">
    <h1 class="az-page-header-title">Orders</h1>
    <p class="az-page-header-description">Track and approve orders.</p>
  </div>
  <div class="az-page-header-actions">
    <button class="az-btn az-btn-primary" type="button">New order</button>
  </div>
</div>
```

Title, optional description and primary actions, with a bottom border. Put a [Breadcrumb](#breadcrumb) above it. Use one `<h1>` per page.

## Content Section

```html
<section class="az-content-section" aria-labelledby="details">
  <div class="az-content-section-header">
    <h2 class="az-content-section-title" id="details">Details</h2>
    <div class="az-content-section-actions">
      <button class="az-btn az-btn-sm" type="button">Edit</button>
    </div>
  </div>
  …
</section>
```

Groups related content under a title and optional actions. Consecutive sections are separated by a border, not by cards. Optional `az-content-section-description`.

## Breadcrumb

```html
<nav aria-label="Breadcrumb">
  <ol class="az-breadcrumb">
    <li class="az-breadcrumb-item"><a href="/">Home</a></li>
    <li class="az-breadcrumb-item" aria-current="page">Orders</li>
  </ol>
</nav>
```

The separator is drawn by CSS and is not read by screen readers. Mark the current page with `aria-current="page"` on the last item.

## Navigation Menu

```html
<nav aria-label="Main">
  <ul class="az-navigation-menu">
    <li class="az-navigation-menu-heading">Orders</li>
    <li><a class="az-navigation-menu-link" href="/orders" aria-current="page">All orders</a></li>
    <li>
      <details class="az-navigation-menu-group" open>
        <summary class="az-navigation-menu-link">Archive</summary>
        <ul class="az-navigation-menu-sub">
          <li><a class="az-navigation-menu-link" href="/archive/2025">2025</a></li>
        </ul>
      </details>
    </li>
  </ul>
</nav>
```

Compact vertical list of links, with an accent bar on the current page, optional headings and collapsible groups built on native `<details>`. `az-navigation-menu-horizontal` lays the links in a row (no groups; use a [Dropdown](dropdown.md) for submenus). Sizes: `az-navigation-menu-sm`, `az-navigation-menu-lg`. The current page uses `aria-current="page"`.

## Navbar

```html source
<header class="az-navbar az-navbar-sticky">
  <a class="az-navbar-brand" href="/">Acme</a>
  <nav class="az-navbar-nav" aria-label="Sections">
    <ul class="az-navigation-menu az-navigation-menu-horizontal">
      …
    </ul>
  </nav>
  <div class="az-navbar-actions">…</div>
</header>
```

Compact top bar (2.5rem) on the surface color, with a thin bottom border, brand, navigation and actions. `az-navbar-sticky` pins it to the top; sizes `az-navbar-sm` (2.25rem) and `az-navbar-lg` (3rem). On small screens hide the navigation with `az-d-none az-md-d-flex` and open the same menu in an [Offcanvas](offcanvas.md) from a button.

## Sidebar

```html source
<div class="az-d-flex">
  <aside class="az-sidebar az-sidebar-sticky" style="--az-sidebar-offset: 2.5rem">
    <div class="az-sidebar-header">Orders</div>
    <nav class="az-sidebar-body" aria-label="Orders">…</nav>
    <div class="az-sidebar-footer">…</div>
  </aside>
  <main class="az-min-w-0">…</main>
</div>
```

Fixed-width column on the surface color (15rem; `az-sidebar-sm` 12rem, `az-sidebar-lg` 18rem) that scrolls its body. `az-sidebar-sticky` keeps it in view and stretches it to the bottom of the viewport; set `--az-sidebar-offset` to the height of a sticky navbar. Header and footer are optional.

To hide it, set the `hidden` attribute (the content expands) or hide it below a breakpoint with `az-d-none az-md-d-flex`. Without an icon set, there is no icon-only collapsed mode yet.

## Accessibility

Use landmarks (`<header>`, `<nav>`, `<aside>`, `<main>`) and give each `<nav>` a distinct `aria-label`. All links and summaries have a visible focus ring. Layout classes do not change reading order: keep the markup order equal to the visual order.
