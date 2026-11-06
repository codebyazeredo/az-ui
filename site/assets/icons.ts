import { AZUI } from "../../src/index";

const { Icon } = AZUI;

const catalog = document.getElementById("icon-catalog");
const filterInput = document.getElementById("icon-filter");
const statusMessage = document.getElementById("icon-status");
const countLabel = document.getElementById("icon-count");

function createIconButton(name: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "docs-icon-item";
  button.dataset.name = name;
  button.title = `Copy "${name}"`;
  button.append(Icon.create(name as Parameters<typeof Icon.create>[0]), name);
  return button;
}

function createCategory(category: string, names: readonly string[]): HTMLElement {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const grid = document.createElement("div");

  heading.textContent = `${category[0]?.toUpperCase()}${category.slice(1)} (${names.length})`;
  grid.className = "docs-icon-grid";
  grid.append(...names.map(createIconButton));
  section.append(heading, grid);
  return section;
}

function filterCategories(sections: HTMLElement[], term: string): number {
  let visibleCount = 0;

  for (const section of sections) {
    const buttons = section.querySelectorAll<HTMLButtonElement>(".docs-icon-item");
    let visibleInSection = 0;

    for (const button of buttons) {
      button.hidden = !(button.dataset.name ?? "").includes(term);
      if (!button.hidden) visibleInSection += 1;
    }

    section.hidden = visibleInSection === 0;
    visibleCount += visibleInSection;
  }

  return visibleCount;
}

async function copyIconName(button: HTMLButtonElement): Promise<void> {
  const name = button.dataset.name ?? "";

  try {
    await navigator.clipboard.writeText(name);
    if (statusMessage) statusMessage.textContent = `Copied "${name}"`;
  } catch {
    if (statusMessage) statusMessage.textContent = `The browser blocked copying "${name}"`;
  }
}

if (catalog && filterInput instanceof HTMLInputElement && statusMessage) {
  const sections = Object.entries(Icon.categories).map(([category, names]) =>
    createCategory(category, names),
  );

  catalog.append(...sections);
  if (countLabel) countLabel.textContent = String(Icon.names.length);

  filterInput.addEventListener("input", () => {
    const visibleCount = filterCategories(sections, filterInput.value.trim().toLowerCase());
    statusMessage.textContent = visibleCount === 0 ? "No icons match the filter" : "";
  });

  catalog.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".docs-icon-item") : null;
    if (button instanceof HTMLButtonElement) void copyIconName(button);
  });
}
