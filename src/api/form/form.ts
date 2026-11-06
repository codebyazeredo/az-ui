import { markupToElement } from "../../javascript/dom/markup-to-element";
import { renderField } from "./render";
import type {
  CheckboxDefinition,
  FieldOptions,
  FormFieldDefinition,
  GroupDefinition,
  InputDefinition,
  RadioDefinition,
  SelectDefinition,
  SwitchDefinition,
  TextareaDefinition,
} from "./types";

function createField(definition: FormFieldDefinition): HTMLElement {
  return markupToElement(renderField(definition));
}

export const Form = {
  render: renderField,
  input: (definition: InputDefinition) => createField(definition),
  text: (options: FieldOptions<InputDefinition>) => createField({ ...options, type: "text" }),
  email: (options: FieldOptions<InputDefinition>) => createField({ ...options, type: "email" }),
  password: (options: FieldOptions<InputDefinition>) =>
    createField({ ...options, type: "password" }),
  number: (options: FieldOptions<InputDefinition>) => createField({ ...options, type: "number" }),
  date: (options: FieldOptions<InputDefinition>) => createField({ ...options, type: "date" }),
  textarea: (options: FieldOptions<TextareaDefinition>) =>
    createField({ ...options, type: "textarea" }),
  select: (options: FieldOptions<SelectDefinition>) => createField({ ...options, type: "select" }),
  checkbox: (options: FieldOptions<CheckboxDefinition>) =>
    createField({ ...options, type: "checkbox" }),
  radio: (options: FieldOptions<RadioDefinition>) => createField({ ...options, type: "radio" }),
  switch: (options: FieldOptions<SwitchDefinition>) => createField({ ...options, type: "switch" }),
  group: (options: FieldOptions<GroupDefinition>) => createField({ ...options, type: "group" }),
} as const;
