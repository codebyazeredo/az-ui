import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const SOURCE_DIR = "docs";
const OUTPUT_DIR = "site/docs";
const SITE_TITLE = "AZ UI";

const HEAD_THEME_SCRIPT = `(function(){var t=localStorage.getItem("az-docs-theme");document.documentElement.dataset.azTheme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")})()`;

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const rewriteLink = (href) => href.replace(/\.md(#.*)?$/, ".html$1");

function renderInline(text) {
  const codeSpans = [];
  const withPlaceholders = text.replace(/`([^`]+)`/g, (_match, code) => {
    codeSpans.push(`<code>${escapeHtml(code.replace(/\\\|/g, "|"))}</code>`);
    return `\\uE000${codeSpans.length - 1}\\uE000`;
  });

  return escapeHtml(withPlaceholders)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      return `<a href="${rewriteLink(href)}">${label}</a>`;
    })
    .replace(/\\\|/g, "|")
    .replace(/\\uE000(\d+)\\uE000/g, (_match, index) => codeSpans[Number(index)]);
}

function renderCodeBlock(language, mode, code) {
  const escaped = escapeHtml(code);
  const codeBlock = `<div class="docs-code" data-language="${language || "text"}"><button class="az-btn az-btn-ghost az-btn-sm docs-copy" type="button">Copy</button><pre><code>${escaped}</code></pre></div>`;
  if (language !== "html" || mode === "source") return codeBlock;
  if (mode === "preview") {
    return `<figure class="docs-example"><div class="docs-example-preview">${code}</div></figure>`;
  }
  return `<figure class="docs-example"><div class="docs-example-preview">${code}</div>${codeBlock}</figure>`;
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim());
}

function renderTable(rows) {
  const [header, , ...body] = rows.map(splitTableRow);
  const head = header.map((cell) => `<th scope="col">${renderInline(cell)}</th>`).join("");
  const bodyRows = body
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="docs-table az-table-wrap"><table class="az-table"><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
}

function renderList(lines, ordered) {
  const tag = ordered ? "ol" : "ul";
  const items = [];
  for (const line of lines) {
    const itemStart = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/);
    if (itemStart) items.push(itemStart[1]);
    else items[items.length - 1] += ` ${line.trim()}`;
  }
  return `<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`;
}

const isBlockStart = (line) =>
  /^(#{1,4}\s|```|\||>|\s*[-*]\s|\s*\d+\.\s)/.test(line) || line.trim() === "";

function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let title = "";
  let description = "";
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fence = line.match(/^```(\w*)\s*(\w*)/);
    if (fence) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(renderCodeBlock(fence[1] ?? "", fence[2] ?? "", codeLines.join("\n")));
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      if (level === 1) title = text;
      const id = slugify(text);
      const anchor =
        level > 1
          ? ` <a class="docs-anchor" href="#${id}" aria-label="Link to this section">#</a>`
          : "";
      html.push(`<h${level} id="${id}">${renderInline(text)}${anchor}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("|")) {
        rows.push(lines[index]);
        index += 1;
      }
      html.push(renderTable(rows));
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines = [];
      while (index < lines.length && (lines[index] ?? "").startsWith(">")) {
        quoteLines.push((lines[index] ?? "").replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(
        `<aside class="az-alert az-alert-info docs-callout" role="note"><p>${renderInline(quoteLines.join(" "))}</p></aside>`,
      );
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-*])|(\d+\.))\s+/);
    if (listMatch) {
      const listLines = [];
      while (index < lines.length) {
        const current = lines[index] ?? "";
        const continuesItem = /^\s+\S/.test(current) && !/^\s*(?:[-*]|\d+\.)\s/.test(current);
        if (!/^\s*(?:[-*]|\d+\.)\s/.test(current) && !continuesItem) break;
        listLines.push(current);
        index += 1;
      }
      html.push(renderList(listLines, Boolean(listMatch[2])));
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && !isBlockStart(lines[index] ?? "")) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    const paragraph = paragraphLines.join(" ");
    if (!description) description = paragraph.replace(/[`*[\]]/g, "").replace(/\([^)]*\)/g, "");
    html.push(`<p>${renderInline(paragraph)}</p>`);
  }

  return { title, description, html: html.join("\n") };
}

function renderPage({ title, description, html }, outputPath) {
  const content = `<main id="docs-content" data-docs-path="docs/${outputPath}"><article class="docs-article">\n${html}\n</article></main>`;
  return `<!doctype html>
<html lang="en" data-az-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} — ${SITE_TITLE}</title>
    <meta name="description" content="${escapeHtml(description.slice(0, 200))}" />
    <script>${HEAD_THEME_SCRIPT}</script>
    <script type="module" src="/assets/docs.ts"></script>
  </head>
  <body class="az-body">
    ${content}
  </body>
</html>
`;
}

function listMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

rmSync(OUTPUT_DIR, { recursive: true, force: true });

for (const sourcePath of listMarkdownFiles(SOURCE_DIR)) {
  const relativePath = relative(SOURCE_DIR, sourcePath).replace(/\\/g, "/");
  const outputPath = relativePath.replace(/\.md$/, ".html");
  const page = renderMarkdown(readFileSync(sourcePath, "utf8"));
  const target = join(OUTPUT_DIR, outputPath);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderPage(page, outputPath));
}

console.log(`Generated ${OUTPUT_DIR}`);
