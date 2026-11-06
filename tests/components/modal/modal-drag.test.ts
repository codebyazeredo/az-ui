import { afterEach, describe, expect, it } from "vitest";
import { Modal } from "../../../src/components/modal";

const MODAL_HTML = `
  <div class="az-modal" id="modal" hidden>
    <div class="az-modal-dialog">
      <div class="az-modal-header">
        <h2 class="az-modal-title">Title</h2>
        <button class="az-btn" id="close" data-az-dismiss>Close</button>
      </div>
      <div class="az-modal-body">Body</div>
    </div>
  </div>`;

let modal: Modal | null = null;

function setup(options: { draggable?: boolean } = {}) {
  document.body.innerHTML = MODAL_HTML;
  modal = new Modal("#modal", options);
  return {
    dialog: document.querySelector<HTMLElement>(".az-modal-dialog")!,
    header: document.querySelector<HTMLElement>(".az-modal-header")!,
  };
}

const pointer = (type: string, target: Element, x: number, y: number) =>
  target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));

afterEach(() => {
  modal?.destroy();
  modal = null;
  document.body.innerHTML = "";
});

describe("draggable modal", () => {
  it("moves the dialog with the header", () => {
    const { dialog, header } = setup();
    modal?.show();

    pointer("pointerdown", header, 100, 100);
    pointer("pointermove", header, 150, 130);

    expect(dialog.dataset.azDraggable).toBe("");
    expect(dialog.style.transform).toBe("translate(50px, 30px)");
  });

  it("stops moving after the pointer is released", () => {
    const { dialog, header } = setup();
    modal?.show();

    pointer("pointerdown", header, 100, 100);
    pointer("pointermove", header, 120, 100);
    pointer("pointerup", header, 120, 100);
    pointer("pointermove", header, 300, 300);

    expect(dialog.style.transform).toBe("translate(20px, 0px)");
  });

  it("does not start dragging from buttons in the header", () => {
    const { dialog } = setup();
    modal?.show();
    const closeButton = document.getElementById("close")!;

    pointer("pointerdown", closeButton, 100, 100);
    pointer("pointermove", closeButton, 150, 150);

    expect(dialog.style.transform).toBe("");
  });

  it("returns to the center when opened again", () => {
    const { dialog, header } = setup();
    modal?.show();
    pointer("pointerdown", header, 100, 100);
    pointer("pointermove", header, 150, 130);
    pointer("pointerup", header, 150, 130);

    modal?.hide();
    modal?.show();

    expect(dialog.style.transform).toBe("");
  });

  it("can be turned off", () => {
    const { dialog, header } = setup({ draggable: false });
    modal?.show();

    pointer("pointerdown", header, 100, 100);
    pointer("pointermove", header, 150, 130);

    expect(dialog.dataset.azDraggable).toBeUndefined();
    expect(dialog.style.transform).toBe("");
  });
});
