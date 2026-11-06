import { baseControlAttributes, renderFieldFrame, resolveFieldId } from "./field-frame";
import { escapeHtml, renderAttributes } from "./html";
import type {
  ControlFieldOptions,
  ControlSize,
  FileDefinition,
  MultiSelectDefinition,
  RangeDefinition,
  SelectOption,
} from "./types";

const CONTROL_SIZE_CLASSES: Record<ControlSize, string> = {
  sm: " az-control-sm",
  md: "",
  lg: " az-control-lg",
};

function controlClass(options: ControlFieldOptions, extraClass: string): string {
  return `az-control${extraClass}${CONTROL_SIZE_CLASSES[options.size ?? "md"]}`;
}

function renderOption(option: SelectOption, selectedValues: string[]): string {
  const attributes = renderAttributes({
    value: option.value,
    selected: selectedValues.includes(option.value),
    disabled: option.disabled,
  });

  return `<option${attributes}>${escapeHtml(option.label)}</option>`;
}

export function renderMultiSelect(definition: MultiSelectDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, controlClass(definition, " az-multiselect")),
    multiple: true,
    "data-az-component": "select",
  });
  const options = definition.options
    .map((option) => renderOption(option, definition.value ?? []))
    .join("");

  return renderFieldFrame({
    ...definition,
    id,
    control: `<select${attributes}>${options}</select>`,
  });
}

export function renderFile(definition: FileDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, controlClass(definition, " az-file")),
    type: "file",
    accept: definition.accept,
    multiple: definition.multiple,
    "data-az-component": "fileupload",
    "data-az-max-size": definition.maxSize,
    "data-az-max-files": definition.maxFiles,
  });

  return renderFieldFrame({ ...definition, id, control: `<input${attributes}>` });
}

export function renderRange(definition: RangeDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, "az-range"),
    type: "range",
    min: definition.min,
    max: definition.max,
    step: definition.step,
    value: definition.value,
  });

  return renderFieldFrame({ ...definition, id, control: `<input${attributes}>` });
}
