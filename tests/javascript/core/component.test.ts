import { afterEach, describe, expect, it, vi } from "vitest";
import { Component } from "../../../src/javascript/core/component";

class Probe extends Component {
  clicks = 0;

  constructor(target: string | HTMLElement) {
    super("probe", target, {});
    this.listen(this.element, "click", () => {
      this.clicks += 1;
    });
  }

  ping(): boolean {
    return this.emit("ping", { cancelable: true, detail: { value: 1 } });
  }
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Component", () => {
  it("accepts an element or a selector and rejects a missing target", () => {
    document.body.innerHTML = '<div id="target"></div>';

    expect(new Probe("#target").element).toBe(document.getElementById("target"));
    expect(() => new Probe("#missing")).toThrow('no element found for selector "#missing"');
  });

  it("rejects initializing the same element twice and finds the instance", () => {
    document.body.innerHTML = '<div id="target"></div>';
    const element = document.getElementById("target")!;
    const probe = new Probe(element);

    expect(() => new Probe(element)).toThrow("already initialized as probe");
    expect(Component.find("probe", element)).toBe(probe);
  });

  it("removes listeners and allows initializing again after destroy", () => {
    document.body.innerHTML = '<div id="target"></div>';
    const element = document.getElementById("target")!;
    const probe = new Probe(element);

    element.click();
    probe.destroy();
    element.click();

    expect(probe.clicks).toBe(1);
    expect(Component.find("probe", element)).toBeUndefined();
    expect(() => new Probe(element)).not.toThrow();
  });

  it("emits prefixed bubbling events and reports cancellation", () => {
    document.body.innerHTML = '<div id="target"></div>';
    const probe = new Probe("#target");
    const listener = vi.fn((event: Event) => event.preventDefault());
    document.addEventListener("az:probe:ping", listener);

    expect(probe.ping()).toBe(false);
    expect(listener.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ value: 1 });
    document.removeEventListener("az:probe:ping", listener);
    expect(probe.ping()).toBe(true);
  });
});
