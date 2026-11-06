import { describe, expect, it } from "vitest";
import { AZUI } from "../../../src";

const { Form } = AZUI;

describe("AZUI.Form element functions", () => {
  it("return the same markup as render()", () => {
    const options = { name: "email", label: "Email", helpText: "Work address" };

    expect(Form.email(options).outerHTML).toBe(Form.render({ ...options, type: "email" }));
  });

  it("associate the label with the control", () => {
    const field = Form.text({ name: "username", label: "Username" });
    const input = field.querySelector("input");
    const label = field.querySelector("label");

    expect(input?.id).toBeTruthy();
    expect(label?.htmlFor).toBe(input?.id);
  });

  it("create one field per type", () => {
    expect(
      Form.input({ type: "text", name: "a" }).querySelector("input[type=text]"),
    ).not.toBeNull();
    expect(Form.password({ name: "a" }).querySelector("input[type=password]")).not.toBeNull();
    expect(Form.number({ name: "a" }).querySelector("input[type=number]")).not.toBeNull();
    expect(Form.date({ name: "a" }).querySelector("input[type=date]")).not.toBeNull();
    expect(Form.textarea({ name: "a" }).querySelector("textarea")).not.toBeNull();
    expect(Form.select({ name: "a", options: [] }).querySelector("select")).not.toBeNull();
    expect(Form.checkbox({ name: "a" }).querySelector("input[type=checkbox]")).not.toBeNull();
    expect(Form.radio({ name: "a", value: "x" }).querySelector("input[type=radio]")).not.toBeNull();
    expect(Form.switch({ name: "a" }).querySelector("input[role=switch]")).not.toBeNull();
  });

  it("keep hostile values inert in the DOM", () => {
    const field = Form.text({ name: "a", label: "<img src=x onerror=alert(1)>" });

    expect(field.querySelector("img")).toBeNull();
    expect(field.querySelector("label")?.textContent).toBe("<img src=x onerror=alert(1)>");
  });

  it("round-trips textarea and select values through the DOM", () => {
    const textarea = Form.textarea({ name: "notes", value: "\nline" }).querySelector("textarea");
    const select = Form.select({
      name: "country",
      value: "br",
      options: [
        { value: "ar", label: "Argentina" },
        { value: "br", label: "Brazil" },
      ],
    }).querySelector("select");

    expect(textarea?.value).toBe("\nline");
    expect(select?.value).toBe("br");
  });

  it("create a group containing its fields", () => {
    const group = Form.group({ label: "Account", fields: [{ type: "text", name: "login" }] });

    expect(group.tagName).toBe("FIELDSET");
    expect(group.querySelector("legend")?.textContent).toBe("Account");
    expect(group.querySelector("input[name=login]")).not.toBeNull();
  });
});
