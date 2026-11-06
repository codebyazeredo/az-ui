export type SortDirection = "ascending" | "descending";
export type SortType = "text" | "number";

function cellValue(row: HTMLTableRowElement, column: number): string {
  const cell = row.cells[column];
  return cell?.dataset.azSortValue ?? cell?.textContent?.trim() ?? "";
}

function compareValues(first: string, second: string, type: SortType): number {
  if (type === "number") {
    const [firstNumber, secondNumber] = [Number.parseFloat(first), Number.parseFloat(second)];
    if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
      return Number(Number.isNaN(firstNumber)) - Number(Number.isNaN(secondNumber));
    }

    return firstNumber - secondNumber;
  }

  return first.localeCompare(second, undefined, { numeric: true, sensitivity: "base" });
}

export function sortRows(
  rows: HTMLTableRowElement[],
  column: number,
  direction: SortDirection,
  type: SortType,
): HTMLTableRowElement[] {
  const factor = direction === "ascending" ? 1 : -1;

  return [...rows].sort(
    (first, second) =>
      factor * compareValues(cellValue(first, column), cellValue(second, column), type),
  );
}
