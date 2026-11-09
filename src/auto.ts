import { Collapse } from "./components/collapse";
import { CommandMenu } from "./components/command-menu";
import { ContextMenu } from "./components/context-menu";
import { Datepicker } from "./components/datepicker";
import { Dropdown } from "./components/dropdown";
import { Counter } from "./components/field";
import { Modal } from "./components/modal";
import { NotificationPanel } from "./components/notification";
import { Offcanvas } from "./components/offcanvas";
import { Pagination } from "./components/pagination";
import { Popover } from "./components/popover";
import { DataTable } from "./components/table";
import { FileUpload } from "./components/file-upload";
import { Kanban } from "./components/kanban";
import { Sortable } from "./components/sortable";
import { Splitter } from "./components/splitter";
import { Stepper } from "./components/stepper";
import { Tree } from "./components/tree";
import { Select } from "./components/select";
import { Tabs } from "./components/tabs";
import { Tooltip } from "./components/tooltip";
import { Component } from "./javascript/core/component";
import { Overlay } from "./javascript/core/overlay";

const COMPONENT_FACTORIES: Record<string, (element: HTMLElement) => Component> = {
  collapse: (element) => new Collapse(element),
  "command-menu": (element) => new CommandMenu(element),
  "context-menu": (element) => new ContextMenu(element),
  counter: (element) => new Counter(element),
  datatable: (element) => new DataTable(element),
  datepicker: (element) => new Datepicker(element),
  dropdown: (element) => new Dropdown(element),
  kanban: (element) => new Kanban(element),
  notification: (element) => new NotificationPanel(element),
  pagination: (element) => new Pagination(element),
  popover: (element) => new Popover(element),
  fileupload: (element) => new FileUpload(element),
  select: (element) => new Select(element),
  sortable: (element) =>
    new Sortable(element, {
      group: element.dataset.azGroup,
      handle: element.dataset.azHandle,
    }),
  splitter: (element) => new Splitter(element),
  stepper: (element) => new Stepper(element),
  tabs: (element) => new Tabs(element),
  tree: (element) => new Tree(element),
  tooltip: (element) => new Tooltip(element),
};

const OVERLAY_FACTORIES: Record<string, (element: HTMLElement) => Overlay> = {
  "command-menu": (element) => new CommandMenu(element),
  modal: (element) => new Modal(element),
  offcanvas: (element) => new Offcanvas(element),
};

export function initComponents(root: ParentNode = document): void {
  for (const element of root.querySelectorAll<HTMLElement>("[data-az-component]")) {
    const name = element.dataset.azComponent ?? "";
    const create = COMPONENT_FACTORIES[name];
    if (create && !Component.find(name, element)) create(element);
  }
}

function toggleCollapse(target: HTMLElement): void {
  const existing = Component.find("collapse", target);
  const collapse = existing instanceof Collapse ? existing : new Collapse(target);
  collapse.toggle();
}

function toggleOverlay(trigger: HTMLElement): void {
  const kind = trigger.dataset.azToggle ?? "";
  const selector = trigger.dataset.azTarget;
  const target = selector ? document.querySelector<HTMLElement>(selector) : null;
  if (!target) return;

  if (kind === "collapse") {
    toggleCollapse(target);
    return;
  }

  const create = OVERLAY_FACTORIES[kind];
  if (!create) return;

  const existing = Component.find(kind, target);
  const overlay = existing instanceof Overlay ? existing : create(target);
  overlay.toggle();
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest<HTMLElement>("[data-az-toggle]");
  if (trigger) toggleOverlay(trigger);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initComponents());
} else {
  initComponents();
}
