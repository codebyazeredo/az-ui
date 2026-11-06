# File upload

Drop zone with a file list for `<input type="file">`. Files can be dropped, picked with the browser dialog (click, `Enter` or `Space`) and removed one by one. Image files get a thumbnail; others show an extension badge. Rejected files stay in the list with the reason.

The native input stays in the DOM (hidden) and its `files` are kept in sync with the accepted files, so `required`, `FormData` and regular form submission keep working. Without JavaScript the native input with the `az-control az-file` classes is shown instead. The component does not upload anything; sending the files is up to the application.

## Example

```html
<label class="az-field-label" for="attachments">Attachments</label>
<input
  class="az-control az-file"
  id="attachments"
  name="attachments"
  type="file"
  accept=".pdf,.png,.jpg"
  multiple
  data-az-component="fileupload"
  data-az-max-size="5242880"
  data-az-max-files="3"
/>
```

```ts
import { FileUpload } from "az-ui";

const upload = new FileUpload("#attachments", { maxSize: 5 * 1024 * 1024, maxFiles: 3 });

document.addEventListener("az:fileupload:add", (event) => {
  for (const file of (event as CustomEvent<{ files: File[] }>).detail.files) {
    // start the upload, then report it:
    upload.setProgress(file, 40);
    upload.setError(file, "Upload failed.");
  }
});
```

`AZUI.Form.file({ name, accept, multiple, maxSize, maxFiles })` renders the same markup.

## Options

| Option     | Data attribute      | Description                                                                                                                                                   |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxSize`  | `data-az-max-size`  | Maximum size per file in bytes. `0` (default) means no limit.                                                                                                 |
| `maxFiles` | `data-az-max-files` | Maximum number of files with `multiple`. `0` means no limit.                                                                                                  |
| `labels`   | -                   | Texts: `prompt`, `browse`, `maxSize`, `maxFiles`, `remove`, `invalidType`, `fileTooLarge`, `tooManyFiles`. Use `{size}`, `{count}` and `{name}` placeholders. |

`accept` and `multiple` come from the native input. `accept` takes extensions (`.pdf`), wildcards (`image/*`) and MIME types. Without `multiple`, a new file replaces the current one.

## Methods and events

`files` (accepted files), `addFiles(files)`, `remove(file)`, `clear()`, `setProgress(file, percent)`, `setError(file, message)` and `destroy()`.

| Event                  | Detail             | Notes                                         |
| ---------------------- | ------------------ | --------------------------------------------- |
| `az:fileupload:add`    | `{ files }`        | Files accepted in this operation.             |
| `az:fileupload:remove` | `{ file }`         | An accepted file was removed.                 |
| `az:fileupload:reject` | `{ file, reason }` | Wrong type, too large or over the file limit. |

Duplicates (same name, size and modification date) are ignored. `form.reset()` clears the list.

## Accessibility

The zone is a focusable `button` named by the field label; `Enter` and `Space` open the file dialog and `aria-disabled` follows the native input. Each remove button is named `Remove <file name>` and focus returns to the zone after removal. Progress uses `role="progressbar"`. A click on the label focuses the zone.

## Notes

Browsers that cannot assign `input.files` programmatically keep the native input unchanged; the list and events still work.
