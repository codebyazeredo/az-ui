import type { AttributeValue } from "./types";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const ATTRIBUTE_NAME = /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/;

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

export function classNames(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

export function renderAttributes(attributes: Record<string, AttributeValue | undefined>): string {
  return Object.entries(attributes)
    .map(([name, value]) => {
      if (value === undefined || value === false) return "";
      if (!ATTRIBUTE_NAME.test(name)) {
        throw new Error(`AZUI.Form: invalid attribute name "${name}".`);
      }
      return value === true ? ` ${name}` : ` ${name}="${escapeHtml(String(value))}"`;
    })
    .join("");
}
