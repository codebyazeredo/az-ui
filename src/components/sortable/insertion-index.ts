export type SortableDirection = "vertical" | "horizontal" | "grid";

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

function isBeforeInGrid(box: Box, point: Point): boolean {
  if (box.top + box.height < point.y) return true;
  if (box.top > point.y) return false;

  return box.left + box.width / 2 < point.x;
}

export function insertionIndex(
  boxes: readonly Box[],
  point: Point,
  direction: SortableDirection,
): number {
  if (direction === "grid") return boxes.filter((box) => isBeforeInGrid(box, point)).length;

  const pointer = direction === "vertical" ? point.y : point.x;

  return boxes.filter((box) => {
    const midpoint = direction === "vertical" ? box.top + box.height / 2 : box.left + box.width / 2;
    return midpoint < pointer;
  }).length;
}
