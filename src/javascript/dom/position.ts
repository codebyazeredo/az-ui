export type Placement = "top" | "bottom" | "left" | "right";

export function isPlacement(value: string | undefined): value is Placement {
  return value === "top" || value === "bottom" || value === "left" || value === "right";
}

const OPPOSITE: Record<Placement, Placement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export function positionFloating(
  floating: HTMLElement,
  anchor: HTMLElement,
  placement: Placement,
  offset = 8,
): Placement {
  const anchorRect = anchor.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const fits: Record<Placement, boolean> = {
    top: anchorRect.top - offset - floatingRect.height >= 0,
    bottom: anchorRect.bottom + offset + floatingRect.height <= viewportHeight,
    left: anchorRect.left - offset - floatingRect.width >= 0,
    right: anchorRect.right + offset + floatingRect.width <= viewportWidth,
  };
  const resolved = !fits[placement] && fits[OPPOSITE[placement]] ? OPPOSITE[placement] : placement;

  const centeredLeft = anchorRect.left + (anchorRect.width - floatingRect.width) / 2;
  const centeredTop = anchorRect.top + (anchorRect.height - floatingRect.height) / 2;
  const coordinates: Record<Placement, { left: number; top: number }> = {
    top: { left: centeredLeft, top: anchorRect.top - floatingRect.height - offset },
    bottom: { left: centeredLeft, top: anchorRect.bottom + offset },
    left: { left: anchorRect.left - floatingRect.width - offset, top: centeredTop },
    right: { left: anchorRect.right + offset, top: centeredTop },
  };
  const { left, top } = coordinates[resolved];
  const maxLeft = Math.max(offset, viewportWidth - floatingRect.width - offset);

  floating.style.left = `${Math.min(Math.max(left, offset), maxLeft)}px`;
  floating.style.top = `${Math.max(top, offset)}px`;
  floating.dataset.azPlacement = resolved;

  return resolved;
}

export function positionAtPoint(floating: HTMLElement, x: number, y: number, margin = 8): void {
  const { width, height } = floating.getBoundingClientRect();
  const maxLeft = Math.max(margin, document.documentElement.clientWidth - width - margin);
  const maxTop = Math.max(margin, document.documentElement.clientHeight - height - margin);

  floating.style.left = `${Math.min(Math.max(x, margin), maxLeft)}px`;
  floating.style.top = `${Math.min(Math.max(y, margin), maxTop)}px`;
}
