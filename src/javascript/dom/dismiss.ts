export function onDismiss(inside: HTMLElement[], close: () => void): () => void {
  const handlePointerDown = (event: PointerEvent): void => {
    const target = event.target;
    if (target instanceof Node && inside.some((element) => element.contains(target))) return;
    close();
  };
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") close();
  };

  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("keydown", handleKeyDown);
  };
}
