import { Collapse } from "./components/collapse";
import { Combobox } from "./components/combobox";
import { CommandMenu } from "./components/command-menu";
import { ContextMenu } from "./components/context-menu";
import { DateRange, Datepicker } from "./components/datepicker";
import { Dropdown } from "./components/dropdown";
import { DualListbox } from "./components/dual-listbox";
import { BarcodeInput, Counter, Mask } from "./components/field";
import { Modal } from "./components/modal";
import { NotificationPanel } from "./components/notification";
import { Offcanvas } from "./components/offcanvas";
import { Pagination } from "./components/pagination";
import { Popover } from "./components/popover";
import {
  ColumnReorder,
  DataTable,
  RowExpand,
  TableColumns,
  TableEdit,
  TreeGrid,
  downloadCsv,
  type CsvRows,
} from "./components/table";
import { FileUpload } from "./components/file-upload";
import { Kanban } from "./components/kanban";
import { Sortable } from "./components/sortable";
import { Splitter } from "./components/splitter";
import { Stepper } from "./components/stepper";
import { Tree } from "./components/tree";
import { Select } from "./components/select";
import { Tabs } from "./components/tabs";
import { TagInput } from "./components/tag-input";
import { Tooltip } from "./components/tooltip";
import { Component } from "./javascript/core/component";
import { Overlay } from "./javascript/core/overlay";

const COMPONENT_FACTORIES: Record<string, (element: HTMLElement) => Component> = {
  collapse: (element) => new Collapse(element),
  barcode: (element) => new BarcodeInput(element),
  columnreorder: (element) => new ColumnReorder(element),
  combobox: (element) => new Combobox(element),
  "command-menu": (element) => new CommandMenu(element),
  "context-menu": (element) => new ContextMenu(element),
  counter: (element) => new Counter(element),
  datatable: (element) => new DataTable(element),
  datepicker: (element) => new Datepicker(element),
  daterange: (element) => new DateRange(element, element.dataset.azEnd ?? ""),
  dropdown: (element) => new Dropdown(element),
  duallistbox: (element) => new DualListbox(element),
  kanban: (element) => new Kanban(element),
  mask: (element) => new Mask(element),
  notification: (element) => new NotificationPanel(element),
  pagination: (element) => new Pagination(element),
  popover: (element) => new Popover(element),
  rowexpand: (element) => new RowExpand(element),
  fileupload: (element) => new FileUpload(element),
  select: (element) => new Select(element),
  sortable: (element) =>
    new Sortable(element, {
      group: element.dataset.azGroup,
      handle: element.dataset.azHandle,
      items: element.dataset.azItems,
    }),
  splitter: (element) => new Splitter(element),
  stepper: (element) => new Stepper(element),
  tablecolumns: (element) => new TableColumns(element),
  tableedit: (element) => new TableEdit(element),
  tabs: (element) => new Tabs(element),
  taginput: (element) => new TagInput(element),
  tree: (element) => new Tree(element),
  tooltip: (element) => new Tooltip(element),
  treegrid: (element) => new TreeGrid(element),
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

const CSV_ROWS: CsvRows[] = ["all", "visible", "selected"];

function exportCsv(trigger: HTMLElement): void {
  const selector = trigger.dataset.azExportCsv ?? "";
  const target = selector ? document.querySelector(selector) : null;
  const table = target instanceof HTMLTableElement ? target : target?.querySelector("table");
  if (!table) throw new Error(`AZUI: no table found for data-az-export-csv="${selector}".`);

  const rows = CSV_ROWS.find((value) => value === trigger.dataset.azRows);
  downloadCsv(table, trigger.dataset.azFilename ?? "table.csv", { rows });
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest<HTMLElement>("[data-az-toggle]");
  if (trigger) toggleOverlay(trigger);

  const exportTrigger = event.target.closest<HTMLElement>("[data-az-export-csv]");
  if (exportTrigger) exportCsv(exportTrigger);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initComponents());
} else {
  initComponents();
}
