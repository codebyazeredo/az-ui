import { describe, expect, it } from "vitest";
import * as library from "../../src";
import { readProjectFile } from "../helpers/css";

describe("public exports", () => {
  it("exports only BREAKPOINTS at this stage", () => {
    expect(Object.keys(library)).toEqual(["BREAKPOINTS"]);
  });

  it("defines the official breakpoints", () => {
    expect(library.BREAKPOINTS).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280 });
  });

  it("declares the planned entry points in package.json", () => {
    const { exports: packageExports } = JSON.parse(readProjectFile("package.json")) as {
      exports: Record<string, unknown>;
    };

    expect(Object.keys(packageExports)).toEqual([
      ".",
      "./styles.css",
      "./fonts/ibm-plex-sans.css",
      "./fonts/source-sans-3.css",
      "./package.json",
    ]);
  });
});
