import assert from "node:assert/strict";
import { test } from "node:test";
import { google } from "googleapis";
import { success } from "../src/core/Result";
import type { GoogleCalendarClient } from "../src/features/shared/data/clients/GoogleCalendarClient";
import { CreateCalendar } from "../src/features/calendars/domain/useCases/CreateCalendar";
import { DeleteCalendar } from "../src/features/calendars/domain/useCases/DeleteCalendar";
import { UpdateCalendar } from "../src/features/calendars/domain/useCases/UpdateCalendar";
import { CreateCalendarQueryImpl } from "../src/features/calendars/data/repoQueries/CreateCalendarQueryImpl";
import { DeleteCalendarQueryImpl } from "../src/features/calendars/data/repoQueries/DeleteCalendarQueryImpl";
import { GetCalendarQueryImpl } from "../src/features/calendars/data/repoQueries/GetCalendarQueryImpl";
import { ListCalendarsQueryImpl } from "../src/features/calendars/data/repoQueries/ListCalendarsQueryImpl";
import { UpdateCalendarQueryImpl } from "../src/features/calendars/data/repoQueries/UpdateCalendarQueryImpl";

type ApiCall = {
  path: string;
  search: string;
  method: string;
  body: unknown;
};

type ApiResponse = {
  body?: unknown;
  status?: number;
};

type ApiHandler = (call: ApiCall) => ApiResponse;

const PRIMARY_ID = "owner@example.com";
const SECONDARY_ID = "team@group.calendar.google.com";

function createClient(handler: ApiHandler): GoogleCalendarClient {
  const calendar = google.calendar({
    version: "v3",
    fetchImplementation: async (url, options) => {
      const response = handler({
        path: new URL(String(url)).pathname,
        search: new URL(String(url)).search,
        method: options?.method ?? "GET",
        body: options?.body,
      });

      return new Response(
        response.status === 204 ? null : JSON.stringify(response.body ?? {}),
        {
          status: response.status ?? 200,
          headers: { "content-type": "application/json" },
        },
      );
    },
  });

  return { get: async () => success(calendar) } as GoogleCalendarClient;
}

test("calendar listing follows every page and preserves primary metadata", async () => {
  let calls = 0;
  const client = createClient((call) => {
    assert.equal(new URLSearchParams(call.search).get("showHidden"), "true");
    assert.equal(
      new URLSearchParams(call.search).get("pageToken"),
      calls === 0 ? null : "page-2",
    );
    calls += 1;

    if (calls === 1) {
      return {
        body: {
          items: [{ id: PRIMARY_ID, summary: "Personal", primary: true }],
          nextPageToken: "page-2",
        },
      };
    }

    return { body: { items: [{ id: SECONDARY_ID, summary: "Team" }] } };
  });
  const result = await new ListCalendarsQueryImpl(client).query({});

  assert.equal(calls, 2);
  assert.equal(result.hasValue, true);

  if (result.hasValue) {
    assert.deepEqual(result.value.map((calendar) => calendar.id), [PRIMARY_ID, SECONDARY_ID]);
    assert.equal(result.value[0]?.primary, true);
  }
});

test("get calendar defaults to primary", async () => {
  const client = createClient((call) => {
    assert.equal(call.path, "/calendar/v3/calendars/primary");
    return { body: { id: PRIMARY_ID, summary: "Personal" } };
  });
  const result = await new GetCalendarQueryImpl(client).query({});

  assert.equal(result.hasValue, true);

  if (result.hasValue) {
    assert.equal(result.value.primary, true);
  }
});

test("calendar creation sends metadata and maps the created calendar", async () => {
  const client = createClient((call) => {
    assert.equal(call.method, "POST");
    assert.equal(call.path, "/calendar/v3/calendars");
    assert.deepEqual(JSON.parse(String(call.body)), {
      summary: "Team", timeZone: "Europe/Rome",
    });
    return { body: { id: SECONDARY_ID, summary: "Team", timeZone: "Europe/Rome" } };
  });
  const result = await new CreateCalendarQueryImpl(client).query({
    summary: "Team", timeZone: "Europe/Rome",
  });

  assert.equal(result.hasValue, true);
});

test("calendar update defaults to primary and only sends the patch", async () => {
  const client = createClient((call) => {
    assert.equal(call.method, "PATCH");
    assert.equal(call.path, "/calendar/v3/calendars/primary");
    assert.deepEqual(JSON.parse(String(call.body)), { description: "Updated" });
    return { body: { id: PRIMARY_ID, summary: "Personal", description: "Updated" } };
  });
  const result = await new UpdateCalendarQueryImpl(client).query({
    patch: { description: "Updated" },
  });

  assert.equal(result.hasValue, true);
});

