import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readProjectFile } from "../helpers/css";

const COMPONENTS_DIR = "src/components";
const componentNames = readdirSync(COMPONENTS_DIR);

describe("component stylesheets", () => {
  it("has one stylesheet per component directory", () => {
    expect(componentNames.length).toBeGreaterThan(0);

    for (const name of componentNames) {
      expect(() => readProjectFile(`${COMPONENTS_DIR}/${name}/${name}.css`)).not.toThrow();
    }
  });

  it.each(componentNames)("%s is imported by styles.css", (name) => {
    expect(readProjectFile("src/styles/styles.css")).toContain(`../components/${name}/${name}.css`);
  });

  it.each(componentNames)(
    "%s uses only prefixed classes, tokens and no hard-coded colors",
    (name) => {
      const css = readProjectFile(`${COMPONENTS_DIR}/${name}/${name}.css`);
      const classNames = [...css.matchAll(/\.([a-z][\w-]*)/g)].map(([, className]) => className);

      expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(css).not.toMatch(/rgba?\(/);
      expect(css).not.toContain("!important");
      expect(classNames.every((className) => className?.startsWith("az-"))).toBe(true);
    },
  );

  it("respects reduced motion in every animated component", () => {
    for (const name of componentNames) {
      const css = readProjectFile(`${COMPONENTS_DIR}/${name}/${name}.css`);

      if (css.includes("@keyframes")) expect(css).toContain("prefers-reduced-motion");
    }
  });
});
