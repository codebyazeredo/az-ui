import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vite";

const SITE_ROOT = resolve(import.meta.dirname, "site");

const pageEntries = readdirSync(SITE_ROOT, { recursive: true, encoding: "utf8" })
  .filter((path) => path.endsWith(".html"))
  .map((path) => join(SITE_ROOT, path));

export default defineConfig({
  root: SITE_ROOT,
  build: {
    outDir: resolve(import.meta.dirname, "dist-site"),
    emptyOutDir: true,
    rollupOptions: { input: pageEntries },
  },
});
