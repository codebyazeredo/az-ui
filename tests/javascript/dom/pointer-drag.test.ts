import { afterEach, describe, expect, it, vi } from "vitest";
import { startPointerDrag } from "../../../src/javascript/dom/pointer-drag";

function pointer(type: string, clientX: number, clientY: number): PointerEvent {
  return Object.assign(
    new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: true }),
    {
      pointerId: 1,
    },
  ) as unknown as PointerEvent;
}

function setUp(): {
  handle: HTMLElement;
  move: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  stop: () => void;
} {
  document.body.innerHTML = `<div id="handle"></div>`;
  const handle = document.getElementById("handle") as HTMLElement;
  handle.setPointerCapture = vi.fn();
  const move = vi.fn();
  const end = vi.fn();
  const cancel = vi.fn();
  const stop = startPointerDrag(handle, pointer("pointerdown", 100, 50), { move, end, cancel });

  return { handle, move, end, cancel, stop };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("startPointerDrag", () => {
  it("captures the pointer and prevents the default action of the press", () => {
    document.body.innerHTML = `<div id="handle"></div>`;
    const handle = document.getElementById("handle") as HTMLElement;
    handle.setPointerCapture = vi.fn();
    const press = pointer("pointerdown", 0, 0);

    startPointerDrag(handle, press, { move: vi.fn(), end: vi.fn(), cancel: vi.fn() });

    expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
    expect(press.defaultPrevented).toBe(true);
  });

  it("reports the offset from the start on move and end", () => {
    const { handle, move, end } = setUp();

    handle.dispatchEvent(pointer("pointermove", 130, 40));
    handle.dispatchEvent(pointer("pointerup", 160, 70));

    expect(move.mock.calls[0]?.slice(0, 2)).toEqual([30, -10]);
    expect(end.mock.calls[0]?.slice(0, 2)).toEqual([60, 20]);
  });

  it("calls cancel on pointercancel and on Escape", () => {
    const first = setUp();
    first.handle.dispatchEvent(pointer("pointercancel", 0, 0));
    expect(first.cancel).toHaveBeenCalledTimes(1);

    const second = setUp();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(second.cancel).toHaveBeenCalledTimes(1);
    expect(second.end).not.toHaveBeenCalled();
  });

  it("stops listening after the drag ends", () => {
    const { handle, move, end } = setUp();

    handle.dispatchEvent(pointer("pointerup", 110, 50));
    handle.dispatchEvent(pointer("pointermove", 200, 50));
    handle.dispatchEvent(pointer("pointerup", 200, 50));

    expect(move).not.toHaveBeenCalled();
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("the returned function stops the drag without calling the callbacks", () => {
    const { handle, move, end, cancel, stop } = setUp();

    stop();
    handle.dispatchEvent(pointer("pointermove", 150, 50));
    handle.dispatchEvent(pointer("pointerup", 150, 50));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect([move, end, cancel].map((callback) => callback.mock.calls.length)).toEqual([0, 0, 0]);
  });
});
