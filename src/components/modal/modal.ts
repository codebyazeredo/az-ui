import { Overlay } from "../../javascript/core/overlay";
import type { OverlayOptions } from "../../javascript/core/overlay";

export type ModalOptions = OverlayOptions;

export class Modal extends Overlay {
  constructor(target: string | HTMLElement, options: Partial<ModalOptions> = {}) {
    super("modal", target, ".az-modal-dialog", options);
  }
}
