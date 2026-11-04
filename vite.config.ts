import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
  },
});
