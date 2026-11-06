import { resolveElement } from "../dom/resolve-element";

const registry = new WeakMap<HTMLElement, Map<string, Component>>();

export interface EmitOptions {
  cancelable?: boolean;
  detail?: unknown;
}

export abstract class Component<TOptions extends object = object> {
  readonly element: HTMLElement;
  protected readonly options: TOptions;
  private readonly name: string;
  private readonly cleanups: (() => void)[] = [];

  static find(name: string, element: HTMLElement): Component | undefined {
    return registry.get(element)?.get(name);
  }

  protected constructor(name: string, target: string | HTMLElement, options: TOptions) {
    const element = resolveElement(target);
    const instances = registry.get(element) ?? new Map<string, Component>();
    if (instances.has(name)) {
      throw new Error(`AZUI: the element is already initialized as ${name}.`);
    }

    this.name = name;
    this.element = element;
    this.options = options;
    instances.set(name, this);
    registry.set(element, instances);
  }

  destroy(): void {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
    registry.get(this.element)?.delete(this.name);
  }

  protected listen<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ): () => void {
    target.addEventListener(type, handler);
    return this.track(() => target.removeEventListener(type, handler));
  }

  protected listenOnDocument<K extends keyof DocumentEventMap>(
    type: K,
    handler: (event: DocumentEventMap[K]) => void,
  ): () => void {
    document.addEventListener(type, handler);
    return this.track(() => document.removeEventListener(type, handler));
  }

  protected track(cleanup: () => void): () => void {
    let done = false;
    const once = (): void => {
      if (done) return;
      done = true;
      cleanup();
    };
    this.cleanups.push(once);

    return once;
  }

  protected emit(eventName: string, { cancelable = false, detail }: EmitOptions = {}): boolean {
    const event = new CustomEvent(`az:${this.name}:${eventName}`, {
      bubbles: true,
      cancelable,
      detail,
    });

    return this.element.dispatchEvent(event);
  }
}
