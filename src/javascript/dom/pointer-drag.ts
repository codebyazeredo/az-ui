export interface PointerDragCallbacks {
  move: (dx: number, dy: number, event: PointerEvent) => void;
  end: (dx: number, dy: number, event: PointerEvent) => void;
  cancel: () => void;
}

export function startPointerDrag(
  handle: HTMLElement,
  event: PointerEvent,
  callbacks: PointerDragCallbacks,
): () => void {
  event.preventDefault();
  handle.setPointerCapture(event.pointerId);

  const startX = event.clientX;
  const startY = event.clientY;

  const stop = (): void => {
    handle.removeEventListener("pointermove", onMove);
    handle.removeEventListener("pointerup", onUp);
    handle.removeEventListener("pointercancel", onCancel);
    document.removeEventListener("keydown", onKey);
  };
  const onMove = (move: PointerEvent): void => {
    callbacks.move(move.clientX - startX, move.clientY - startY, move);
  };
  const onUp = (up: PointerEvent): void => {
    stop();
    callbacks.end(up.clientX - startX, up.clientY - startY, up);
  };
  const onCancel = (): void => {
    stop();
    callbacks.cancel();
  };
  const onKey = (key: KeyboardEvent): void => {
    if (key.key === "Escape") onCancel();
  };

  handle.addEventListener("pointermove", onMove);
  handle.addEventListener("pointerup", onUp);
  handle.addEventListener("pointercancel", onCancel);
  document.addEventListener("keydown", onKey);

  return stop;
}
