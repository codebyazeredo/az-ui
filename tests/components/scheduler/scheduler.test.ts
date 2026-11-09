import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Scheduler,
  type SchedulerEvent,
  type SchedulerOptions,
} from "../../../src/components/scheduler";

const RESOURCES = [
  { id: "d1", label: "Dock 1" },
  { id: "d2", label: "Dock 2" },
  { id: "d3", label: "Dock 3" },
];

const EVENTS: SchedulerEvent[] = [
  {
    id: "e1",
    resource: "d1",
    start: "2026-11-10T08:00",
    end: "2026-11-10T09:00",
    title: "Truck A",
  },
  {
    id: "e2",
    resource: "d1",
    start: "2026-11-10T09:00",
    end: "2026-11-10T10:00",
    title: "Truck B",
  },
  {
    id: "e3",
    resource: "d2",
    start: "2026-11-10T08:00",
    end: "2026-11-10T09:30",
    title: "Truck C",
  },
];

function render(
  overrides: Partial<SchedulerOptions> = {},
  wrapper = "",
  events: SchedulerEvent[] = EVENTS,
): Scheduler {
  document.body.innerHTML = `<div ${wrapper}><div id="sched"></div></div>`;

  return new Scheduler("#sched", {
    resources: RESOURCES,
    events,
    date: "2026-11-10",
    startHour: 6,
    endHour: 12,
    ...overrides,
  });
}

function block(id: string): HTMLElement {
  return document.querySelector<HTMLElement>(`[data-event-id="${id}"]`)!;
}

function press(id: string, key: string, shiftKey = false): void {
  block(id).dispatchEvent(
    new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }),
  );
}

function listen(name: string): ReturnType<typeof vi.fn> {
  const handler = vi.fn();
  document.getElementById("sched")!.addEventListener(`az:scheduler:${name}`, (event) => {
    handler((event as CustomEvent).detail);
  });

  return handler;
}

function timesOf(scheduler: Scheduler, id: string): string[] {
  const event = scheduler.events.find((candidate) => candidate.id === id)!;

  return [event.resource, event.start.slice(11), event.end.slice(11)];
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Scheduler drawing", () => {
  it("draws the hours, one row per resource and the slot variables", () => {
    render();
    const root = document.getElementById("sched")!;

    expect(
      [...document.querySelectorAll(".az-scheduler-hour")].map((cell) => cell.textContent),
    ).toEqual(["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"]);
    expect(document.querySelectorAll(".az-scheduler-row")).toHaveLength(3);
    expect(root.style.getPropertyValue("--az-scheduler-slots")).toBe("12");
    expect(root.style.getPropertyValue("--az-scheduler-slot-width")).toBe("48px");
    expect(root.querySelector(".az-scheduler-scroll")!.getAttribute("role")).toBe("grid");
  });

  it("positions and sizes each event from its time", () => {
    render();

    expect(block("e1").style.left).toBe("192px");
    expect(block("e1").style.width).toBe("96px");
    expect(block("e3").style.width).toBe("144px");
    expect(block("e1").parentElement!.dataset.resource).toBe("d1");
  });

  it("clips events to the window and leaves out events outside it or on another day", () => {
    render({}, "", [
      {
        id: "early",
        resource: "d1",
        start: "2026-11-10T05:00",
        end: "2026-11-10T07:00",
        title: "Early",
      },
      {
        id: "late",
        resource: "d1",
        start: "2026-11-10T11:30",
        end: "2026-11-10T13:00",
        title: "Late",
      },
      {
        id: "outside",
        resource: "d1",
        start: "2026-11-10T13:00",
        end: "2026-11-10T14:00",
        title: "Out",
      },
      {
        id: "other",
        resource: "d1",
        start: "2026-11-11T08:00",
        end: "2026-11-11T09:00",
        title: "Other",
      },
    ]);

    expect(block("early").style.left).toBe("0px");
    expect(block("early").style.width).toBe("96px");
    expect(block("late").style.width).toBe("48px");
    expect(document.querySelector('[data-event-id="outside"]')).toBeNull();
    expect(document.querySelector('[data-event-id="other"]')).toBeNull();
  });

  it("gives each event a descriptive accessible name and shows markup in titles as text", () => {
    render({}, "", [
      {
        id: "x",
        resource: "d1",
        start: "2026-11-10T08:00",
        end: "2026-11-10T09:00",
        title: "<b>Hot</b>",
      },
    ]);

    expect(block("x").getAttribute("aria-label")).toBe("<b>Hot</b>, Dock 1, 08:00 to 09:00");
    expect(block("x").querySelector("b")).toBeNull();
    expect(block("x").textContent).toBe("<b>Hot</b>");
  });

  it("applies the event variant class", () => {
    render({}, "", [
      {
        id: "x",
        resource: "d1",
        start: "2026-11-10T08:00",
        end: "2026-11-10T09:00",
        title: "A",
        variant: "danger",
      },
    ]);

    expect(block("x").classList.contains("az-scheduler-event-danger")).toBe(true);
  });
});

