import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const BREAKPOINTS_FILE = "src/foundations/breakpoints/breakpoints.json";
const OUTPUT_FILE = "src/styles/utilities/utilities.generated.css";

const breakpoints = JSON.parse(readFileSync(BREAKPOINTS_FILE, "utf8"));

const spacingValue = (step) => (step === 0 ? "0" : `var(--az-spacing-${step})`);
const steps = (prefix, property, values) =>
  values.map((step) => [`${prefix}-${step}`, `${property}: ${spacingValue(step)}`]);

const range = (last) => Array.from({ length: last }, (_, index) => index + 1);

const gridUtilities = [
  ...[1, 2, 3, 4, 6].map((count) => [
    `grid-cols-${count}`,
    `grid-template-columns: repeat(${count}, minmax(0, 1fr))`,
  ]),
  ...range(12).map((span) => [`col-${span}`, `grid-column: span ${span}`]),
];

const responsiveUtilities = [
  ...gridUtilities,

  ["d-none", "display: none"],
  ["d-block", "display: block"],
  ["d-inline", "display: inline"],
  ["d-inline-block", "display: inline-block"],
  ["d-flex", "display: flex"],
  ["d-grid", "display: grid"],

  ["flex-row", "flex-direction: row"],
  ["flex-column", "flex-direction: column"],
  ["flex-wrap", "flex-wrap: wrap"],
  ["flex-nowrap", "flex-wrap: nowrap"],
  ["justify-start", "justify-content: flex-start"],
  ["justify-center", "justify-content: center"],
  ["justify-between", "justify-content: space-between"],
  ["justify-end", "justify-content: flex-end"],
  ["align-start", "align-items: flex-start"],
  ["align-center", "align-items: center"],
  ["align-end", "align-items: flex-end"],

  ["text-left", "text-align: left"],
  ["text-center", "text-align: center"],
  ["text-right", "text-align: right"],

  ...steps("gap", "gap", [1, 2, 3, 4]),
  ...steps("m", "margin", [0, 1, 2, 3, 4]),
  ...steps("mt", "margin-top", [1, 2, 3]),
  ...steps("mb", "margin-bottom", [1, 2, 3]),
  ...steps("p", "padding", [1, 2, 3, 4]),
  ["px-2", `padding-inline: ${spacingValue(2)}`],
  ["px-3", `padding-inline: ${spacingValue(3)}`],
  ["py-2", `padding-block: ${spacingValue(2)}`],
  ["py-3", `padding-block: ${spacingValue(3)}`],
];

const staticUtilities = [
  ["text-primary", "color: var(--az-text-primary)"],
  ["text-secondary", "color: var(--az-text-secondary)"],
  ["text-muted", "color: var(--az-text-muted)"],
  ["text-brand", "color: var(--az-color-primary-text)"],
  ["text-success", "color: var(--az-color-success-text)"],
  ["text-danger", "color: var(--az-color-danger-text)"],
  ["text-warning", "color: var(--az-color-warning-text)"],

  ["fw-normal", "font-weight: var(--az-font-weight-normal)"],
  ["fw-medium", "font-weight: var(--az-font-weight-medium)"],
  ["fw-semibold", "font-weight: var(--az-font-weight-semibold)"],
  ["fw-bold", "font-weight: var(--az-font-weight-bold)"],

  ["text-sm", "font-size: var(--az-font-size-sm)"],
  ["text-md", "font-size: var(--az-font-size-md)"],
  ["text-lg", "font-size: var(--az-font-size-lg)"],

  ["border", "border: var(--az-border-width) solid var(--az-color-border)"],
  ["border-0", "border: 0"],
  ["border-top", "border-top: var(--az-border-width) solid var(--az-color-border)"],
  ["border-bottom", "border-bottom: var(--az-border-width) solid var(--az-color-border)"],

  ["rounded-sm", "border-radius: var(--az-radius-sm)"],
  ["rounded-md", "border-radius: var(--az-radius-md)"],
  ["rounded-lg", "border-radius: var(--az-radius-lg)"],

  ["w-100", "width: 100%"],
  ["w-auto", "width: auto"],
  ["h-100", "height: 100%"],
  ["h-auto", "height: auto"],
  ["min-w-0", "min-width: 0"],

  ["bg-surface", "background-color: var(--az-color-surface)"],
  ["bg-muted", "background-color: var(--az-color-surface-muted)"],
  ["bg-primary", "background-color: var(--az-color-primary)"],
  ["bg-success", "background-color: var(--az-color-success)"],
  ["bg-warning", "background-color: var(--az-color-warning)"],
  ["bg-danger", "background-color: var(--az-color-danger)"],
];

const renderRule = (className, declaration) => `.${className} {\n  ${declaration};\n}\n`;

const renderRules = (utilities, classPrefix, indent = "") =>
  utilities
    .map(([name, declaration]) => renderRule(`${classPrefix}${name}`, declaration))
    .join("\n")
    .split("\n")
    .map((line) => (line ? indent + line : line))
    .join("\n");

const breakpointTokens = Object.entries(breakpoints)
  .map(([name, width]) => `  --az-breakpoint-${name}: ${width}px;`)
  .join("\n");

const mediaBlocks = Object.entries(breakpoints).map(
  ([name, width]) =>
    `@media (width >= ${width}px) {\n${renderRules(responsiveUtilities, `az-${name}-`, "  ")}}\n`,
);

const output = [
  `:root {\n${breakpointTokens}\n}\n`,
  renderRules(staticUtilities, "az-"),
  renderRules(responsiveUtilities, "az-"),
  ...mediaBlocks,
].join("\n");

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, output);
console.log(`Generated ${OUTPUT_FILE}`);
