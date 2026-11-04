import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const PROJECT_ROOT = process.cwd();

export type Tokens = Record<string, string>;

export function readProjectFile(path: string): string {
  return readFileSync(resolve(PROJECT_ROOT, path), "utf8");
}

export function tokensOf(css: string, selector: string): Tokens {
  const tokens: Tokens = {};

  for (const [, blockSelector = "", body = ""] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!blockSelector.includes(selector)) continue;

    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      if (name && value) tokens[name] = value.trim();
    }
  }

  return tokens;
}

export function resolveValue(value: string, ...scopes: Tokens[]): string {
  const reference = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  if (!reference) return value;

  const next = scopes.map((scope) => scope[reference]).find((found) => found !== undefined);
  if (next === undefined) throw new Error(`Token not defined: ${reference}`);

  return resolveValue(next, ...scopes);
}

function hexToRgb(hex: string): [number, number, number] {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Invalid hex color: ${hex}`);

  return [0, 2, 4].map((start) => parseInt(full.slice(start, start + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  ) as [number, number];

  return (lighter + 0.05) / (darker + 0.05);
}
