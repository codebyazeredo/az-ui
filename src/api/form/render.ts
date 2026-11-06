import { renderFile, renderMultiSelect, renderRange } from "./advanced-controls";
import { renderCheckable } from "./check-controls";
import { escapeHtml, renderAttributes } from "./html";
import { renderInput, renderSelect, renderTextarea } from "./text-controls";
import type { FormFieldDefinition, GroupDefinition } from "./types";

function renderGroup(definition: GroupDefinition): string {
  const attributes = renderAttributes({
    class: definition.className ? `az-fieldset ${definition.className}` : "az-fieldset",
    id: definition.id,
  });
  const legend = `<legend class="az-fieldset-legend">${escapeHtml(definition.label)}</legend>`;

  return `<fieldset${attributes}>${legend}${definition.fields.map(renderField).join("")}</fieldset>`;
}

export function renderField(definition: FormFieldDefinition): string {
  switch (definition.type) {
    case "text":
    case "email":
    case "password":
    case "number":
    case "date":
      return renderInput(definition);
    case "textarea":
      return renderTextarea(definition);
    case "select":
      return renderSelect(definition);
    case "multiselect":
      return renderMultiSelect(definition);
    case "file":
      return renderFile(definition);
    case "range":
      return renderRange(definition);
    case "checkbox":
    case "radio":
    case "switch":
      return renderCheckable(definition);
    case "group":
      return renderGroup(definition);
    default:
      throw new Error(
        `AZUI.Form: unknown field type "${String(Reflect.get(definition, "type"))}".`,
      );
  }
}
