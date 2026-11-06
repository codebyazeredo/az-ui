import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: { index: "src/index.ts", auto: "src/auto.ts" },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
});
