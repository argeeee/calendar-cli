import assert from "node:assert/strict";
import { test } from "node:test";
import { success } from "../src/core/Result";
import { dispatchCommand } from "../src/features/entry/application/dispatchCommand";
import type { ParsedCommand } from "../src/features/entry/application/types/ParsedCommand";
import {
  getCalendar,
  getCreateCalendar,
  getDeleteCalendar,
  getListCalendars,
  getUpdateCalendar,
} from "../src/features/calendars/injections";
import {
  getCreateEvent,
  getDeleteEvent,
  getEvent,
  getListEvents,
  getUpdateEvent,
} from "../src/features/events/injections";
import { getListEventLabels } from "../src/features/eventLabels/injections";

type DispatchUseCase = {
  execute: (input: unknown) => Promise<unknown>;
};

type DispatchCase = {
  command: ParsedCommand;
  useCase: unknown;
  expected: unknown;
};

const CALENDAR_ID = "work@example.com";
const EVENT_ID = "event-123";
const EVENT = { title: "Planning", start: "2026-11-06", end: "2026-11-07" };
const PATCH = { title: "Updated planning" };
const CALENDAR = { summary: "Work" };
const CASES: DispatchCase[] = [
  {
    command: { kind: "calendars.list" },
    useCase: getListCalendars(),
    expected: {},
  },
  {
    command: { kind: "calendars.get", calendarId: CALENDAR_ID },
    useCase: getCalendar(),
    expected: { calendarId: CALENDAR_ID },
  },
  {
    command: { kind: "calendars.create", calendar: CALENDAR },
    useCase: getCreateCalendar(),
    expected: CALENDAR,
  },
  {
    command: { kind: "calendars.update", calendarId: CALENDAR_ID, patch: CALENDAR },
    useCase: getUpdateCalendar(),
    expected: { calendarId: CALENDAR_ID, patch: CALENDAR },
  },
  {
    command: { kind: "calendars.delete", calendarId: CALENDAR_ID, yes: true },
    useCase: getDeleteCalendar(),
    expected: { calendarId: CALENDAR_ID },
  },
  {
    command: {
      kind: "events.list", from: "2026-11-01", to: "2026-11-30",
      limit: 50, offset: 0, calendarId: CALENDAR_ID,
    },
    useCase: getListEvents(),
    expected: {
      from: "2026-11-01", to: "2026-11-30", limit: 50, offset: 0,
      calendarId: CALENDAR_ID,
    },
  },
  {
    command: { kind: "events.get", target: EVENT_ID, calendarId: CALENDAR_ID },
    useCase: getEvent(),
    expected: { target: EVENT_ID, calendarId: CALENDAR_ID },
  },
  {
    command: { kind: "events.create", event: EVENT, calendarId: CALENDAR_ID },
    useCase: getCreateEvent(),
    expected: { event: EVENT, calendarId: CALENDAR_ID },
  },
  {
    command: {
      kind: "events.update", id: EVENT_ID, patch: PATCH, calendarId: CALENDAR_ID,
    },
    useCase: getUpdateEvent(),
    expected: { id: EVENT_ID, patch: PATCH, calendarId: CALENDAR_ID },
  },
  {
    command: {
      kind: "events.delete", id: EVENT_ID, yes: true, calendarId: CALENDAR_ID,
    },
    useCase: getDeleteEvent(),
    expected: { id: EVENT_ID, calendarId: CALENDAR_ID },
  },
  {
    command: { kind: "labels.list", calendarId: CALENDAR_ID },
    useCase: getListEventLabels(),
    expected: { calendarId: CALENDAR_ID },
  },
  {
    command: { kind: "events.get", target: EVENT_ID },
    useCase: getEvent(),
    expected: { target: EVENT_ID, calendarId: "primary" },
  },
];

for (const scenario of CASES) {
  test(`dispatch ${scenario.command.kind} forwards calendar request`, async (context) => {
    const useCase = scenario.useCase as DispatchUseCase;
    const execute = context.mock.method(useCase, "execute", async () => {
      return success({ id: "result" });
    });
    const output = context.mock.method(console, "log", () => {});

    await dispatchCommand(scenario.command);

    assert.deepEqual(execute.mock.calls[0]?.arguments, [scenario.expected]);
    assert.equal(output.mock.calls[0]?.arguments[0], '{\n  "id": "result"\n}');
  });
}
