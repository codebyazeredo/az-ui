import { describe, expect, it } from "vitest";
import { AZUI } from "../../../src";
import type { FormFieldDefinition } from "../../../src";

const { render } = AZUI.Form;

describe("AZUI.Form.render", () => {
  it("renders a labelled input linked to its label", () => {
    const markup = render({ type: "text", name: "username", label: "Username" });

    expect(markup).toContain('<label class="az-field-label" for="az-username">Username</label>');
    expect(markup).toContain('id="az-username"');
    expect(markup).toContain('name="username"');
    expect(markup).toContain('class="az-control"');
  });

  it("marks required fields on the label and the control", () => {
    const markup = render({ type: "email", name: "email", label: "Email", required: true });

    expect(markup).toContain("az-field-label az-field-label-required");
    expect(markup).toMatch(/<input[^>]* required[ >]/);
  });

  it("renders disabled and readonly as distinct attributes", () => {
    const disabled = render({ type: "text", name: "a", disabled: true });
    const readonly = render({ type: "text", name: "a", readonly: true });

    expect(disabled).toMatch(/ disabled[ >]/);
    expect(disabled).not.toContain("readonly");
    expect(readonly).toMatch(/ readonly[ >]/);
    expect(readonly).not.toContain("disabled");
  });

  it("links help text and error to the control for assistive technology", () => {
    const markup = render({
      type: "text",
      name: "code",
      helpText: "Six digits",
      error: "Code is invalid",
    });

    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-describedby="az-code-help az-code-error"');
    expect(markup).toContain('<p class="az-field-help" id="az-code-help">Six digits</p>');
    expect(markup).toContain('<p class="az-field-error" id="az-code-error">Code is invalid</p>');
  });

  it("omits aria attributes when there is no help text or error", () => {
    const markup = render({ type: "text", name: "plain" });

    expect(markup).not.toContain("aria-");
  });

  it("applies size, custom class and extra attributes without overriding name and id", () => {
    const markup = render({
      type: "number",
      name: "quantity",
      size: "sm",
      className: "custom",
      attributes: { min: 1, "data-test": "qty", name: "hijacked", id: "hijacked" },
    });

    expect(markup).toContain('class="az-control az-control-sm custom"');
    expect(markup).toContain('min="1"');
    expect(markup).toContain('data-test="qty"');
    expect(markup).toContain('name="quantity"');
    expect(markup).toContain('id="az-quantity"');
    expect(markup).not.toContain("hijacked");
  });

  it("keeps a numeric zero value", () => {
    expect(render({ type: "number", name: "total", value: 0 })).toContain('value="0"');
  });

  it("uses the provided id and derives a safe id from unusual names", () => {
    expect(render({ type: "text", name: "a", id: "custom-id" })).toContain('id="custom-id"');
    expect(render({ type: "text", name: "user[email]" })).toContain('id="az-user-email"');
  });

  it("renders a textarea preserving a leading newline", () => {
    const markup = render({ type: "textarea", name: "notes", value: "\nfirst", rows: 4 });

    expect(markup).toContain('class="az-control az-textarea"');
    expect(markup).toContain('rows="4"');
    expect(markup).toContain("<textarea");
    expect(markup).toContain(">\n\nfirst</textarea>");
  });

  it("renders select options, selection, disabled options and placeholder", () => {
    const markup = render({
      type: "select",
      name: "country",
      placeholder: "Choose",
      value: "br",
      options: [
        { value: "br", label: "Brazil" },
        { value: "ar", label: "Argentina", disabled: true },
      ],
    });

    expect(markup).toContain('class="az-control az-select"');
    expect(markup).toContain('<option value="" disabled>Choose</option>');
    expect(markup).toContain('<option value="br" selected>Brazil</option>');
    expect(markup).toContain('<option value="ar" disabled>Argentina</option>');
  });

  it("selects the placeholder when the select has no value", () => {
    const markup = render({
      type: "select",
      name: "country",
      placeholder: "Choose",
      options: [{ value: "br", label: "Brazil" }],
    });

    expect(markup).toContain('<option value="" selected disabled>Choose</option>');
  });

  it("renders a checkbox with the label after the input", () => {
    const markup = render({ type: "checkbox", name: "terms", label: "Accept", checked: true });

    expect(markup).toContain('<div class="az-check">');
    expect(markup).toMatch(/<input[^>]*type="checkbox"[^>]* checked/);
    expect(markup).toContain('<label class="az-check-label" for="az-terms">Accept</label>');
  });

  it("gives each radio of the same name a distinct id", () => {
    const first = render({ type: "radio", name: "plan", value: "free", label: "Free" });
    const second = render({ type: "radio", name: "plan", value: "pro", label: "Pro" });

    expect(first).toContain('id="az-plan-free"');
    expect(second).toContain('id="az-plan-pro"');
    expect(first).toContain('type="radio"');
  });

  it("applies size modifiers to checkbox, radio and switch wrappers", () => {
    expect(render({ type: "checkbox", name: "a", size: "sm" })).toContain(
      'class="az-check az-check-sm"',
    );
    expect(render({ type: "radio", name: "a", value: "x", size: "lg" })).toContain(
      'class="az-check az-check-lg"',
    );
    expect(render({ type: "switch", name: "a", size: "lg" })).toContain(
      'class="az-switch az-switch-lg"',
    );
    expect(render({ type: "switch", name: "a", size: "md" })).toContain('class="az-switch"');
  });

  it("renders a switch as a checkbox with the switch role", () => {
    const markup = render({ type: "switch", name: "alerts", label: "Alerts" });

    expect(markup).toContain('<div class="az-switch">');
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('role="switch"');
  });

  it("renders a group as a fieldset with a legend and its fields", () => {
    const markup = render({
      type: "group",
      label: "Account",
      fields: [
        { type: "text", name: "login", label: "Login" },
        { type: "switch", name: "active", label: "Active" },
      ],
    });

    expect(markup.startsWith('<fieldset class="az-fieldset">')).toBe(true);
    expect(markup).toContain('<legend class="az-fieldset-legend">Account</legend>');
    expect(markup).toContain('id="az-login"');
    expect(markup).toContain('id="az-active"');
  });
});

describe("AZUI.Form.render safety", () => {
  const hostile = '"><script>alert(1)</script>';

  it("escapes every user-provided string", () => {
    const definitions: FormFieldDefinition[] = [
      { type: "text", name: "a", label: hostile, value: hostile, placeholder: hostile },
      { type: "text", name: "a", helpText: hostile, error: hostile, className: hostile },
      { type: "textarea", name: "a", value: hostile },
      { type: "select", name: "a", value: hostile, options: [{ value: hostile, label: hostile }] },
      { type: "checkbox", name: "a", label: hostile, value: hostile },
      { type: "group", label: hostile, id: hostile, fields: [] },
      { type: "text", name: "a", attributes: { title: hostile } },
    ];

    for (const definition of definitions) {
      const markup = render(definition);

      expect(markup).not.toContain("<script>");
      expect(markup).toContain("&lt;script&gt;");
    }
  });

  it("rejects attribute names that could break out of the tag", () => {
    expect(() =>
      render({ type: "text", name: "a", attributes: { 'onclick="alert(1)" x': "y" } }),
    ).toThrow('invalid attribute name "onclick="alert(1)" x"');
  });

  it("requires a name or an id", () => {
    expect(() => render({ type: "text", name: "" })).toThrow('"name" is required');
  });

  it("rejects unknown field types", () => {
    const unknown = { type: "color", name: "a" } as unknown as FormFieldDefinition;

    expect(() => render(unknown)).toThrow('unknown field type "color"');
  });
});