describe("Scheduler keyboard moves", () => {
  it("moves one slot with the arrow keys and emits az:scheduler:move with the proposal", () => {
    const scheduler = render();
    const moved = listen("move");

    press("e3", "ArrowRight");

    expect(timesOf(scheduler, "e3")).toEqual(["d2", "08:30", "10:00"]);
    expect(moved).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: "d2",
        start: "2026-11-10T08:30",
        end: "2026-11-10T10:00",
        event: expect.objectContaining({ id: "e3", start: "2026-11-10T08:00" }),
      }),
    );
    expect(document.activeElement).toBe(block("e3"));
  });

  it("moves to another resource with ArrowDown and ignores ArrowUp at the first one", () => {
    const scheduler = render();
    const moved = listen("move");

    press("e3", "ArrowDown");
    expect(timesOf(scheduler, "e3")[0]).toBe("d3");

    press("e1", "ArrowUp");
    expect(timesOf(scheduler, "e1")[0]).toBe("d1");
    expect(moved).toHaveBeenCalledTimes(1);
  });

  it("refuses a move that would overlap another event of the same resource", () => {
    const scheduler = render();
    const moved = listen("move");

    press("e1", "ArrowRight");

    expect(timesOf(scheduler, "e1")).toEqual(["d1", "08:00", "09:00"]);
    expect(moved).not.toHaveBeenCalled();
  });

  it("allows events that only touch each other", () => {
    const scheduler = render({}, "", [
      { id: "a", resource: "d1", start: "2026-11-10T08:00", end: "2026-11-10T09:00", title: "A" },
      { id: "b", resource: "d1", start: "2026-11-10T09:30", end: "2026-11-10T10:30", title: "B" },
    ]);

    press("b", "ArrowLeft");

    expect(timesOf(scheduler, "b")).toEqual(["d1", "09:00", "10:00"]);
  });

  it("allows overlapping when allowOverlap is true", () => {
    const scheduler = render({ allowOverlap: true });

    press("e1", "ArrowRight");

    expect(timesOf(scheduler, "e1")).toEqual(["d1", "08:30", "09:30"]);
  });

  it("refuses to move to another resource where the slot is taken", () => {
    const scheduler = render({}, "", [
      { id: "a", resource: "d1", start: "2026-11-10T08:00", end: "2026-11-10T09:00", title: "A" },
      { id: "b", resource: "d2", start: "2026-11-10T08:30", end: "2026-11-10T09:30", title: "B" },
    ]);

    press("a", "ArrowDown");

    expect(timesOf(scheduler, "a")[0]).toBe("d1");
  });

  it("keeps the original position when az:scheduler:move is cancelled", () => {
    const scheduler = render();
    document.getElementById("sched")!.addEventListener("az:scheduler:move", (event) => {
      event.preventDefault();
    });

    press("e3", "ArrowRight");

    expect(timesOf(scheduler, "e3")).toEqual(["d2", "08:00", "09:30"]);
    expect(block("e3").style.left).toBe("192px");
  });

  it("does not move an event past the edges of the window", () => {
    const scheduler = render({}, "", [
      {
        id: "first",
        resource: "d1",
        start: "2026-11-10T06:00",
        end: "2026-11-10T07:00",
        title: "A",
      },
      {
        id: "last",
        resource: "d2",
        start: "2026-11-10T11:00",
        end: "2026-11-10T12:00",
        title: "B",
      },
    ]);
    const moved = listen("move");

    press("first", "ArrowLeft");
    press("last", "ArrowRight");

    expect(timesOf(scheduler, "first")[1]).toBe("06:00");
    expect(timesOf(scheduler, "last")[2]).toBe("12:00");
    expect(moved).not.toHaveBeenCalled();
  });

  it("keeps the time axis left to right in rtl pages", () => {
    const scheduler = render({}, 'dir="rtl"');

    press("e3", "ArrowRight");

    expect(timesOf(scheduler, "e3")[1]).toBe("08:30");
  });

  it("announces the move for screen readers", () => {
    render();

    press("e3", "ArrowRight");

    expect(document.querySelector(".az-scheduler-status")!.textContent).toBe(
      "Truck C moved to Dock 2, 08:30 to 10:00",
    );
  });
});

