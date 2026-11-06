import { Overlay } from "../../javascript/core/overlay";
import type { OverlayOptions } from "../../javascript/core/overlay";

export type OffcanvasOptions = OverlayOptions;

export class Offcanvas extends Overlay {
  constructor(target: string | HTMLElement, options: Partial<OffcanvasOptions> = {}) {
    super("offcanvas", target, ".az-offcanvas-panel", options);
  }
}
