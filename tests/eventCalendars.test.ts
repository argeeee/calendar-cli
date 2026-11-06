import assert from "node:assert/strict";
import { test } from "node:test";
import type { calendar_v3 } from "googleapis";
import { success } from "../src/core/Result";
import { parseArgs } from "../src/features/entry/application/parser/createParser";
import type { GoogleCalendarClient } from "../src/features/shared/data/clients/GoogleCalendarClient";
import { CreateEventQueryImpl } from "../src/features/events/data/repoQueries/CreateEventQueryImpl";
import { DeleteEventQueryImpl } from "../src/features/events/data/repoQueries/DeleteEventQueryImpl";
import { GetEventQueryImpl } from "../src/features/events/data/repoQueries/GetEventQueryImpl";
import { ListEventsQueryImpl } from "../src/features/events/data/repoQueries/ListEventsQueryImpl";
import { UpdateEventQueryImpl } from "../src/features/events/data/repoQueries/UpdateEventQueryImpl";
import { ListEventLabelsQueryImpl } from "../src/features/eventLabels/data/repoQueries/ListEventLabelsQueryImpl";

const CALENDAR_ID = "team@example.com";
const EVENT_ID = "event-123";
const FROM = "2026-11-01";
const TO = "2026-11-30";
const TITLE = "Planning";
const LABEL_ID = "label-team";

interface CalendarCall {
  method: string;
  calendarId?: string;
  requestBody?: calendar_v3.Schema$Event;
}

interface CalendarFixture {
  client: GoogleCalendarClient;
  calls: CalendarCall[];
}

function createFixture(): CalendarFixture {
  const calls: CalendarCall[] = [];
  const event: calendar_v3.Schema$Event = {
    id: EVENT_ID,
    summary: TITLE,
    start: { date: "2026-11-06" },
    end: { date: "2026-11-07" },
    eventLabelId: LABEL_ID,
  };
  const calendar = {
    events: {
      list: async (input: calendar_v3.Params$Resource$Events$List) => {
        calls.push({ method: "events.list", ...input });
        return { data: { items: [event] } };
      },
      get: async (input: calendar_v3.Params$Resource$Events$Get) => {
        calls.push({ method: "events.get", ...input });
        return { data: event };
      },
      insert: async (input: calendar_v3.Params$Resource$Events$Insert) => {
        calls.push({ method: "events.insert", ...input });
        return { data: { ...event, ...input.requestBody } };
      },
      patch: async (input: calendar_v3.Params$Resource$Events$Patch) => {
        calls.push({ method: "events.patch", ...input });
        return { data: { ...event, ...input.requestBody } };
      },
      delete: async (input: calendar_v3.Params$Resource$Events$Delete) => {
        calls.push({ method: "events.delete", ...input });
        return { data: {} };
      },
    },
    calendars: {
      get: async (input: calendar_v3.Params$Resource$Calendars$Get) => {
        calls.push({ method: "calendars.get", ...input });
        return {
          data: {
            labelProperties: {
              eventLabels: [{
                id: LABEL_ID,
                name: "Team",
                backgroundColor: "#123456",
              }],
            },
          },
        };
      },
    },
  } as unknown as calendar_v3.Calendar;

  return {
    client: { get: async () => success(calendar) } as GoogleCalendarClient,
    calls,
  };
}

for (const calendarId of [undefined, CALENDAR_ID]) {
  const expectedCalendar = calendarId ?? "primary";
  const selection = calendarId === undefined ? {} : { calendarId };

  test(`event reads use calendar ${expectedCalendar}`, async () => {
    const fixture = createFixture();
    const list = new ListEventsQueryImpl(fixture.client);
    const get = new GetEventQueryImpl(fixture.client);

    const listed = await list.query({
      ...selection,
      from: FROM,
      to: TO,
      limit: 50,
      offset: 0,
    });
    const retrieved = await get.query({ ...selection, target: EVENT_ID });
    const found = await get.query({
      ...selection,
      target: { title: TITLE, from: FROM, to: TO },
    });

    assert.equal(listed.hasValue, true);
    assert.equal(retrieved.hasValue, true);
    assert.equal(found.hasValue, true);
    assert.deepEqual(fixture.calls.map((call) => call.method), [
      "events.list",
      "events.get",
      "events.list",
    ]);
    assert.ok(fixture.calls.every((call) => call.calendarId === expectedCalendar));
  });

  test(`event writes and label resolution use calendar ${expectedCalendar}`, async () => {
    const fixture = createFixture();
    const create = new CreateEventQueryImpl(fixture.client);
    const update = new UpdateEventQueryImpl(fixture.client);
    const remove = new DeleteEventQueryImpl(
      fixture.client,
      new GetEventQueryImpl(fixture.client),
    );

    const created = await create.query({
      ...selection,
      event: {
        title: TITLE,
        start: "2026-11-06",
        end: "2026-11-06",
        eventLabelId: "Team",
      },
    });
    const updated = await update.query({
      ...selection,
      id: EVENT_ID,
      patch: { title: "Renamed", eventLabelId: "Team" },
    });
    const recolored = await update.query({
      ...selection,
      id: EVENT_ID,
      patch: { colorId: "1" },
    });
    const deleted = await remove.query({ ...selection, id: EVENT_ID });

    assert.equal(created.hasValue, true);
    assert.equal(updated.hasValue, true);
    assert.equal(recolored.hasValue, true);
    assert.equal(deleted.hasValue, true);
    assert.deepEqual(fixture.calls.map((call) => call.method), [
      "calendars.get",
      "events.insert",
      "events.get",
      "calendars.get",
      "events.patch",
      "events.get",
      "events.patch",
      "events.patch",
      "events.get",
      "events.delete",
    ]);
    assert.ok(fixture.calls.every((call) => call.calendarId === expectedCalendar));
    assert.equal(fixture.calls[1]?.requestBody?.eventLabelId, LABEL_ID);
    assert.equal(fixture.calls[4]?.requestBody?.eventLabelId, LABEL_ID);
    assert.equal(fixture.calls[6]?.requestBody?.eventLabelId, "");
  });

  test(`labels use calendar ${expectedCalendar}`, async () => {
    const fixture = createFixture();
    const query = new ListEventLabelsQueryImpl(fixture.client);
    const result = await query.query(selection);

    assert.equal(result.hasValue, true);
    assert.equal(fixture.calls[0]?.calendarId, expectedCalendar);
    if (result.hasValue) {
      assert.equal(result.value[0]?.id, LABEL_ID);
    }
  });
}

const COMMANDS = [
  ["events", "list", "--from", FROM, "--to", TO],
  ["events", "get", EVENT_ID],
  ["events", "get", "--title", TITLE, "--from", FROM, "--to", TO],
  ["events", "create", "--title", TITLE, "--start", FROM, "--end", FROM],
  ["events", "update", EVENT_ID, "--title", TITLE],
  ["events", "delete", EVENT_ID, "--yes"],
  ["labels", "list"],
];

for (const tokens of COMMANDS) {
  test(`${tokens.join(" ")} accepts --calendar and defaults to primary`, async () => {
    const selected = await parseArgs([...tokens, "--calendar", CALENDAR_ID]);
    const defaulted = await parseArgs(tokens);

    assert.equal(selected?.calendarId, CALENDAR_ID);
    assert.equal(defaulted?.calendarId, "primary");
  });

  test(`${tokens.join(" ")} rejects empty --calendar`, async () => {
    await assert.rejects(parseArgs([...tokens, "--calendar", " "]));
  });
}
