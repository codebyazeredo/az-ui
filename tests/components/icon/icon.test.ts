import { describe, expect, it } from "vitest";
import { Icon } from "../../../src/components/icon";
import type { IconName } from "../../../src/components/icon";

describe("Icon", () => {
  it("has unique names that all belong to exactly one category", () => {
    const categorized = Object.values(Icon.categories).flat();

    expect(new Set(Icon.names).size).toBe(Icon.names.length);
    expect(categorized).toHaveLength(Icon.names.length);
  });

  it("creates a decorative svg by default", () => {
    const icon = Icon.create("search");

    expect(icon.getAttribute("class")).toBe("az-icon");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(icon.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("applies size and label", () => {
    const icon = Icon.create("bell", { size: "lg", label: "Notifications" });

    expect(icon.getAttribute("class")).toBe("az-icon az-icon-lg");
    expect(icon.getAttribute("role")).toBe("img");
    expect(icon.getAttribute("aria-label")).toBe("Notifications");
    expect(icon.hasAttribute("aria-hidden")).toBe(false);
  });

  it("throws on an unknown icon name", () => {
    expect(() => Icon.create("missing" as IconName)).toThrow('Unknown icon "missing".');
  });

  it("builds a sprite with one symbol per icon", () => {
    const sprite = Icon.sprite();

    expect(sprite.querySelectorAll("symbol")).toHaveLength(Icon.names.length);
    expect(sprite.querySelector("#az-icon-search")).not.toBeNull();
  });
});
