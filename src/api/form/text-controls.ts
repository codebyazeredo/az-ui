import {
  baseControlAttributes,
  renderCounter,
  renderFieldFrame,
  resolveFieldId,
} from "./field-frame";
import { escapeHtml, renderAttributes } from "./html";
import type {
  ControlFieldOptions,
  ControlSize,
  InputDefinition,
  SelectDefinition,
  SelectOption,
  TextareaDefinition,
} from "./types";

const CONTROL_SIZE_CLASSES: Record<ControlSize, string> = {
  sm: " az-control-sm",
  md: "",
  lg: " az-control-lg",
};

function controlClass(options: ControlFieldOptions, extraClass = ""): string {
  return `az-control${extraClass}${CONTROL_SIZE_CLASSES[options.size ?? "md"]}`;
}

export function renderInput(definition: InputDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, controlClass(definition)),
    type: definition.type,
    value: definition.value,
    placeholder: definition.placeholder,
    readonly: definition.readonly,
  });

  return renderFieldFrame({
    ...definition,
    id,
    control: renderInputGroup(definition, `<input${attributes}>`),
    counter: renderCounter(definition, id, String(definition.value ?? "").length),
  });
}

function renderInputGroup(definition: InputDefinition, input: string): string {
  if (!definition.prefix && !definition.suffix) return input;

  const addon = (text?: string): string =>
    text ? `<span class="az-input-group-text">${escapeHtml(text)}</span>` : "";

  return `<div class="az-input-group">${addon(definition.prefix)}${input}${addon(definition.suffix)}</div>`;
}

export function renderTextarea(definition: TextareaDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, controlClass(definition, " az-textarea")),
    placeholder: definition.placeholder,
    readonly: definition.readonly,
    rows: definition.rows,
  });
  const content = escapeHtml(definition.value ?? "");

  // The parser drops the first newline after <textarea>, so one is added to keep the value intact.
  return renderFieldFrame({
    ...definition,
    id,
    control: `<textarea${attributes}>\n${content}</textarea>`,
    counter: renderCounter(definition, id, (definition.value ?? "").length),
  });
}

function renderOption(option: SelectOption, selectedValue: string | undefined): string {
  const attributes = renderAttributes({
    value: option.value,
    selected: option.value === selectedValue,
    disabled: option.disabled,
  });

  return `<option${attributes}>${escapeHtml(option.label)}</option>`;
}

export function renderSelect(definition: SelectDefinition): string {
  const id = resolveFieldId(definition);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, controlClass(definition, " az-select")),
    "data-az-component": "select",
  });
  const placeholder = definition.placeholder
    ? `<option value=""${definition.value === undefined ? " selected" : ""} disabled>${escapeHtml(definition.placeholder)}</option>`
    : "";
  const options = definition.options
    .map((option) => renderOption(option, definition.value))
    .join("");

  return renderFieldFrame({
    ...definition,
    id,
    control: `<select${attributes}>${placeholder}${options}</select>`,
  });
}
