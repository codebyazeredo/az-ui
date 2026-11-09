import { describe, expect, it } from "vitest";
import * as library from "../../src";
import { readProjectFile } from "../helpers/css";

describe("public exports", () => {
  it("exports AZUI, BREAKPOINTS and the interactive components", () => {
    expect(Object.keys(library).sort()).toEqual([
      "AZUI",
      "BREAKPOINTS",
      "BarcodeInput",
      "Calendar",
      "Collapse",
      "ColumnReorder",
      "Combobox",
      "CommandMenu",
      "ContextMenu",
      "Counter",
      "DataTable",
      "DateRange",
      "Datepicker",
      "Dropdown",
      "DualListbox",
      "FileUpload",
      "Gantt",
      "Kanban",
      "Mask",
      "Modal",
      "NotificationPanel",
      "Offcanvas",
      "Pagination",
      "Popover",
      "RowExpand",
      "Scheduler",
      "Select",
      "Sortable",
      "Splitter",
      "Stepper",
      "TableColumns",
      "TableEdit",
      "Tabs",
      "TagInput",
      "Toast",
      "Tooltip",
      "Tree",
      "TreeGrid",
      "VirtualTable",
      "WidgetGrid",
      "downloadCsv",
      "tableToCsv",
    ]);
  });

  it("exposes the declarative form API under AZUI.Form", () => {
    expect(Object.keys(library.AZUI.Form).sort()).toEqual([
      "checkbox",
      "date",
      "email",
      "file",
      "group",
      "input",
      "multiselect",
      "number",
      "password",
      "radio",
      "range",
      "render",
      "select",
      "switch",
      "text",
      "textarea",
    ]);
  });

  it("defines the official breakpoints", () => {
    expect(library.BREAKPOINTS).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280 });
  });

  it("declares the planned entry points in package.json", () => {
    const { exports: packageExports } = JSON.parse(readProjectFile("package.json")) as {
      exports: Record<string, unknown>;
    };

    expect(Object.keys(packageExports)).toEqual([
      ".",
      "./auto",
      "./styles.css",
      "./fonts/ibm-plex-sans.css",
      "./fonts/source-sans-3.css",
      "./package.json",
    ]);
  });
});
