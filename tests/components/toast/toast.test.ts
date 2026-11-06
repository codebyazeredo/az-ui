import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../../../src/components/toast";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Toast", () => {
  it("renders into a shared container with a status role and a close label", () => {
    Toast.show({ message: "Saved", title: "Done", variant: "success" });
    Toast.show({ message: "Again" });

    expect(document.querySelectorAll(".az-toast-container")).toHaveLength(1);
    const toasts = document.querySelectorAll(".az-toast");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]?.className).toContain("az-toast-success");
    expect(toasts[0]?.getAttribute("role")).toBe("status");
    expect(toasts[0]?.querySelector(".az-toast-title")?.textContent).toBe("Done");
    expect(toasts[0]?.querySelector("button")?.getAttribute("aria-label")).toBe("Close");
  });

  it("announces danger toasts as alerts and supports a custom close label", () => {
    Toast.show({ message: "Failed", variant: "danger", closeLabel: "Fechar" });

    const toast = document.querySelector(".az-toast")!;
    expect(toast.getAttribute("role")).toBe("alert");
    expect(toast.querySelector("button")?.getAttribute("aria-label")).toBe("Fechar");
  });

  it("treats content as text, never as HTML", () => {
    Toast.show({ message: "<img src=x onerror=alert(1)>" });

    expect(document.querySelector(".az-toast img")).toBeNull();
    expect(document.querySelector(".az-toast-message")?.textContent).toBe(
      "<img src=x onerror=alert(1)>",
    );
  });

  it("dismisses itself after the duration and emits hidden", () => {
    const hidden = vi.fn();
    document.addEventListener("az:toast:hidden", hidden);
    Toast.show({ message: "Saved", duration: 1000 });

    vi.advanceTimersByTime(999);
    expect(document.querySelector(".az-toast")).not.toBeNull();
    vi.advanceTimersByTime(1);

    expect(document.querySelector(".az-toast")).toBeNull();
    expect(hidden).toHaveBeenCalledTimes(1);
    document.removeEventListener("az:toast:hidden", hidden);
  });

  it("stays open when the duration is 0", () => {
    Toast.show({ message: "Pinned", duration: 0 });

    vi.advanceTimersByTime(60_000);

    expect(document.querySelector(".az-toast")).not.toBeNull();
  });

  it("pauses while hovered and restarts when the pointer leaves", () => {
    Toast.show({ message: "Saved", duration: 1000 });
    const toast = document.querySelector(".az-toast")!;

    toast.dispatchEvent(new Event("mouseenter"));
    vi.advanceTimersByTime(5000);
    expect(document.querySelector(".az-toast")).not.toBeNull();

    toast.dispatchEvent(new Event("mouseleave"));
    vi.advanceTimersByTime(1000);
    expect(document.querySelector(".az-toast")).toBeNull();
  });

  it("closes from the close button and can be cancelled on hide", () => {
    const instance = Toast.show({ message: "Saved", duration: 0 });
    const prevent = (event: Event): void => event.preventDefault();

    document.addEventListener("az:toast:hide", prevent);
    instance.hide();
    expect(document.querySelector(".az-toast")).not.toBeNull();
    document.removeEventListener("az:toast:hide", prevent);

    document.querySelector<HTMLElement>(".az-toast-close")!.click();
    expect(document.querySelector(".az-toast")).toBeNull();
  });
});
