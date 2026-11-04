import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { PROJECT_ROOT, readProjectFile } from "../helpers/css";

const distDir = resolve(PROJECT_ROOT, "dist");
const cssBundles = [
  "dist/styles.css",
  "dist/fonts/ibm-plex-sans.css",
  "dist/fonts/source-sans-3.css",
];

function collectExportTargets(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(collectExportTargets);
  return [];
}

describe.skipIf(!existsSync(distDir))("built package (dist)", () => {
  it("contains every file referenced by package.json exports", () => {
    const { exports: packageExports } = JSON.parse(readProjectFile("package.json")) as {
      exports: unknown;
    };

    for (const target of collectExportTargets(packageExports)) {
      expect(existsSync(resolve(PROJECT_ROOT, target)), target).toBe(true);
    }
  });

  it("builds a self-contained styles.css with tokens, themes, default font and utilities", () => {
    const css = readProjectFile("dist/styles.css");

    expect(css).not.toContain("@import");
    for (const expected of [
      "--az-primary-700",
      '[data-az-theme="dark"]',
      'font-family: "AZ Inter"',
      ".az-body",
      ".az-md-d-flex",
    ]) {
      expect(css, expected).toContain(expected);
    }
    expect(css).not.toContain("AZ IBM Plex Sans");
  });

  it.each(cssBundles)("%s references only font files that exist in the package", (bundle) => {
    const css = readProjectFile(bundle);
    const urls = [...css.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]!);

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith("./"), url).toBe(true);
      expect(existsSync(resolve(PROJECT_ROOT, dirname(bundle), url)), url).toBe(true);
    }
  });

  it("copies the license of each font family", () => {
    for (const family of ["inter", "ibm-plex-sans", "source-sans-3"]) {
      const licenses = ["LICENSE.txt", "LICENSE.md"].map((name) =>
        resolve(distDir, "fonts", family, name),
      );
      expect(licenses.some(existsSync), family).toBe(true);
    }
  });

  it("ships type declarations and a working ESM module", async () => {
    expect(readFileSync(resolve(distDir, "index.d.ts"), "utf8")).toContain("BREAKPOINTS");

    const built = await import(pathToFileURL(resolve(distDir, "index.js")).href);
    expect(built.BREAKPOINTS.md).toBe(768);
  });
});