describe("Scheduler keyboard resizing", () => {
  it("lengthens and shortens by one slot with Shift and the arrows", () => {
    const scheduler = render();
    const resized = listen("resize");

    press("e3", "ArrowRight", true);
    expect(timesOf(scheduler, "e3")).toEqual(["d2", "08:00", "10:00"]);

    press("e3", "ArrowLeft", true);
    expect(timesOf(scheduler, "e3")).toEqual(["d2", "08:00", "09:30"]);
    expect(resized).toHaveBeenCalledTimes(2);
  });

  it("never makes an event shorter than one slot", () => {
    const scheduler = render({}, "", [
      { id: "a", resource: "d1", start: "2026-11-10T08:00", end: "2026-11-10T08:30", title: "A" },
    ]);
    const resized = listen("resize");

    press("a", "ArrowLeft", true);

    expect(timesOf(scheduler, "a")).toEqual(["d1", "08:00", "08:30"]);
    expect(resized).not.toHaveBeenCalled();
  });

  it("refuses a resize that overlaps and a cancelled one", () => {
    const scheduler = render();
    press("e1", "ArrowRight", true);
    expect(timesOf(scheduler, "e1")[2]).toBe("09:00");

    document.getElementById("sched")!.addEventListener("az:scheduler:resize", (event) => {
      event.preventDefault();
    });
    press("e3", "ArrowRight", true);
    expect(timesOf(scheduler, "e3")[2]).toBe("09:30");
  });

  it("stops at the end of the window", () => {
    const scheduler = render({}, "", [
      { id: "a", resource: "d1", start: "2026-11-10T11:00", end: "2026-11-10T12:00", title: "A" },
    ]);

    press("a", "ArrowRight", true);

    expect(timesOf(scheduler, "a")[2]).toBe("12:00");
  });
});

describe("Scheduler selection and creation", () => {
  it("emits select on Enter and on click", () => {
    render();
    const selected = listen("select");

    press("e1", "Enter");
    block("e2").click();

    expect(selected.mock.calls.map(([detail]) => detail.event.id)).toEqual(["e1", "e2"]);
  });

  it("emits create with the resource and the slot of an empty click", () => {
    render();
    const lane = document.querySelector<HTMLElement>('[data-resource="d3"]')!;
    lane.getBoundingClientRect = () => ({ left: 100, top: 0, width: 576, height: 48 }) as DOMRect;
    const created = listen("create");

    lane.dispatchEvent(new MouseEvent("click", { clientX: 100 + 48 * 2 + 10, bubbles: true }));

    expect(created).toHaveBeenCalledWith({
      resource: "d3",
      start: "2026-11-10T07:00",
      end: "2026-11-10T07:30",
    });
  });

  it("does not emit create when an event is clicked", () => {
    render();
    const created = listen("create");

    block("e1").click();

    expect(created).not.toHaveBeenCalled();
  });
});

describe("Scheduler data", () => {
  it("events returns copies", () => {
    const scheduler = render();

    scheduler.events[0]!.title = "Changed";

    expect(scheduler.events[0]!.title).toBe("Truck A");
  });

  it("setEvents, setResources and setDate redraw", () => {
    const scheduler = render();

    scheduler.setEvents([
      { id: "n", resource: "d1", start: "2026-11-10T10:00", end: "2026-11-10T11:00", title: "New" },
    ]);
    expect(document.querySelectorAll(".az-scheduler-event")).toHaveLength(1);

    scheduler.setResources([{ id: "d1", label: "Only dock" }]);
    expect(document.querySelectorAll(".az-scheduler-row")).toHaveLength(1);

    scheduler.setDate("2026-11-11");
    expect(document.querySelectorAll(".az-scheduler-event")).toHaveLength(0);
  });

  it("throws a specific message for each kind of invalid data", () => {
    const base = { resources: RESOURCES, date: "2026-11-10" };
    const bad =
      (extra: Partial<SchedulerOptions>): (() => Scheduler) =>
      () => {
        document.body.innerHTML = `<div id="sched"></div>`;
        return new Scheduler("#sched", { ...base, ...extra });
      };
    const event = (extra: Partial<SchedulerEvent>): SchedulerEvent => ({
      id: "x",
      resource: "d1",
      start: "2026-11-10T08:00",
      end: "2026-11-10T09:00",
      title: "X",
      ...extra,
    });

    expect(bad({ date: "10/11/2026" })).toThrow("date");
    expect(bad({ startHour: 10, endHour: 8 })).toThrow("endHour must be greater");
    expect(bad({ slotMinutes: 7 })).toThrow("divides 60");
    expect(bad({ events: [event({ start: "tomorrow" })] })).toThrow("invalid start or end");
    expect(bad({ events: [event({ end: "2026-11-10T08:00" })] })).toThrow("must end after");
    expect(bad({ events: [event({ resource: "ghost" })] })).toThrow("unknown resource");
    expect(bad({ events: [event({}), event({})] })).toThrow("duplicated");
  });

  it("destroy empties the element and removes the variables", () => {
    const scheduler = render();

    scheduler.destroy();

    const root = document.getElementById("sched")!;
    expect(root.children).toHaveLength(0);
    expect(root.style.getPropertyValue("--az-scheduler-slots")).toBe("");
    expect(root.classList.contains("az-scheduler")).toBe(false);
  });

  it("throws when initialized twice", () => {
    const scheduler = render();

    expect(
      () => new Scheduler(scheduler.element, { resources: RESOURCES, date: "2026-11-10" }),
    ).toThrow("already initialized");
  });
});
