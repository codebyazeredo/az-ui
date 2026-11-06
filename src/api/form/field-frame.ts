import { classNames, escapeHtml } from "./html";
import type { AttributeValue, FormFieldOptions } from "./types";

interface FieldFrame {
  id: string;
  control: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
}

export function resolveFieldId(
  options: Pick<FormFieldOptions, "id" | "name">,
  discriminator = "",
): string {
  if (options.id) return options.id;
  if (!options.name) throw new Error('AZUI.Form: "name" is required when "id" is not provided.');

  return `az-${[options.name, discriminator].filter(Boolean).join("-")}`
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+$/, "");
}

function describedBy(
  id: string,
  options: Pick<FormFieldOptions, "helpText" | "error">,
): string | undefined {
  const ids = [options.helpText && `${id}-help`, options.error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function baseControlAttributes(
  options: FormFieldOptions,
  id: string,
  className: string,
): Record<string, AttributeValue | undefined> {
  return {
    ...options.attributes,
    class: classNames(className, options.className),
    id,
    name: options.name,
    required: options.required,
    disabled: options.disabled,
    "aria-invalid": options.error ? "true" : undefined,
    "aria-describedby": describedBy(id, options),
  };
}

export function renderFieldFrame(frame: FieldFrame): string {
  const label = frame.label
    ? `<label class="${classNames("az-field-label", frame.required ? "az-field-label-required" : undefined)}" for="${escapeHtml(frame.id)}">${escapeHtml(frame.label)}</label>`
    : "";
  const help = frame.helpText
    ? `<p class="az-field-help" id="${escapeHtml(frame.id)}-help">${escapeHtml(frame.helpText)}</p>`
    : "";
  const error = frame.error
    ? `<p class="az-field-error" id="${escapeHtml(frame.id)}-error">${escapeHtml(frame.error)}</p>`
    : "";

  return `<div class="az-field">${label}${frame.control}${help}${error}</div>`;
}
