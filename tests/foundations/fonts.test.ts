import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROJECT_ROOT, readProjectFile } from "../helpers/css";

const FONT_WEIGHTS = ["400", "500", "600", "700"];
const fontStylesheets = {
  "AZ Inter": "src/foundations/typography/fonts/inter.css",
  "AZ IBM Plex Sans": "src/foundations/typography/fonts/ibm-plex-sans.css",
  "AZ Source Sans 3": "src/foundations/typography/fonts/source-sans-3.css",
};

describe.each(Object.entries(fontStylesheets))("%s font", (family, stylesheet) => {
  const css = readProjectFile(stylesheet);

  it("declares the four weights with font-display swap", () => {
    for (const weight of FONT_WEIGHTS) {
      expect(css).toContain(`font-weight: ${weight};`);
    }
    expect(css.match(/font-display: swap;/g)).toHaveLength(FONT_WEIGHTS.length);
    expect(css.match(new RegExp(`font-family: "${family}";`, "g"))).toHaveLength(
      FONT_WEIGHTS.length,
    );
  });

  it("references WOFF2 files that exist", () => {
    const urls = [...css.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]!);
    expect(urls).toHaveLength(FONT_WEIGHTS.length);

    for (const url of urls) {
      expect(existsSync(resolve(PROJECT_ROOT, dirname(stylesheet), url)), url).toBe(true);
    }
  });
});
