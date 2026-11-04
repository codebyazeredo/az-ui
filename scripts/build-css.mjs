import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import postcss from "postcss";
import postcssImport from "postcss-import";

const FONTS_SOURCE_DIR = "fonts";
const FONTS_DIST_DIR = "dist/fonts";
// Source CSS points at the repository fonts/ folder; the published CSS must point at dist/fonts.
const SOURCE_FONT_URL = /url\((["']?)(?:\.\.\/)+fonts\//g;

const bundles = [
  { entry: "src/styles/styles.css", output: "dist/styles.css", fontsPath: "./fonts/" },
  {
    entry: "src/foundations/typography/fonts/ibm-plex-sans.css",
    output: "dist/fonts/ibm-plex-sans.css",
    fontsPath: "./",
  },
  {
    entry: "src/foundations/typography/fonts/source-sans-3.css",
    output: "dist/fonts/source-sans-3.css",
    fontsPath: "./",
  },
];

async function buildBundle({ entry, output, fontsPath }) {
  const source = readFileSync(entry, "utf8");
  const result = await postcss([postcssImport()]).process(source, { from: entry });
  const css = result.css.replace(SOURCE_FONT_URL, `url($1${fontsPath}`);

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, css);
  console.log(`Generated ${output}`);
}

cpSync(FONTS_SOURCE_DIR, FONTS_DIST_DIR, { recursive: true });
console.log(`Copied ${FONTS_SOURCE_DIR} -> ${FONTS_DIST_DIR}`);

for (const bundle of bundles) {
  await buildBundle(bundle);
}
