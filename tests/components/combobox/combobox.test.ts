import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Combobox,
  type ComboboxConfig,
  type ComboboxOption,
} from "../../../src/components/combobox";

const CITIES: ComboboxOption[] = [
  { value: "1", label: "Santos" },
  { value: "2", label: "São Paulo" },
  { value: "3", label: "Campinas" },
];

function render(config: ComboboxConfig = { options: CITIES }, attributes = ""): Combobox {
  document.body.innerHTML = `<div id="host"><input id="city" name="city" ${attributes} /></div>`;

  return new Combobox("#city", config);
}

function input(): HTMLInputElement {
  return document.getElementById("city") as HTMLInputElement;
}

function type(text: string): void {
  input().value = text;
  input().dispatchEvent(new Event("input", { bubbles: true }));
}

function press(key: string): void {
  input().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function labels(): string[] {
  return [...document.querySelectorAll('[role="option"]')].map((item) => item.textContent ?? "");
}

function storage(): HTMLInputElement {
  return document.querySelector('input[type="hidden"]') as HTMLInputElement;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Combobox with local options", () => {
  it("builds the ARIA combobox and moves the name to the hidden field", () => {
    render();

    expect(input().getAttribute("role")).toBe("combobox");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().hasAttribute("name")).toBe(false);
    expect(storage().name).toBe("city");
  });

  it("filters the options ignoring case and accents", () => {
    render();

    type("sao");

    expect(labels()).toEqual(["São Paulo"]);
  });

  it("selects with ArrowDown and Enter and stores the value", () => {
    const combobox = render();
    const selected = vi.fn();
    document.addEventListener("az:combobox:select", (event) => {
      selected((event as CustomEvent).detail.option.value);
    });

    type("s");
    press("ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(
      document.querySelector('[role="option"]')!.id,
    );
    press("Enter");

    expect(combobox.value).toBe("1");
    expect(input().value).toBe("Santos");
    expect(storage().value).toBe("1");
    expect(selected).toHaveBeenCalledWith("1");
    expect(combobox.isOpen).toBe(false);
  });

  it("selects by clicking an option", () => {
    const combobox = render();

    type("camp");
    document.querySelector<HTMLElement>('[role="option"]')!.click();

    expect(combobox.value).toBe("3");
  });

  it("wraps around with the arrow keys", () => {
    render();
    type("");
    press("ArrowDown");

    press("ArrowUp");
    expect(input().getAttribute("aria-activedescendant")).toBe(
      [...document.querySelectorAll('[role="option"]')].at(-1)!.id,
    );
  });

  it("closes with Escape", () => {
    const combobox = render();
    type("s");

    press("Escape");

    expect(combobox.isOpen).toBe(false);
  });

  it("shows the empty message when nothing matches", () => {
    render();

    type("zzz");

    expect(document.querySelector(".az-combobox-status")!.textContent).toBe("No results");
  });

  it("clears the value when the text no longer matches the selection", () => {
    const combobox = render();
    combobox.select(CITIES[0]!);

    type("Sant");

    expect(combobox.value).toBeNull();
    expect(storage().value).toBe("");
  });

  it("clear empties the field and the value", () => {
    const combobox = render();
    combobox.select(CITIES[0]!);

    combobox.clear();

    expect(input().value).toBe("");
    expect(combobox.value).toBeNull();
  });

  it("reads the options from data-az-options", () => {
    render({}, `data-az-options='[{"value":"9","label":"Nine"}]'`);

    type("");
    press("ArrowDown");

    expect(labels()).toEqual(["Nine"]);
  });

  it("throws for invalid data-az-options JSON", () => {
    expect(() => render({}, `data-az-options="not json"`)).toThrow("valid JSON");
  });

  it("destroy restores the input and its name", () => {
    const combobox = render();

    combobox.destroy();

    expect(input().name).toBe("city");
    expect(input().parentElement!.id).toBe("host");
    expect(input().hasAttribute("role")).toBe(false);
    expect(document.querySelector(".az-combobox")).toBeNull();
  });

  it("throws outside an input and when initialized twice", () => {
    document.body.innerHTML = `<div id="box"></div><input id="city" />`;

    expect(() => new Combobox("#box")).toThrow("<input>");

    const combobox = new Combobox("#city");
    expect(() => new Combobox(combobox.element)).toThrow("already initialized");
  });
});

describe("Combobox with a source", () => {
  it("waits for the debounce before searching", async () => {
    const source = vi.fn(async (query: string) =>
      CITIES.filter((city) => city.label.toLowerCase().includes(query)),
    );
    render({ source });

    type("s");
    expect(source).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(250);

    expect(source).toHaveBeenCalledTimes(1);
    expect(source.mock.calls[0]?.[0]).toBe("s");
    expect(labels()).toEqual(["Santos", "São Paulo", "Campinas"]);
  });

  it("does not search below the minimum characters", async () => {
    const source = vi.fn(async () => CITIES);
    render({ source, minChars: 3 });

    type("sa");
    await vi.advanceTimersByTimeAsync(250);

    expect(source).not.toHaveBeenCalled();
  });

  it("shows the loading message while waiting", async () => {
    render({ source: () => new Promise<ComboboxOption[]>(() => undefined) });

    type("s");
    await vi.advanceTimersByTimeAsync(250);

    expect(document.querySelector(".az-combobox-status")!.textContent).toBe("Loading...");
  });

  it("shows an error message when the search fails", async () => {
    render({ source: () => Promise.reject(new Error("offline")) });

    type("s");
    await vi.advanceTimersByTimeAsync(250);

    expect(document.querySelector(".az-combobox-status")!.textContent).toBe(
      "Could not load the options",
    );
  });

  it("ignores an old response that arrives after a newer one", async () => {
    const resolvers: ((options: ComboboxOption[]) => void)[] = [];
    const source = vi.fn(() => new Promise<ComboboxOption[]>((resolve) => resolvers.push(resolve)));
    render({ source });

    type("a");
    await vi.advanceTimersByTimeAsync(250);
    type("ab");
    await vi.advanceTimersByTimeAsync(250);
    resolvers[1]?.([{ value: "2", label: "Second" }]);
    await vi.advanceTimersByTimeAsync(0);
    resolvers[0]?.([{ value: "1", label: "First" }]);
    await vi.advanceTimersByTimeAsync(0);

    expect(labels()).toEqual(["Second"]);
  });

  it("aborts the previous request when the text changes", async () => {
    const signals: AbortSignal[] = [];
    const source = vi.fn((_query: string, signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<ComboboxOption[]>(() => undefined);
    });
    render({ source });

    type("a");
    await vi.advanceTimersByTimeAsync(250);
    type("ab");

    expect(signals[0]?.aborted).toBe(true);
  });

  it("does not reopen the list when a response arrives after a selection", async () => {
    let resolve: (options: ComboboxOption[]) => void = () => undefined;
    const combobox = render({
      source: () =>
        new Promise<ComboboxOption[]>((done) => {
          resolve = done;
        }),
    });

    type("s");
    await vi.advanceTimersByTimeAsync(250);
    combobox.select(CITIES[0]!);
    resolve(CITIES);
    await vi.advanceTimersByTimeAsync(0);

    expect(combobox.isOpen).toBe(false);
  });
});
