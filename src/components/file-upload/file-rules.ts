const SIZE_UNITS = ["B", "KB", "MB", "GB"];
const BYTES_PER_UNIT = 1024;
const MAX_BADGE_LENGTH = 4;

export function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

export function formatSize(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= BYTES_PER_UNIT && unit < SIZE_UNITS.length - 1) {
    value /= BYTES_PER_UNIT;
    unit += 1;
  }

  return `${unit === 0 ? value : value.toFixed(1).replace(/\.0$/, "")} ${SIZE_UNITS[unit]}`;
}

export function fileExtension(name: string): string {
  const extension = name.includes(".") ? (name.split(".").pop() ?? "") : "";

  return extension && extension.length <= MAX_BADGE_LENGTH ? extension.toUpperCase() : "FILE";
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
