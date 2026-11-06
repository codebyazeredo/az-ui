import { Component } from "../../javascript/core/component";
import { resolveElement } from "../../javascript/dom/resolve-element";
import { ensureId } from "../../javascript/dom/unique-id";
import { Icon } from "../icon";
import { fileExtension, fillTemplate, formatSize, matchesAccept } from "./file-rules";

export interface FileUploadLabels {
  prompt: string;
  browse: string;
  maxSize: string;
  maxFiles: string;
  remove: string;
  invalidType: string;
  fileTooLarge: string;
  tooManyFiles: string;
}

export interface FileUploadOptions {
  maxSize: number;
  maxFiles: number;
  labels: FileUploadLabels;
}

export type FileUploadConfig = Partial<Omit<FileUploadOptions, "labels">> & {
  labels?: Partial<FileUploadLabels>;
};

interface Entry {
  file: File;
  error: string | null;
  node: HTMLElement;
  previewUrl: string | null;
  progress: HTMLElement | null;
}

const DEFAULT_LABELS: FileUploadLabels = {
  prompt: "Drag and drop, or",
  browse: "browse",
  maxSize: "Up to {size} per file",
  maxFiles: "Up to {count} files",
  remove: "Remove {name}",
  invalidType: "This file type is not allowed.",
  fileTooLarge: "The file is larger than {size}.",
  tooManyFiles: "Only {count} file(s) allowed.",
};

function resolveOptions(target: string | HTMLElement, config: FileUploadConfig): FileUploadOptions {
  const { azMaxSize, azMaxFiles } = resolveElement(target).dataset;

  return {
    maxSize: config.maxSize ?? Number(azMaxSize ?? 0),
    maxFiles: config.maxFiles ?? Number(azMaxFiles ?? 0),
    labels: { ...DEFAULT_LABELS, ...config.labels },
  };
}

function createElement(tag: string, className: string, text = ""): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;

  return element;
}

function isSameFile(first: File, second: File): boolean {
  return (
    first.name === second.name &&
    first.size === second.size &&
    first.lastModified === second.lastModified
  );
}

export class FileUpload extends Component<FileUploadOptions> {
  private readonly native: HTMLInputElement;
  private readonly wrapper = createElement("div", "az-file-upload");
  private readonly zone = createElement("div", "az-file-upload-zone");
  private readonly list = createElement("ul", "az-file-upload-list");
  private entries: Entry[] = [];

