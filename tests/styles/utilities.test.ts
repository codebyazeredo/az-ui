import { describe, expect, it } from "vitest";
import { BREAKPOINTS } from "../../src";
import { readProjectFile } from "../helpers/css";

const css = readProjectFile("src/styles/utilities/utilities.generated.css");

describe("generated utilities", () => {
  it("defines the static and base responsive classes", () => {
    for (const className of [
      ".az-d-none",
      ".az-d-flex",
      ".az-text-brand",
      ".az-mt-3",
      ".az-w-100",
    ]) {
      expect(css, className).toContain(`${className} {`);
    }
  });

  it("generates each breakpoint variant inside its media query", () => {
    for (const [name, width] of Object.entries(BREAKPOINTS)) {
      const mediaStart = css.indexOf(`@media (width >= ${width}px) {`);
      expect(mediaStart, `media query ${name}`).toBeGreaterThan(-1);
      expect(css.indexOf(`.az-${name}-d-flex {`, mediaStart)).toBeGreaterThan(mediaStart);
    }
  });

  it("generates grid column and span utilities with responsive variants", () => {
    for (const className of [".az-grid-cols-3", ".az-col-6", ".az-col-12"]) {
      expect(css, className).toContain(`${className} {\n  grid-`);
    }

    const mediumStart = css.indexOf(`@media (width >= ${BREAKPOINTS.md}px) {`);
    expect(css.indexOf(".az-md-grid-cols-3 {", mediumStart)).toBeGreaterThan(mediumStart);
    expect(css.indexOf(".az-md-col-6 {", mediumStart)).toBeGreaterThan(mediumStart);
    expect(css).not.toContain(".az-col-13");
  });

  it("does not generate responsive variants for static utilities", () => {
    expect(css).not.toContain(".az-md-text-brand");
    expect(css).not.toContain(".az-md-bg-primary");
  });

  it("declares the breakpoints as tokens", () => {
    for (const [name, width] of Object.entries(BREAKPOINTS)) {
      expect(css).toContain(`--az-breakpoint-${name}: ${width}px;`);
    }
  });

  it("places base classes before responsive variants", () => {
    expect(css.indexOf(".az-d-flex {")).toBeLessThan(css.indexOf("@media"));
  });
});
