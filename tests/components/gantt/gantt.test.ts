import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Gantt, type GanttOptions, type GanttTask } from "../../../src/components/gantt";

const TASKS: GanttTask[] = [
  { id: "a", name: "Plan route", start: "2026-11-10", end: "2026-11-12", progress: 50 },
  { id: "b", name: "Load trucks", start: "2026-11-13", end: "2026-11-13", dependsOn: ["a"] },
  {
    id: "c",
    name: "Deliver",
    start: "2026-11-16",
    end: "2026-11-20",
    dependsOn: ["b", "ghost"],
    variant: "success",
  },
];

function render(overrides: Partial<GanttOptions> = {}, wrapper = ""): Gantt {
  document.body.innerHTML = `<div ${wrapper}><div id="gantt"></div></div>`;

  return new Gantt("#gantt", { tasks: TASKS, locale: "en", ...overrides });
}

function bar(id: string): HTMLElement {
  return document.querySelector<HTMLElement>(`[data-task-id="${id}"]`)!;
}

function press(id: string, key: string, shiftKey = false): void {
  bar(id).dispatchEvent(
    new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }),
  );
}

function listen(name: string): ReturnType<typeof vi.fn> {
  const handler = vi.fn();
  document.getElementById("gantt")!.addEventListener(`az:gantt:${name}`, (event) => {
    handler((event as CustomEvent).detail);
  });

  return handler;
}

function datesOf(gantt: Gantt, id: string): string[] {
  const task = gantt.tasks.find((candidate) => candidate.id === id)!;

  return [task.start, task.end];
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 9));
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Gantt drawing", () => {
  it("draws one row per task with its name, start and end", () => {
    render();

    expect(document.querySelectorAll(".az-gantt-row")).toHaveLength(3);
    const first = document.querySelector(".az-gantt-name")!;
    expect([...first.children].map((cell) => cell.textContent)).toEqual([
      "Plan route",
      "2026-11-10",
      "2026-11-12",
    ]);
    expect(document.querySelector(".az-gantt-grid")!.getAttribute("role")).toBe("grid");
  });

  it("positions and sizes the bars from the dates and the day width", () => {
    render();

    expect([bar("a").style.left, bar("a").style.width]).toEqual(["64px", "96px"]);
    expect([bar("c").style.left, bar("c").style.width]).toEqual(["256px", "160px"]);
  });

  it("gives a one-day task the width of one day", () => {
    render();

    expect(bar("b").style.width).toBe("32px");
  });

  it("draws the progress proportionally and an accessible name", () => {
    render();

    expect(bar("a").querySelector<HTMLElement>(".az-gantt-progress")!.style.width).toBe("50%");
    expect(bar("b").querySelector<HTMLElement>(".az-gantt-progress")!.style.width).toBe("0%");
    expect(bar("a").getAttribute("aria-label")).toBe(
      "Plan route, 2026-11-10 to 2026-11-12, 50% complete",
    );
    expect(bar("c").classList.contains("az-gantt-bar-success")).toBe(true);
  });

  it("covers the tasks plus two days on each side", () => {
    render();
    const root = document.getElementById("gantt")!;

    expect(root.style.getPropertyValue("--az-gantt-days")).toBe("15");
    expect(root.style.getPropertyValue("--az-gantt-day-width")).toBe("32px");
    expect(document.querySelectorAll(".az-gantt-day")).toHaveLength(15);
    expect(document.querySelector(".az-gantt-month")!.textContent).toBe("November 2026");
    expect(document.querySelector<HTMLElement>(".az-gantt-month")!.style.width).toBe("480px");
  });

  it("uses week cells and a narrower day with the week zoom", () => {
    render({ zoom: "week" });

    expect(document.querySelectorAll(".az-gantt-day")).toHaveLength(3);
    expect(document.querySelector<HTMLElement>(".az-gantt-day")!.style.width).toBe("84px");
    expect(bar("a").style.width).toBe("36px");
  });

  it("honors dayWidth and rowHeight", () => {
    render({ dayWidth: 20, rowHeight: 50 });

    expect(bar("a").style.width).toBe("60px");
    expect(document.getElementById("gantt")!.style.getPropertyValue("--az-gantt-row-height")).toBe(
      "50px",
    );
  });

  it("marks today when it is inside the range", () => {
    render();

    expect(document.querySelector<HTMLElement>(".az-gantt-today")!.style.left).toBe("48px");
  });

  it("does not draw the today line when today is outside the range", () => {
    vi.setSystemTime(new Date(2030, 0, 1));
    render();

    expect(document.querySelector(".az-gantt-today")).toBeNull();
  });

  it("shows task names with markup as text", () => {
    render({ tasks: [{ id: "x", name: "<b>Hot</b>", start: "2026-11-10", end: "2026-11-10" }] });

    expect(document.querySelector(".az-gantt-task-name")!.textContent).toBe("<b>Hot</b>");
    expect(document.querySelector(".az-gantt-task-name b")).toBeNull();
  });

  it("draws an empty chart without tasks", () => {
    render({ tasks: [] });

    expect(document.querySelectorAll(".az-gantt-row")).toHaveLength(0);
    expect(document.querySelectorAll(".az-gantt-day")).toHaveLength(28);
  });
});

