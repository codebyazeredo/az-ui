const COPY_LABEL_RESET_MS = 1600;

const HTML_PIECES = /<!--[\s\S]*?-->|<\/?[A-Za-z][^<>]*>/g;
const HTML_TAG_PARTS = /^(<\/?)([\w-]+)([\s\S]*?)(\/?>)$/;
const HTML_ATTRIBUTE = /([\w:@.-]+)=("[^"]*"|'[^']*')/g;

const SCRIPT_COMMENT = /\/\/[^\n]*|\/\*[\s\S]*?\*\//;
const SCRIPT_STRING = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/;
const SCRIPT_KEYWORD =
  /\b(?:import|export|from|const|let|new|await|async|function|return|if|else|type|interface|class|as|null|true|false|default|for|of)\b/;
const SCRIPT_PIECES = new RegExp(
  `(${SCRIPT_COMMENT.source})|(${SCRIPT_STRING.source})|(${SCRIPT_KEYWORD.source})`,
  "g",
);

const escapeText = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrap = (className: string, text: string): string =>
  `<span class="${className}">${escapeText(text)}</span>`;

function highlightHtmlTag(tag: string): string {
  const parts = tag.match(HTML_TAG_PARTS);
  if (!parts) return escapeText(tag);

  const [, opening = "", name = "", attributes = "", closing = ""] = parts;
  const coloredAttributes = escapeText(attributes).replace(
    HTML_ATTRIBUTE,
    (_match, attributeName: string, value: string) =>
      `<span class="tok-attr">${attributeName}</span>=<span class="tok-str">${value}</span>`,
  );

  return `${escapeText(opening)}${wrap("tok-tag", name)}${coloredAttributes}${escapeText(closing)}`;
}

function highlightHtml(code: string): string {
  let result = "";
  let cursor = 0;

  for (const match of code.matchAll(HTML_PIECES)) {
    const piece = match[0];
    result += escapeText(code.slice(cursor, match.index));
    result += piece.startsWith("<!--") ? wrap("tok-com", piece) : highlightHtmlTag(piece);
    cursor = match.index + piece.length;
  }

  return result + escapeText(code.slice(cursor));
}

function highlightScript(code: string): string {
  let result = "";
  let cursor = 0;

  for (const match of code.matchAll(SCRIPT_PIECES)) {
    const [piece, comment, text] = match;
    const className = comment ? "tok-com" : text ? "tok-str" : "tok-kw";
    result += escapeText(code.slice(cursor, match.index)) + wrap(className, piece);
    cursor = match.index + piece.length;
  }

  return result + escapeText(code.slice(cursor));
}

function highlight(code: string, language: string): string {
  if (language === "html") return highlightHtml(code);
  if (language === "bash" || language === "text") return escapeText(code);
  return highlightScript(code);
}

async function copyCode(button: HTMLButtonElement): Promise<void> {
  const code = button.parentElement?.querySelector("code")?.textContent ?? "";

  try {
    await navigator.clipboard.writeText(code);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Clipboard blocked by the browser";
  }

  setTimeout(() => (button.textContent = "Copy"), COPY_LABEL_RESET_MS);
}

export function initCodeBlocks(): void {
  for (const block of document.querySelectorAll<HTMLElement>(".docs-code")) {
    const code = block.querySelector("code");
    if (code) code.innerHTML = highlight(code.textContent ?? "", block.dataset.language ?? "text");
  }

  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest(".docs-copy") : null;
    if (button instanceof HTMLButtonElement) void copyCode(button);
  });
}