test("calendar validation rejects blank summaries and empty updates before queries", async () => {
  const client = createClient(() => {
    assert.fail("Invalid input must not reach Google");
  });
  const create = new CreateCalendar(new CreateCalendarQueryImpl(client));
  const update = new UpdateCalendar(new UpdateCalendarQueryImpl(client));

  assert.equal((await create.execute({ summary: " " })).hasValue, false);
  assert.equal((await update.execute({ patch: {} })).hasValue, false);
  assert.equal((await update.execute({ patch: { summary: " " } })).hasValue, false);
});

test("primary calendar deletion is blocked before any query for omitted and explicit IDs", async () => {
  const client = createClient(() => {
    assert.fail("Primary deletion must not reach Google");
  });
  const query = new DeleteCalendarQueryImpl(client);
  const useCase = new DeleteCalendar(query);

  for (const request of [{}, { calendarId: "primary" }, { calendarId: " PRIMARY " }]) {
    const result = await useCase.execute(request);
    assert.equal(result.hasValue, false);

    if (!result.hasValue) {
      assert.equal(result.error.message, "The primary calendar cannot be deleted.");
    }
  }

  assert.equal((await query.query({})).hasValue, false);
});

test("primary calendar deletion is blocked for its real ID and aliases resolving to it", async () => {
  for (const calendarId of [PRIMARY_ID, "owner-alias@example.com"]) {
    let deletions = 0;
    const client = createClient((call) => {
      if (call.method === "DELETE") {
        deletions += 1;
      }

      return { body: { id: PRIMARY_ID, summary: "Personal" } };
    });
    const result = await new DeleteCalendarQueryImpl(client).query({ calendarId });

    assert.equal(result.hasValue, false);
    assert.equal(deletions, 0);
  }
});

test("secondary calendar deletion returns the entity and uses its resolved ID", async () => {
  const calls: ApiCall[] = [];
  const client = createClient((call) => {
    calls.push(call);

    if (call.method === "DELETE") {
      return { status: 204 };
    }

    return {
      body: {
        id: call.path.endsWith("/primary") ? PRIMARY_ID : SECONDARY_ID,
        summary: "Team",
      },
    };
  });
  const result = await new DeleteCalendarQueryImpl(client).query({ calendarId: "team-alias" });

  assert.equal(result.hasValue, true);
  assert.equal(calls.length, 3);
  assert.equal(calls[2]?.method, "DELETE");
  assert.equal(decodeURIComponent(calls[2]?.path ?? ""), `/calendar/v3/calendars/${SECONDARY_ID}`);

  if (result.hasValue) {
    assert.equal(result.value.id, SECONDARY_ID);
  }
});

test("calendar deletion stops if primary identity cannot be determined", async () => {
  let deletions = 0;
  const client = createClient((call) => {
    if (call.method === "DELETE") {
      deletions += 1;
    }

    return {
      body: call.path.endsWith("/primary")
        ? { summary: "Personal" }
        : { id: SECONDARY_ID, summary: "Team" },
    };
  });
  const result = await new DeleteCalendarQueryImpl(client).query({ calendarId: SECONDARY_ID });

  assert.equal(result.hasValue, false);
  assert.equal(deletions, 0);
});

test("calendar errors use calendar-specific not found messages", async () => {
  const client = createClient(() => ({ status: 404, body: { error: { message: "Missing" } } }));
  const result = await new GetCalendarQueryImpl(client).query({ calendarId: "missing" });

  assert.equal(result.hasValue, false);

  if (!result.hasValue) {
    assert.equal(result.error.type, "NOT_FOUND");
    assert.equal(result.error.message, "The requested calendar was not found.");
  }
});


test("calendar deletion stops if looking up primary fails", async () => {
  let calls = 0;
  const client = createClient((call) => {
    calls += 1;
    assert.equal(call.method, "GET");
    assert.equal(call.path, "/calendar/v3/calendars/primary");
    return { status: 403, body: { error: { message: "Denied" } } };
  });
  const result = await new DeleteCalendarQueryImpl(client).query({
    calendarId: SECONDARY_ID,
  });

  assert.equal(result.hasValue, false);
  assert.equal(calls, 1);

  if (!result.hasValue) {
    assert.equal(result.error.type, "PERMISSION");
  }
});
