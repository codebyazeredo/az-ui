export type ControlSize = "sm" | "md" | "lg";

export type InputType = "text" | "email" | "password" | "number" | "date";

export type AttributeValue = string | number | boolean;

export interface FormFieldOptions {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
  id?: string;
  attributes?: Record<string, AttributeValue>;
}

export interface ControlFieldOptions extends FormFieldOptions {
  placeholder?: string;
  readonly?: boolean;
  size?: ControlSize;
}

export interface InputDefinition extends ControlFieldOptions {
  type: InputType;
  value?: string | number;
}

export interface TextareaDefinition extends ControlFieldOptions {
  type: "textarea";
  value?: string;
  rows?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectDefinition extends Omit<ControlFieldOptions, "readonly"> {
  type: "select";
  options: SelectOption[];
  value?: string;
}

export interface CheckableFieldOptions extends FormFieldOptions {
  checked?: boolean;
  size?: ControlSize;
}

export interface CheckboxDefinition extends CheckableFieldOptions {
  type: "checkbox";
  value?: string;
}

export interface RadioDefinition extends CheckableFieldOptions {
  type: "radio";
  value: string;
}

export interface SwitchDefinition extends CheckableFieldOptions {
  type: "switch";
  value?: string;
}

export type CheckableDefinition = CheckboxDefinition | RadioDefinition | SwitchDefinition;

export interface GroupDefinition {
  type: "group";
  label: string;
  fields: FormFieldDefinition[];
  id?: string;
  className?: string;
}

export type FormFieldDefinition =
  InputDefinition | TextareaDefinition | SelectDefinition | CheckableDefinition | GroupDefinition;

export type FieldOptions<Definition extends { type: string }> = Omit<Definition, "type">;