describe("Gantt dependencies", () => {
  it("draws an elbow path from the end of the source to the start of the target", () => {
    render();
    const paths = [...document.querySelectorAll(".az-gantt-link")].map((path) =>
      path.getAttribute("d"),
    );

    expect(paths).toEqual(["M160,20 H168 V40 H152 V60 H160", "M192,60 H200 V100 H256"]);
  });

  it("ignores a dependency on a task that does not exist", () => {
    render();

    expect(document.querySelectorAll(".az-gantt-link")).toHaveLength(2);
  });

  it("sizes the drawing to the whole chart and hides it from assistive technology", () => {
    render();
    const svg = document.querySelector(".az-gantt-links")!;

    expect(svg.getAttribute("width")).toBe("480");
    expect(svg.getAttribute("height")).toBe("120");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Gantt keyboard", () => {
  it("moves a task one day with the arrows and emits az:gantt:move with the proposal", () => {
    const gantt = render();
    const moved = listen("move");

    press("a", "ArrowRight");

    expect(datesOf(gantt, "a")).toEqual(["2026-11-11", "2026-11-13"]);
    expect(moved).toHaveBeenCalledWith(
      expect.objectContaining({
        start: "2026-11-11",
        end: "2026-11-13",
        task: expect.objectContaining({ id: "a", start: "2026-11-10" }),
      }),
    );
    expect(document.activeElement).toBe(bar("a"));
    expect(bar("a").style.left).toBe("96px");
  });

  it("does not move the tasks that depend on the moved one", () => {
    const gantt = render();

    press("a", "ArrowRight");

    expect(datesOf(gantt, "b")).toEqual(["2026-11-13", "2026-11-13"]);
    expect(datesOf(gantt, "c")).toEqual(["2026-11-16", "2026-11-20"]);
  });

  it("changes the end with Shift and the arrows, never below one day", () => {
    const gantt = render();
    const resized = listen("resize");

    press("a", "ArrowRight", true);
    expect(datesOf(gantt, "a")).toEqual(["2026-11-10", "2026-11-13"]);

    press("b", "ArrowLeft", true);
    expect(datesOf(gantt, "b")).toEqual(["2026-11-13", "2026-11-13"]);
    expect(resized).toHaveBeenCalledTimes(1);
  });

  it("keeps the original dates when az:gantt:move is cancelled", () => {
    const gantt = render();
    document.getElementById("gantt")!.addEventListener("az:gantt:move", (event) => {
      event.preventDefault();
    });

    press("a", "ArrowRight");

    expect(datesOf(gantt, "a")).toEqual(["2026-11-10", "2026-11-12"]);
    expect(bar("a").style.left).toBe("64px");
  });

  it("keeps the original dates when az:gantt:resize is cancelled", () => {
    const gantt = render();
    document.getElementById("gantt")!.addEventListener("az:gantt:resize", (event) => {
      event.preventDefault();
    });

    press("a", "ArrowRight", true);

    expect(datesOf(gantt, "a")).toEqual(["2026-11-10", "2026-11-12"]);
  });

  it("keeps the time axis left to right in rtl pages", () => {
    const gantt = render({}, 'dir="rtl"');

    press("a", "ArrowRight");

    expect(datesOf(gantt, "a")[0]).toBe("2026-11-11");
  });

  it("emits select with Enter and with a click", () => {
    render();
    const selected = listen("select");

    press("b", "Enter");
    bar("c").click();

    expect(selected.mock.calls.map(([detail]) => detail.task.id)).toEqual(["b", "c"]);
  });

  it("announces the new dates for screen readers", () => {
    render();

    press("a", "ArrowRight");

    expect(document.querySelector(".az-gantt-status")!.textContent).toBe(
      "Plan route now runs from 2026-11-11 to 2026-11-13",
    );
  });

  it("ignores keys pressed outside a bar and other keys", () => {
    const gantt = render();
    const moved = listen("move");

    press("a", "a");
    document
      .querySelector(".az-gantt-row")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(moved).not.toHaveBeenCalled();
    expect(datesOf(gantt, "a")[0]).toBe("2026-11-10");
  });
});

describe("Gantt data", () => {
  it("tasks returns copies", () => {
    const gantt = render();

    gantt.tasks[0]!.name = "Changed";

    expect(gantt.tasks[0]!.name).toBe("Plan route");
  });

  it("setTasks and setZoom redraw", () => {
    const gantt = render();

    gantt.setTasks([{ id: "z", name: "Only", start: "2026-11-10", end: "2026-11-11" }]);
    expect(document.querySelectorAll(".az-gantt-row")).toHaveLength(1);

    gantt.setZoom("week");
    expect(document.querySelectorAll(".az-gantt-day").length).toBeLessThan(4);
  });

  it("scrollToToday does not fail with or without a today line", () => {
    const gantt = render();
    expect(() => gantt.scrollToToday()).not.toThrow();

    vi.setSystemTime(new Date(2030, 0, 1));
    gantt.setTasks(TASKS);
    expect(() => gantt.scrollToToday()).not.toThrow();
  });

  it("throws a specific message for each kind of invalid data", () => {
    const bad =
      (tasks: GanttTask[], zoom?: GanttOptions["zoom"]): (() => Gantt) =>
      () => {
        document.body.innerHTML = `<div id="gantt"></div>`;
        return new Gantt("#gantt", { tasks, zoom });
      };
    const task = (extra: Partial<GanttTask>): GanttTask => ({
      id: "x",
      name: "X",
      start: "2026-11-10",
      end: "2026-11-12",
      ...extra,
    });

    expect(bad([task({ start: "10/11/2026" })])).toThrow("invalid start or end");
    expect(bad([task({ end: "2026-11-09" })])).toThrow("ends before it starts");
    expect(bad([task({}), task({})])).toThrow("duplicated");
    expect(bad([task({ progress: 150 })])).toThrow("progress must be from 0 to 100");
    expect(bad([task({ progress: -1 })])).toThrow("progress must be from 0 to 100");
    expect(bad([task({})], "month" as "day")).toThrow("zoom");
  });

  it("destroy empties the element and removes the variables", () => {
    const gantt = render();

    gantt.destroy();

    const root = document.getElementById("gantt")!;
    expect(root.children).toHaveLength(0);
    expect(root.style.getPropertyValue("--az-gantt-days")).toBe("");
    expect(root.classList.contains("az-gantt")).toBe(false);
  });

  it("throws when initialized twice", () => {
    const gantt = render();

    expect(() => new Gantt(gantt.element, { tasks: TASKS })).toThrow("already initialized");
  });
});
