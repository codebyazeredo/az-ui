let counter = 0;

export function uniqueId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function ensureId(element: HTMLElement, prefix: string): string {
  if (!element.id) element.id = uniqueId(prefix);
  return element.id;
}
