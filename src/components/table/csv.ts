export type CsvRows = "all" | "visible" | "selected";

export interface CsvOptions {
  delimiter?: string;
  rows?: CsvRows;
  header?: boolean;
  sanitize?: boolean;
  bom?: boolean;
}

const UTF8_BOM = "﻿";
const LINE_BREAK = "\r\n";
const EXCLUDED_COLUMN_CLASSES = ["az-table-select", "az-table-actions", "az-table-handle"];

function cellText(cell: HTMLTableCellElement): string {
  const override = cell.dataset.azExport;
  if (override !== undefined) return override;

  return (cell.textContent ?? "").replace(/\s+/g, " ").trim();
}

function isNumber(text: string): boolean {
  return text.trim() !== "" && Number.isFinite(Number(text));
}

function neutralizeFormula(text: string): string {
  return /^[=+\-@\t\r]/.test(text) && !isNumber(text) ? `'${text}` : text;
}

function quote(text: string, delimiter: string): string {
  const needsQuotes = text.includes(delimiter) || /["\r\n]/.test(text);

  return needsQuotes ? `"${text.replace(/"/g, '""')}"` : text;
}

function includedColumns(table: HTMLTableElement): number[] {
  const reference = table.tHead?.rows[0] ?? table.tBodies[0]?.rows[0];
  if (!reference) return [];

  return [...reference.cells]
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => !cell.hidden)
    .filter(({ cell }) => !EXCLUDED_COLUMN_CLASSES.some((name) => cell.classList.contains(name)))
    .map(({ index }) => index);
}

function selectRows(table: HTMLTableElement, rows: CsvRows): HTMLTableRowElement[] {
  const bodyRows = [...table.tBodies].flatMap((body) => [...body.rows]);
  if (rows === "visible") return bodyRows.filter((row) => !row.hidden);
  if (rows === "selected") {
    return bodyRows.filter((row) => row.getAttribute("aria-selected") === "true");
  }

  return bodyRows;
}

export function tableToCsv(table: HTMLTableElement, options: CsvOptions = {}): string {
  const { delimiter = ",", rows = "all", header = true, sanitize = true } = options;
  const columns = includedColumns(table);

  const toLine = (row: HTMLTableRowElement): string =>
    columns
      .map((column) => {
        const cell = row.cells[column];
        const text = cell ? cellText(cell) : "";

        return quote(sanitize ? neutralizeFormula(text) : text, delimiter);
      })
      .join(delimiter);

  const headerRow = header ? table.tHead?.rows[0] : undefined;
  const lines = [...(headerRow ? [headerRow] : []), ...selectRows(table, rows)].map(toLine);

  return lines.join(LINE_BREAK);
}

export function downloadCsv(
  table: HTMLTableElement,
  filename: string,
  options: CsvOptions = {},
): void {
  const csv = tableToCsv(table, options);
  const content = (options.bom ?? true) ? UTF8_BOM + csv : csv;
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
