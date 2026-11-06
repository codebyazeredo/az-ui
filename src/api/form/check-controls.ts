import { baseControlAttributes, renderFieldFrame, resolveFieldId } from "./field-frame";
import { escapeHtml, renderAttributes } from "./html";
import type { CheckableDefinition } from "./types";

const CHECKABLE_MARKUP = {
  checkbox: { htmlType: "checkbox", block: "az-check", role: undefined },
  radio: { htmlType: "radio", block: "az-check", role: undefined },
  switch: { htmlType: "checkbox", block: "az-switch", role: "switch" },
} as const;

export function renderCheckable(definition: CheckableDefinition): string {
  const { htmlType, block, role } = CHECKABLE_MARKUP[definition.type];
  const id = resolveFieldId(definition, definition.value);
  const attributes = renderAttributes({
    ...baseControlAttributes(definition, id, `${block}-input`),
    type: htmlType,
    role,
    value: definition.value,
    checked: definition.checked,
  });
  const size = definition.size && definition.size !== "md" ? ` ${block}-${definition.size}` : "";
  const label = definition.label
    ? `<label class="${block}-label" for="${escapeHtml(id)}">${escapeHtml(definition.label)}</label>`
    : "";

  return renderFieldFrame({
    ...definition,
    id,
    label: undefined,
    control: `<div class="${block}${size}"><input${attributes}>${label}</div>`,
  });
}
