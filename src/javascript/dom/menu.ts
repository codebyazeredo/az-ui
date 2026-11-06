export const MENU_ITEM_SELECTOR = '.az-dropdown-item:not(:disabled):not([aria-disabled="true"])';

export function getMenuItems(menu: HTMLElement): HTMLElement[] {
  return [...menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)];
}

export function focusMenuItem(items: HTMLElement[], position: "first" | "last" | number): void {
  const index = position === "first" ? 0 : position === "last" ? items.length - 1 : position;
  items[index]?.focus();
}

export function handleMenuNavigation(event: KeyboardEvent, items: HTMLElement[]): boolean {
  const current = items.findIndex((item) => item === document.activeElement);
  const targets: Record<string, "first" | "last" | number> = {
    ArrowDown: (current + 1) % items.length,
    ArrowUp: (current - 1 + items.length) % items.length,
    Home: "first",
    End: "last",
  };
  const target = targets[event.key];
  if (target === undefined) return false;

  event.preventDefault();
  focusMenuItem(items, target);

  return true;
}
