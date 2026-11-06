# Accordion

Expandable and collapsible sections. CSS only, built on the native `<details>` element, so it needs no JavaScript.

## Example

```html
<div class="az-accordion">
  <details class="az-accordion-item" name="faq" open>
    <summary class="az-accordion-header">Payment terms</summary>
    <div class="az-accordion-body">Net 30 days.</div>
  </details>
  <details class="az-accordion-item" name="faq">
    <summary class="az-accordion-header">Late fees</summary>
    <div class="az-accordion-body">2% per month.</div>
  </details>
</div>
```

## Classes

| Class                 | Purpose               |
| --------------------- | --------------------- |
| `az-accordion`        | Container.            |
| `az-accordion-item`   | Apply to `<details>`. |
| `az-accordion-header` | Apply to `<summary>`. |
| `az-accordion-body`   | Content.              |

## Behavior

Give the items the same `name` attribute to allow only one open at a time; omit it to allow several. The browser handles `Enter`/`Space`, state and `open`. Listen to the native `toggle` event to react to changes.

## Accessibility

`<summary>` is a focusable disclosure button with expanded state exposed natively. The chevron is decorative.

## Notes

Exclusive groups via `name` need the last two versions of Chrome, Edge, Firefox or Safari, as supported by AZ UI.
