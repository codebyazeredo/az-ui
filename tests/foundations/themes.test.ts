import { describe, expect, it } from "vitest";
import { contrastRatio, readProjectFile, resolveValue, tokensOf } from "../helpers/css";

const WCAG_AA_TEXT = 4.5;

const primitives = tokensOf(readProjectFile("src/foundations/colors/scales.css"), ":root");
const themes = {
  light: tokensOf(readProjectFile("src/styles/themes/light.css"), ":root"),
  dark: tokensOf(readProjectFile("src/styles/themes/dark.css"), '[data-az-theme="dark"]'),
};

const textTokens = ["--az-text-primary", "--az-text-secondary", "--az-text-muted"];
const statusTextTokens = [
  "--az-color-primary-text",
  "--az-color-success-text",
  "--az-color-warning-text",
  "--az-color-danger-text",
  "--az-color-info-text",
];
const surfaceTokens = ["--az-color-background", "--az-color-surface", "--az-color-surface-muted"];
const filledTokens = [
  "--az-color-primary",
  "--az-color-primary-hover",
  "--az-color-secondary",
  "--az-color-success",
  "--az-color-danger",
  "--az-color-info",
];

const pairsOf = (foregrounds: string[], backgrounds: string[]) =>
  foregrounds.flatMap((foreground) => backgrounds.map((background) => [foreground, background]));

describe("themes", () => {
  it("defines the same tokens in the dark theme as in the light theme", () => {
    expect(Object.keys(themes.dark).sort()).toEqual(Object.keys(themes.light).sort());
  });

  describe.each(Object.entries(themes))("%s theme", (_themeName, theme) => {
    const color = (token: string) => resolveValue(`var(${token})`, theme, primitives);

    it("resolves every token to a defined value", () => {
      for (const token of Object.keys(theme)) {
        expect(() => color(token), token).not.toThrow();
      }
    });

    it.each(pairsOf(textTokens, surfaceTokens))("%s meets AA contrast on %s", (text, surface) => {
      expect(contrastRatio(color(text!), color(surface!))).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
    });

    it.each(pairsOf(statusTextTokens, surfaceTokens))(
      "%s meets AA contrast on %s",
      (text, surface) => {
        expect(contrastRatio(color(text!), color(surface!))).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
      },
    );

    it.each(filledTokens)("--az-text-inverse meets AA contrast on %s", (filled) => {
      expect(contrastRatio(color("--az-text-inverse"), color(filled))).toBeGreaterThanOrEqual(
        WCAG_AA_TEXT,
      );
    });
  });
});
