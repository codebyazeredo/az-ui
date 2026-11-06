export function resolveElement(target: string | HTMLElement): HTMLElement {
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!element) throw new Error(`AZUI: no element found for selector "${String(target)}".`);

  return element;
}
