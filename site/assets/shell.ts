import { AZUI, CommandMenu } from "../../src/index";
import { NAV, NAV_ITEMS } from "./nav";
import packageJson from "../../package.json";

const SIDEBAR_OFFSET = "2.5rem";

const icon = (name: Parameters<typeof AZUI.Icon.create>[0]): string =>
  AZUI.Icon.create(name).outerHTML;

const siteHref = (href: string): string => `${import.meta.env.BASE_URL}${href}`;

function currentItemPath(): string {
  return location.pathname.replace(import.meta.env.BASE_URL, "");
}

function renderNavigation(currentPath: string): string {
  const sections = NAV.map((section) => {
    const links = section.items
      .map((item) => {
        const isCurrent = currentPath === item.href;
        return `<li><a class="az-navigation-menu-link" href="${siteHref(item.href)}"${isCurrent ? ' aria-current="page"' : ""}>${item.title}</a></li>`;
      })
      .join("");
    return `<li class="az-navigation-menu-heading">${section.title}</li>${links}`;
  }).join("");

  return `<ul class="az-navigation-menu">${sections}</ul>`;
}

function renderHeader(): string {
  return `
    <a class="docs-skip-link" href="#docs-content">Skip to content</a>
    <header class="az-navbar az-navbar-sticky docs-header">
      <button class="az-btn az-btn-ghost az-btn-sm docs-menu-button" type="button" data-az-toggle="offcanvas" data-az-target="#docs-drawer" aria-label="Open navigation">${icon("menu")}</button>
      <a class="az-navbar-brand" href="${siteHref("index.html")}">AZ UI <span class="az-badge az-badge-primary">v${packageJson.version}</span></a>
      <nav class="az-navbar-nav docs-header-links" aria-label="Site">
        <a class="docs-header-link" href="${siteHref("docs/getting-started/installation.html")}">Docs</a>
        <a class="docs-header-link" href="${siteHref("docs/components/button.html")}">Components</a>
        <a class="docs-header-link" href="${siteHref("examples/dashboard.html")}">Examples</a>
        <a class="docs-header-link" href="${siteHref("docs/guides/versioning.html")}">Roadmap</a>
      </nav>
      <div class="az-navbar-actions">
        <button class="az-btn az-btn-sm docs-search-button" type="button" aria-label="Search docs" data-az-toggle="command-menu" data-az-target="#docs-search">${icon("search")}<span>Search docs</span><kbd class="docs-kbd">Ctrl K</kbd></button>
        <button class="az-btn az-btn-ghost az-btn-sm" type="button" data-docs-theme-toggle aria-label="Toggle light and dark theme">${icon("sun")}</button>
      </div>
    </header>`;
}

function renderSearchMenu(): string {
  const items = NAV_ITEMS.map(
    (item) =>
      `<a class="az-command-menu-item" href="${siteHref(item.href)}" data-az-command="${item.href}">${item.title} <span class="az-text-muted az-text-sm">${item.section}</span></a>`,
  ).join("");

  return `
    <div class="az-command-menu" id="docs-search" hidden>
      <div class="az-command-menu-panel" aria-label="Search documentation">
        <input class="az-command-menu-input" placeholder="Search pages" aria-label="Search pages" />
        <div class="az-command-menu-list">${items}</div>
        <p class="az-command-menu-empty" hidden>No pages match your search</p>
      </div>
    </div>`;
}

function renderDrawer(currentPath: string): string {
  return `
    <div class="az-offcanvas az-offcanvas-start az-offcanvas-sm" id="docs-drawer" hidden>
      <div class="az-offcanvas-panel">
        <div class="az-offcanvas-header">
          <h2 class="az-offcanvas-title">Documentation</h2>
          <button class="az-btn az-btn-ghost az-btn-sm" type="button" data-az-dismiss aria-label="Close navigation">${icon("close")}</button>
        </div>
        <nav class="az-offcanvas-body" aria-label="Documentation">${renderNavigation(currentPath)}</nav>
      </div>
    </div>`;
}

function renderPager(currentPath: string): string {
  const index = NAV_ITEMS.findIndex((item) => item.href === currentPath);
  const previous = NAV_ITEMS[index - 1];
  const next = NAV_ITEMS[index + 1];
  if (index === -1 || (!previous && !next)) return "";

  const link = (item: typeof previous, label: string, direction: "previous" | "next") =>
    item
      ? `<a class="docs-pager-link docs-pager-${direction}" href="${siteHref(item.href)}"><span class="az-text-sm az-text-muted">${label}</span><span>${item.title}</span></a>`
      : "<span></span>";

  return `<nav class="docs-pager" aria-label="Pagination">${link(previous, "Previous", "previous")}${link(next, "Next", "next")}</nav>`;
}

function headingLabel(heading: HTMLHeadingElement): string {
  const clone = heading.cloneNode(true) as HTMLHeadingElement;
  clone.querySelector(".docs-anchor")?.remove();
  return clone.textContent?.trim() ?? "";
}

function renderTableOfContents(article: HTMLElement): string {
  const headings = [...article.querySelectorAll<HTMLHeadingElement>("h2[id]")];
  if (headings.length < 2) return "";

  const links = headings
    .map((heading) => {
      const label = headingLabel(heading);
      return `<li><a class="docs-toc-link" href="#${heading.id}">${label}</a></li>`;
    })
    .join("");

  return `<nav class="docs-toc" aria-label="On this page"><p class="docs-toc-title">On this page</p><ul>${links}</ul></nav>`;
}

export function mountShell(content: HTMLElement): void {
  const currentPath = currentItemPath();
  const article = content.querySelector<HTMLElement>(".docs-article");
  if (!article) return;

  content.insertAdjacentHTML("beforeend", renderPager(currentPath));
  const tableOfContents = renderTableOfContents(article);

  mountHeader();
  document.body.insertAdjacentHTML("beforeend", renderDrawer(currentPath));

  const layout = document.createElement("div");
  layout.className = "docs-layout";
  layout.innerHTML = `
    <aside class="az-sidebar az-sidebar-sticky docs-sidebar" style="--az-sidebar-offset: ${SIDEBAR_OFFSET}">
      <nav class="az-sidebar-body" aria-label="Documentation">${renderNavigation(currentPath)}</nav>
    </aside>`;
  content.before(layout);
  layout.append(content);
  content.insertAdjacentHTML("afterend", tableOfContents);
}

export function mountHeader(): void {
  document.body.insertAdjacentHTML("afterbegin", renderHeader());
  document.body.insertAdjacentHTML("beforeend", renderSearchMenu());

  const searchMenu = document.getElementById("docs-search");
  if (searchMenu) new CommandMenu(searchMenu);
}
