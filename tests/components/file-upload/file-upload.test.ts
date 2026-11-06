import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUpload } from "../../../src/components/file-upload";
import {
  fileExtension,
  fillTemplate,
  formatSize,
  matchesAccept,
} from "../../../src/components/file-upload/file-rules";

function render(attributes = "", config = {}): FileUpload {
  document.body.innerHTML = `
    <form id="form">
      <label for="field" id="label">Attachments</label>
      <input id="field" type="file" class="az-control" ${attributes}>
    </form>`;

  return new FileUpload("#field", config);
}

function file(name: string, size = 1024, type = "application/pdf", lastModified = 1): File {
  const created = new File(["x"], name, { type, lastModified });
  Object.defineProperty(created, "size", { value: size });

  return created;
}

const zone = (): HTMLElement => document.querySelector(".az-file-upload-zone")!;
const items = (): HTMLElement[] =>
  [...document.querySelectorAll(".az-file-upload-item")] as HTMLElement[];
const names = (): string[] =>
  [...document.querySelectorAll(".az-file-upload-name")].map((name) => name.textContent ?? "");

function drop(files: File[]): void {
  const event = new Event("drop", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: { files } });
  zone().dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("file rules", () => {
  it("matches extensions, wildcards and exact mime types, or everything when empty", () => {
    expect(matchesAccept(file("a.PDF"), ".pdf")).toBe(true);
    expect(matchesAccept(file("a.png", 1, "image/png"), "image/*")).toBe(true);
    expect(matchesAccept(file("a.png", 1, "image/png"), "image/png, .pdf")).toBe(true);
    expect(matchesAccept(file("a.txt", 1, "text/plain"), ".pdf,image/*")).toBe(false);
    expect(matchesAccept(file("a.txt"), "")).toBe(true);
  });

  it("formats sizes, extensions and templates", () => {
    expect(formatSize(512)).toBe("512 B");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(5 * 1024 * 1024)).toBe("5 MB");
    expect(fileExtension("report.pdf")).toBe("PDF");
    expect(fileExtension("archive.backup1")).toBe("FILE");
    expect(fileExtension("README")).toBe("FILE");
    expect(fillTemplate("Up to {size}", { size: "5 MB" })).toBe("Up to 5 MB");
    expect(fillTemplate("{missing}", {})).toBe("{missing}");
  });
});

