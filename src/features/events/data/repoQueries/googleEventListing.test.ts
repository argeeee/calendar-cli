import assert from "node:assert/strict";
import { test } from "node:test";
import { google } from "googleapis";
import { success } from "../../../../core/Result";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { GetEventQueryImpl } from "./GetEventQueryImpl";
import { ListEventsQueryImpl } from "./ListEventsQueryImpl";

const FROM = "2026-11-01";
const TO = "2026-11-30";
const TITLE = "Planning";
const EVENT_ID = "event-123";

function createCalendarClient(): GoogleCalendarClient {
  const calendar = google.calendar({
    version: "v3",
    fetchImplementation: async () => {
      return new Response(JSON.stringify({
        items: [{
          id: EVENT_ID,
          summary: TITLE,
          start: { date: "2026-11-06" },
          end: { date: "2026-11-07" },
        }],
      }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  return { get: async () => success(calendar) } as GoogleCalendarClient;
}

test("list events preserves the Google SDK resource context", async () => {
  const query = new ListEventsQueryImpl(createCalendarClient());
  const result = await query.query({ from: FROM, to: TO, limit: 50, offset: 0 });

  assert.equal(result.hasValue, true, JSON.stringify(result));
  if (result.hasValue) {
    assert.deepEqual(result.value.events.map((event) => event.id), [EVENT_ID]);
  }
});

test("lookup by title preserves the Google SDK resource context", async () => {
  const query = new GetEventQueryImpl(createCalendarClient());
  const result = await query.query({ target: { title: TITLE, from: FROM, to: TO } });

  assert.equal(result.hasValue, true, JSON.stringify(result));
  if (result.hasValue) {
    assert.equal(result.value.id, EVENT_ID);
  }
});
