export function markupToElement(markup: string): HTMLElement {
  const template = document.createElement("template");
  // Safe only for markup whose dynamic values were already escaped, such as AZUI.Form.render() output.
  template.innerHTML = markup;

  const element = template.content.firstElementChild;
  if (!(element instanceof HTMLElement)) {
    throw new Error("AZUI: the markup did not produce an element.");
  }

  return element;
}