describe("FileUpload", () => {
  it("builds an accessible drop zone, hides the native input and shows the limits", () => {
    render('accept=".pdf,.png" multiple', { maxSize: 5 * 1024 * 1024, maxFiles: 3 });

    expect(zone().getAttribute("role")).toBe("button");
    expect(zone().tabIndex).toBe(0);
    expect(zone().getAttribute("aria-labelledby")).toBe(`label ${zone().id}`);
    expect(document.getElementById("field")!.classList.contains("az-file-upload-native")).toBe(
      true,
    );
    expect(document.querySelector(".az-file-upload-hint")!.textContent).toBe(
      "PDF, PNG · Up to 5 MB per file · Up to 3 files",
    );
  });

  it("opens the native picker with click, Enter and Space, unless disabled", () => {
    const upload = render();
    const click = vi.spyOn(document.getElementById("field")!, "click");

    zone().click();
    zone().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    zone().dispatchEvent(new KeyboardEvent("keydown", { key: " ", cancelable: true }));
    expect(click).toHaveBeenCalledTimes(3);

    upload.destroy();
    render("disabled");
    const disabledClick = vi.spyOn(document.getElementById("field")!, "click");
    zone().click();
    expect(disabledClick).not.toHaveBeenCalled();
    expect(zone().getAttribute("aria-disabled")).toBe("true");
  });

  it("adds dropped files to the list with name, size and extension badge", () => {
    const upload = render("multiple");
    const add = vi.fn((event: Event) => (event as CustomEvent).detail.files.length);
    document.addEventListener("az:fileupload:add", add);

    drop([file("report.pdf", 2048), file("notes.txt", 10, "text/plain")]);
    document.removeEventListener("az:fileupload:add", add);

    expect(names()).toEqual(["report.pdf", "notes.txt"]);
    expect(document.querySelector(".az-file-upload-meta")!.textContent).toBe("2 KB");
    expect(document.querySelector(".az-file-upload-thumb")!.textContent).toBe("PDF");
    expect(upload.files).toHaveLength(2);
    expect(add).toHaveReturnedWith(2);
  });

  it("highlights the zone while dragging over it", () => {
    render();

    zone().dispatchEvent(new Event("dragover", { cancelable: true }));
    expect(zone().classList.contains("az-file-upload-zone-active")).toBe(true);

    zone().dispatchEvent(new Event("dragleave"));
    expect(zone().classList.contains("az-file-upload-zone-active")).toBe(false);
  });

  it("rejects files with a wrong type, too large or beyond the limit, showing the reason", () => {
    const upload = render('accept=".pdf" multiple', { maxSize: 2048, maxFiles: 1 });
    const reject = vi.fn((event: Event) => (event as CustomEvent).detail.reason);
    document.addEventListener("az:fileupload:reject", reject);

    drop([
      file("photo.png", 10, "image/png"),
      file("big.pdf", 4096),
      file("a.pdf", 10, "application/pdf", 2),
      file("b.pdf", 10, "application/pdf", 3),
    ]);
    document.removeEventListener("az:fileupload:reject", reject);

    expect(upload.files.map((accepted) => accepted.name)).toEqual(["a.pdf"]);
    expect(reject).toHaveReturnedWith("This file type is not allowed.");
    expect(reject).toHaveReturnedWith("The file is larger than 2 KB.");
    expect(reject).toHaveReturnedWith("Only 1 file(s) allowed.");
    expect(document.querySelectorAll(".az-file-upload-item-error")).toHaveLength(3);
    expect(document.querySelector(".az-file-upload-error")!.textContent).toBe(
      "This file type is not allowed.",
    );
  });

  it("ignores duplicates and replaces the file in single mode", () => {
    const upload = render();

    drop([file("a.pdf")]);
    drop([file("a.pdf")]);
    expect(items()).toHaveLength(1);

    drop([file("b.pdf", 5, "application/pdf", 9)]);
    expect(names()).toEqual(["b.pdf"]);
    expect(upload.files).toHaveLength(1);
  });

  it("removes a file from the button, emits the event and returns focus to the zone", () => {
    const upload = render("multiple");
    const remove = vi.fn();
    document.addEventListener("az:fileupload:remove", remove);
    drop([file("a.pdf"), file("b.pdf", 1, "application/pdf", 2)]);

    const button = document.querySelector<HTMLElement>(".az-file-upload-remove")!;
    expect(button.getAttribute("aria-label")).toBe("Remove a.pdf");
    button.click();
    document.removeEventListener("az:fileupload:remove", remove);

    expect(names()).toEqual(["b.pdf"]);
    expect(upload.files).toHaveLength(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(zone());
  });

  it("clears every file", () => {
    const upload = render("multiple");
    drop([file("a.pdf"), file("b.pdf", 1, "application/pdf", 2)]);

    upload.clear();

    expect(items()).toHaveLength(0);
    expect(upload.files).toHaveLength(0);
  });

  it("shows upload progress and errors reported by the consumer", () => {
    const upload = render();
    drop([file("a.pdf")]);
    const [uploaded] = upload.files;

    upload.setProgress(uploaded!, 42.4);
    const progress = document.querySelector<HTMLElement>(".az-file-upload-item .az-progress")!;
    expect(progress.getAttribute("aria-valuenow")).toBe("42");
    expect((progress.firstElementChild as HTMLElement).style.width).toBe("42%");

    upload.setError(uploaded!, "Upload failed.");
    expect(document.querySelector(".az-file-upload-item .az-progress")).toBeNull();
    expect(document.querySelector(".az-file-upload-error")!.textContent).toBe("Upload failed.");
  });

  it("adds the files picked in the native input", () => {
    const upload = render("multiple");
    const input = document.getElementById("field") as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file("picked.pdf")], configurable: true });

    input.dispatchEvent(new Event("change"));

    expect(upload.files.map((picked) => picked.name)).toEqual(["picked.pdf"]);
  });

  it("moves focus to the zone when the native input is focused through its label", () => {
    render();

    document.getElementById("field")!.dispatchEvent(new FocusEvent("focus"));

    expect(document.activeElement).toBe(zone());
  });

  it("rejects elements that are not file inputs", () => {
    document.body.innerHTML = `<input id="text" type="text">`;

    expect(() => new FileUpload("#text")).toThrow("input");
  });

  it("restores the native input on destroy", () => {
    const upload = render();
    drop([file("a.pdf")]);

    upload.destroy();

    expect(document.querySelector(".az-file-upload")).toBeNull();
    expect(document.getElementById("field")!.parentElement!.id).toBe("form");
    expect(document.getElementById("field")!.classList.contains("az-file-upload-native")).toBe(
      false,
    );
  });
});
