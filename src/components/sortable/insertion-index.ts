export type SortableDirection = "vertical" | "horizontal";

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

export function insertionIndex(
  boxes: readonly Box[],
  point: Point,
  direction: SortableDirection,
): number {
  const pointer = direction === "vertical" ? point.y : point.x;

  return boxes.filter((box) => {
    const midpoint =
      direction === "vertical" ? box.top + box.height / 2 : box.left + box.width / 2;
    return midpoint < pointer;
  }).length;
}
