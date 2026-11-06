# Frameworks

AZ UI does not depend on any framework. Styles are plain CSS classes, and interactive components are classes that wrap a DOM element. That makes integration the same in every framework: import the stylesheet once, write the markup in your templates, and create interactive components after the element exists.

> **Compatibility by design.** AZ UI has no framework wrappers and its test suite does not run inside each framework. The patterns below use only the public API. Report any integration problem as an issue.

## Rules that apply everywhere

- Import `az-ui/styles.css` once, in the application entry point.
- Create interactive components only in the browser, after the element is in the DOM (`useEffect`, `onMounted`, `onMount`, `ngAfterViewInit`).
- Call `destroy()` when the element is removed. One element can have only one instance of a component.
- Do not let two systems own the same element. Let the framework render the markup and let AZ UI add behavior and ARIA attributes.
- Server-side rendering is safe for CSS-only components. Interactive components do nothing until they run in the browser.

## React and Preact

```tsx
import { useEffect, useRef } from "react";
import { Modal } from "az-ui";
import "az-ui/styles.css";

export function ConfirmDelete() {
  const modalElement = useRef<HTMLDivElement>(null);
  const modal = useRef<Modal | null>(null);

  useEffect(() => {
    if (!modalElement.current) return;
    modal.current = new Modal(modalElement.current);
    return () => modal.current?.destroy();
  }, []);

  return (
    <>
      <button className="az-btn az-btn-danger" type="button" onClick={() => modal.current?.show()}>
        Delete
      </button>
      <div className="az-modal" ref={modalElement} hidden>
        <div className="az-modal-dialog">
          <div className="az-modal-header">
            <h2 className="az-modal-title">Delete customer</h2>
          </div>
          <div className="az-modal-body">This action cannot be undone.</div>
          <div className="az-modal-footer">
            <button className="az-btn" type="button" data-az-dismiss>
              Cancel
            </button>
            <button className="az-btn az-btn-danger" type="button" data-az-dismiss>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

## Next.js

Import the CSS in the root layout. Components that create AZ UI instances must be Client Components.

```tsx
// app/layout.tsx
import "az-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-az-theme="light">
      <body className="az-body">{children}</body>
    </html>
  );
}
```

Add `"use client"` to the top of files like the React example above.

## Vue and Nuxt

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Modal } from "az-ui";

const modalElement = ref<HTMLElement | null>(null);
let modal: Modal | null = null;

onMounted(() => {
  if (modalElement.value) modal = new Modal(modalElement.value);
});
onBeforeUnmount(() => modal?.destroy());
</script>

<template>
  <button class="az-btn" type="button" @click="modal?.show()">Open</button>
  <div ref="modalElement" class="az-modal" hidden>…</div>
</template>
```

In Nuxt, register the stylesheet in `nuxt.config.ts` with `css: ["az-ui/styles.css"]`. `onMounted` already runs only in the browser.

## Angular

```ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { Modal } from "az-ui";

@Component({
  selector: "app-confirm",
  template: `
    <button class="az-btn" type="button" (click)="modal?.show()">Open</button>
    <div #dialog class="az-modal" hidden>…</div>
  `,
})
export class ConfirmComponent implements AfterViewInit, OnDestroy {
  @ViewChild("dialog") dialog!: ElementRef<HTMLElement>;
  modal?: Modal;

  ngAfterViewInit() {
    this.modal = new Modal(this.dialog.nativeElement);
  }

  ngOnDestroy() {
    this.modal?.destroy();
  }
}
```

Add `"node_modules/az-ui/dist/styles.css"` to the `styles` array of `angular.json`.

## Svelte and SvelteKit

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Modal } from "az-ui";

  let dialog: HTMLElement;
  let modal: Modal;

  onMount(() => {
    modal = new Modal(dialog);
    return () => modal.destroy();
  });
</script>

<button class="az-btn" type="button" on:click={() => modal.show()}>Open</button>
<div class="az-modal" bind:this={dialog} hidden>…</div>
```

In SvelteKit, import `az-ui/styles.css` in `src/routes/+layout.svelte`.

## Other frameworks

| Framework | Where to import the CSS              | Where to create components                          |
| --------- | ------------------------------------ | --------------------------------------------------- |
| SolidJS   | Entry file (`index.tsx`)             | `onMount`, with `onCleanup` calling `destroy()`     |
| Astro     | Frontmatter of the base layout       | A `<script>` tag in the component                   |
| Qwik      | Root layout                          | `useVisibleTask$`                                   |
| Lit       | Shared style sheet in the base class | `firstUpdated`, with `disconnectedCallback`         |
| htmx      | Base template                        | `htmx:afterSettle` handler calling `initComponents` |

## Plain HTML

No bundler is needed for CSS-only components: link `dist/styles.css`. Interactive components need an ES module, so load `dist/auto.js` with `<script type="module">`.
