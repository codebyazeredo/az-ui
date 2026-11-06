import { ICON_CATEGORIES, ICON_NAMES, ICONS } from "./icons";
import type { IconCategory, IconName } from "./icons";

export type IconSize = "sm" | "md" | "lg";

export interface IconOptions {
  size?: IconSize;
  label?: string;
}

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const VIEW_BOX = "0 0 24 24";
const SPRITE_ID_PREFIX = "az-icon-";

function createSvgElement<Tag extends "svg" | "path" | "symbol">(
  tag: Tag,
): SVGElementTagNameMap[Tag] {
  return document.createElementNS(SVG_NAMESPACE, tag);
}

function createPaths(name: IconName): SVGPathElement[] {
  return ICONS[name].map((definition) => {
    const path = createSvgElement("path");
    path.setAttribute("d", definition);
    return path;
  });
}

function assertIconName(name: string): asserts name is IconName {
  if (!Object.hasOwn(ICONS, name)) throw new Error(`Unknown icon "${name}".`);
}

function create(name: IconName, options: IconOptions = {}): SVGSVGElement {
  assertIconName(name);

  const svg = createSvgElement("svg");
  svg.setAttribute("class", options.size ? `az-icon az-icon-${options.size}` : "az-icon");
  svg.setAttribute("viewBox", VIEW_BOX);
  svg.setAttribute("focusable", "false");

  if (options.label) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", options.label);
  } else {
    svg.setAttribute("aria-hidden", "true");
  }

  svg.append(...createPaths(name));

  return svg;
}

function sprite(): SVGSVGElement {
  const container = createSvgElement("svg");
  container.setAttribute("aria-hidden", "true");
  container.style.display = "none";

  for (const name of ICON_NAMES) {
    const symbol = createSvgElement("symbol");
    symbol.setAttribute("id", `${SPRITE_ID_PREFIX}${name}`);
    symbol.setAttribute("viewBox", VIEW_BOX);
    symbol.append(...createPaths(name));
    container.append(symbol);
  }

  return container;
}

const categories = Object.fromEntries(
  Object.entries(ICON_CATEGORIES).map(([category, set]) => [category, Object.keys(set)]),
) as Record<IconCategory, IconName[]>;

export const Icon = { create, sprite, names: ICON_NAMES, categories } as const;
