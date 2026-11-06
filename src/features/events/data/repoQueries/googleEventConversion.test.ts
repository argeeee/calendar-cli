import assert from "node:assert/strict";
import { test } from "node:test";
import { google } from "googleapis";
import { success } from "../../../../core/Result";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import type { GoogleEvent } from "../models/GoogleEvent";
import { UpdateEventQueryImpl } from "./UpdateEventQueryImpl";

const EVENT_ID = "conversion-test";
const TITLE = "Conversion test";
const DATE = "2026-11-29";
const NEXT_DATE = "2026-11-30";
const START = "2026-11-29T09:00:00+01:00";
const END = "2026-11-29T10:00:00+01:00";

function createCalendarClient(initial: GoogleEvent): GoogleCalendarClient {
  const calendar = google.calendar({
    version: "v3",
    fetchImplementation: async (_url, options) => {
      let event = initial;
      let status = 200;

      if (options?.method === "PATCH") {
        const patch = JSON.parse(String(options.body)) as GoogleEvent;
        event = {
          ...initial,
          ...patch,
          start: { ...initial.start, ...patch.start },
          end: { ...initial.end, ...patch.end },
        };

        // PATCH retains omitted nested fields, so both representations must
        // never remain set after merging a conversion request.
        if (
          (event.start?.date && event.start.dateTime) ||
          (event.end?.date && event.end.dateTime)
        ) {
          status = 400;
        }
      }

      return new Response(JSON.stringify(event), {
        status,
        headers: { "content-type": "application/json" },
      });
    },
  });

  return { get: async () => success(calendar) } as GoogleCalendarClient;
}

test("update converts timed events to all-day without retaining dateTime", async () => {
  const query = new UpdateEventQueryImpl(createCalendarClient({
    id: EVENT_ID,
    summary: TITLE,
    start: { dateTime: START },
    end: { dateTime: END },
  }));
  const result = await query.query({ id: EVENT_ID, patch: { start: DATE, end: DATE } });

  assert.equal(result.hasValue, true, JSON.stringify(result));
  if (result.hasValue) {
    assert.equal(result.value.start, DATE);
    assert.equal(result.value.end, DATE);
  }
});

test("update converts all-day events to timed without retaining date", async () => {
  const query = new UpdateEventQueryImpl(createCalendarClient({
    id: EVENT_ID,
    summary: TITLE,
    start: { date: DATE },
    end: { date: NEXT_DATE },
  }));
  const result = await query.query({ id: EVENT_ID, patch: { start: START, end: END } });

  assert.equal(result.hasValue, true, JSON.stringify(result));
  if (result.hasValue) {
    assert.equal(result.value.start, START);
    assert.equal(result.value.end, END);
  }
});
