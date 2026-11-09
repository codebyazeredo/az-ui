import { Component } from "../../javascript/core/component";

export interface TagInputLabels {
  remove: string;
}

export interface TagInputOptions {
  labels?: Partial<TagInputLabels>;
}

const DEFAULT_LABELS: TagInputLabels = { remove: "Remove {tag}" };
const SEPARATOR = ",";

export class TagInput extends Component<TagInputOptions> {
  private readonly field: HTMLInputElement;
  private readonly storage: HTMLInputElement | null;
  private readonly labels: TagInputLabels;
  private values: string[] = [];

  constructor(target: string | HTMLElement, options: TagInputOptions = {}) {
    super("taginput", target, options);

    const field = this.element.querySelector<HTMLInputElement>(".az-tag-input-field");
    if (!field) {
      super.destroy();
      throw new Error('AZUI: tag input requires an <input class="az-tag-input-field">.');
    }
    this.field = field;
    this.storage = this.element.querySelector<HTMLInputElement>('input[type="hidden"]');
    this.labels = { ...DEFAULT_LABELS, ...options.labels };

    const initial = this.storage?.value ?? "";
    for (const tag of initial.split(SEPARATOR)) this.insert(tag.trim());

    this.listen(this.element, "click", (event) => this.handleClick(event));
    this.listen(this.field, "keydown", (event) => this.handleKey(event));
    this.listen(this.field, "input", () => this.handleInput());
    this.listen(this.field, "paste", (event) => this.handlePaste(event));
  }

  get tags(): string[] {
    return [...this.values];
  }

  add(tag: string): boolean {
    const name = tag.trim();
    if (!this.isAcceptable(name)) return false;
    if (!this.emit("add", { cancelable: true, detail: { tag: name } })) return false;

    this.insert(name);
    this.emit("change", { detail: { tags: this.tags } });

    return true;
  }

  remove(index: number): boolean {
    const tag = this.values[index];
    if (tag === undefined) return false;

    this.values.splice(index, 1);
    this.element.querySelectorAll(".az-tag-input-tag")[index]?.remove();
    this.syncStorage();
    this.emit("remove", { detail: { tag } });
    this.emit("change", { detail: { tags: this.tags } });

    return true;
  }

  override destroy(): void {
    for (const chip of this.element.querySelectorAll(".az-tag-input-tag")) chip.remove();
    super.destroy();
  }

  private isAcceptable(name: string): boolean {
    return name !== "" && !name.includes(SEPARATOR) && !this.values.includes(name);
  }

  private insert(name: string): void {
    if (!this.isAcceptable(name)) return;

    this.values.push(name);
    this.field.before(this.createChip(name));
    this.syncStorage();
  }

  private createChip(name: string): HTMLElement {
    const chip = document.createElement("span");
    chip.className = "az-tag-input-tag";

    const label = document.createElement("span");
    label.className = "az-tag-input-label";
    label.textContent = name;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "az-tag-input-remove";
    button.textContent = "×";
    button.setAttribute("aria-label", this.labels.remove.replace("{tag}", name));

    chip.append(label, button);

    return chip;
  }

  private syncStorage(): void {
    if (this.storage) this.storage.value = this.values.join(SEPARATOR);
  }

  private commitField(): void {
    if (this.field.value.trim() === "" || this.add(this.field.value)) this.field.value = "";
  }

  private handleClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest<HTMLElement>(".az-tag-input-remove");
    const chip = button?.closest(".az-tag-input-tag");
    if (chip) {
      const index = [...this.element.querySelectorAll(".az-tag-input-tag")].indexOf(chip);
      this.remove(index);
    }
    this.field.focus();
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === SEPARATOR) {
      event.preventDefault();
      this.commitField();
    } else if (event.key === "Backspace" && this.field.value === "") {
      this.remove(this.values.length - 1);
    }
  }

  private handleInput(): void {
    if (!this.field.value.includes(SEPARATOR)) return;

    const pieces = this.field.value.split(SEPARATOR);
    const rest = pieces.pop() ?? "";
    for (const piece of pieces) this.add(piece);
    this.field.value = rest;
  }

  private handlePaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData("text") ?? "";
    if (!text.includes(SEPARATOR) && !text.includes("\n")) return;

    event.preventDefault();
    for (const piece of text.split(/[,\n]/)) this.add(piece);
  }
}