  constructor(target: string | HTMLElement, config: FileUploadConfig = {}) {
    super("fileupload", target, resolveOptions(target, config));

    if (!(this.element instanceof HTMLInputElement) || this.element.type !== "file") {
      super.destroy();
      throw new Error('AZUI: fileupload must be initialized on an <input type="file"> element.');
    }
    this.native = this.element;

    this.build();
    this.listen(this.zone, "click", () => this.openPicker());
    this.listen(this.zone, "keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.openPicker();
    });
    this.listen(this.zone, "dragover", (event) => this.handleDragOver(event));
    this.listen(this.zone, "dragleave", (event) => this.handleDragLeave(event));
    this.listen(this.zone, "drop", (event) => this.handleDrop(event));
    this.listen(this.list, "click", (event) => this.handleListClick(event));
    this.listen(this.native, "change", () => this.addFiles([...(this.native.files ?? [])]));
    this.listen(this.native, "focus", () => this.zone.focus());
    if (this.native.form) {
      this.listen(this.native.form, "reset", () => window.setTimeout(() => this.clear()));
    }
  }

  get files(): File[] {
    return this.entries.filter(({ error }) => !error).map(({ file }) => file);
  }

  addFiles(incoming: Iterable<File>): void {
    const files = [...incoming];
    if (!this.native.multiple && files.length > 0) this.dropEntries();

    const added: File[] = [];
    for (const file of files) {
      if (this.entries.some((entry) => isSameFile(entry.file, file))) continue;

      const entry = this.createEntry(file, this.validate(file));
      this.entries.push(entry);
      this.list.append(entry.node);
      if (entry.error) this.emit("reject", { detail: { file, reason: entry.error } });
      else added.push(file);
    }

    this.syncNative();
    if (added.length > 0) this.emit("add", { detail: { files: added } });
  }

  remove(file: File): void {
    const entry = this.entries.find((candidate) => candidate.file === file);
    if (!entry) return;

    this.discard(entry);
    this.entries = this.entries.filter((candidate) => candidate !== entry);
    this.syncNative();
    if (!entry.error) this.emit("remove", { detail: { file } });
  }

  clear(): void {
    for (const { file } of [...this.entries]) this.remove(file);
  }

  setProgress(file: File, percent: number): void {
    const entry = this.entries.find((candidate) => candidate.file === file);
    if (!entry) return;

    const value = Math.min(100, Math.max(0, Math.round(percent)));
    if (!entry.progress) {
      entry.progress = this.createProgress(file);
      entry.node.append(entry.progress);
    }
    entry.progress.setAttribute("aria-valuenow", String(value));
    const bar = entry.progress.firstElementChild;
    if (bar instanceof HTMLElement) bar.style.width = `${value}%`;
  }

  setError(file: File, message: string): void {
    const entry = this.entries.find((candidate) => candidate.file === file);
    if (!entry) return;

    entry.progress?.remove();
    entry.progress = null;
    this.showError(entry, message);
  }

  override destroy(): void {
    for (const entry of this.entries) this.discard(entry);
    this.entries = [];
    this.wrapper.replaceWith(this.native);
    this.native.classList.remove("az-file-upload-native");
    this.native.removeAttribute("tabindex");
    this.native.removeAttribute("aria-hidden");
    super.destroy();
  }

  private build(): void {
    const { labels } = this.options;
    const prompt = createElement("p", "az-file-upload-prompt", `${labels.prompt} `);
    prompt.append(createElement("span", "az-file-upload-browse", labels.browse));
    const icon = createElement("span", "az-file-upload-icon");
    icon.append(Icon.create("upload"));
    this.zone.append(icon, prompt);
    const hint = this.createHint();
    if (hint) this.zone.append(createElement("p", "az-file-upload-hint", hint));

    this.zone.tabIndex = 0;
    this.zone.setAttribute("role", "button");
    this.zone.setAttribute("aria-disabled", String(this.native.disabled));
    const label = this.native.labels?.[0];
    if (label) {
      const zoneId = ensureId(this.zone, "az-file-upload-zone");
      this.zone.setAttribute("aria-labelledby", `${ensureId(label, "az-label")} ${zoneId}`);
    }
    this.list.setAttribute("role", "list");

    this.native.before(this.wrapper);
    this.wrapper.append(this.native, this.zone, this.list);
    this.native.classList.add("az-file-upload-native");
    this.native.tabIndex = -1;
    this.native.setAttribute("aria-hidden", "true");
  }

  private createHint(): string {
    const { labels, maxSize, maxFiles } = this.options;
    const parts = [
      this.native.accept
        .split(",")
        .filter((token) => token.trim().startsWith("."))
        .map((token) => token.trim().slice(1).toUpperCase())
        .join(", "),
      maxSize > 0 ? fillTemplate(labels.maxSize, { size: formatSize(maxSize) }) : "",
      this.native.multiple && maxFiles > 0
        ? fillTemplate(labels.maxFiles, { count: maxFiles })
        : "",
    ];

    return parts.filter(Boolean).join(" · ");
  }

  private validate(file: File): string | null {
    const { labels, maxSize, maxFiles } = this.options;
    const limit = this.native.multiple ? maxFiles : 1;

    if (!matchesAccept(file, this.native.accept)) return labels.invalidType;
    if (maxSize > 0 && file.size > maxSize) {
      return fillTemplate(labels.fileTooLarge, { size: formatSize(maxSize) });
    }
    if (limit > 0 && this.files.length >= limit) {
      return fillTemplate(labels.tooManyFiles, { count: limit });
    }

    return null;
  }

  private createEntry(file: File, error: string | null): Entry {
    const node = createElement("li", "az-file-upload-item");
    const info = createElement("div", "az-file-upload-info");
    info.append(
      createElement("div", "az-file-upload-name", file.name),
      createElement("div", "az-file-upload-meta", formatSize(file.size)),
    );
    const remove = createElement("button", "az-file-upload-remove");
    remove.append(Icon.create("close", { size: "sm" }));
    remove.setAttribute("type", "button");
    remove.setAttribute(
      "aria-label",
      fillTemplate(this.options.labels.remove, { name: file.name }),
    );

    const entry: Entry = { file, error: null, node, previewUrl: null, progress: null };
    node.append(this.createThumbnail(entry), info, remove);
    if (error) this.showError(entry, error);

    return entry;
  }

  private createThumbnail(entry: Entry): HTMLElement {
    const { file } = entry;
    if (file.type.startsWith("image/") && typeof URL.createObjectURL === "function") {
      entry.previewUrl = URL.createObjectURL(file);
      const image = document.createElement("img");
      image.className = "az-file-upload-thumb";
      image.alt = "";
      image.src = entry.previewUrl;

      return image;
    }

    return createElement("span", "az-file-upload-thumb", fileExtension(file.name));
  }

  private createProgress(file: File): HTMLElement {
    const progress = createElement("div", "az-progress az-progress-sm");
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-label", file.name);
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.append(createElement("div", "az-progress-bar"));

    return progress;
  }

  private showError(entry: Entry, message: string): void {
    entry.error = entry.error ?? message;
    entry.node.classList.add("az-file-upload-item-error");
    entry.node
      .querySelector(".az-file-upload-meta")
      ?.replaceWith(createElement("div", "az-file-upload-error", message));
  }

  private discard(entry: Entry): void {
    if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
    entry.node.remove();
  }

  private dropEntries(): void {
    for (const entry of this.entries) this.discard(entry);
    this.entries = [];
  }

  private syncNative(): void {
    if (typeof DataTransfer === "undefined") return;

    const transfer = new DataTransfer();
    for (const file of this.files) transfer.items.add(file);
    this.native.files = transfer.files;
  }

  private openPicker(): void {
    if (!this.native.disabled) this.native.click();
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.native.disabled) this.zone.classList.add("az-file-upload-zone-active");
  }

  private handleDragLeave(event: DragEvent): void {
    if (event.relatedTarget instanceof Node && this.zone.contains(event.relatedTarget)) return;
    this.zone.classList.remove("az-file-upload-zone-active");
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.zone.classList.remove("az-file-upload-zone-active");
    if (!this.native.disabled) this.addFiles([...(event.dataTransfer?.files ?? [])]);
  }

  private handleListClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(".az-file-upload-remove");
    const entry = this.entries.find(({ node }) => node === button?.closest("li"));
    if (!entry) return;

    this.remove(entry.file);
    this.zone.focus();
  }
}
