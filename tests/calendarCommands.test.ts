import assert from "node:assert/strict";
import { test } from "node:test";
import { parseArgs } from "../src/features/entry/application/parser/createParser";

const CALENDAR_ID = "work@example.com";

test("calendar get defaults to primary and accepts either ID form", async () => {
  assert.deepEqual(await parseArgs(["calendars", "get"]), {
    kind: "calendars.get",
    calendarId: "primary",
  });

  for (const target of [[CALENDAR_ID], ["--calendar", CALENDAR_ID]]) {
    assert.deepEqual(await parseArgs(["calendars", "get", ...target]), {
      kind: "calendars.get",
      calendarId: CALENDAR_ID,
    });
  }
});

test("calendar commands parse list, create, and partial updates", async () => {
  assert.deepEqual(await parseArgs(["calendars", "list"]), {
    kind: "calendars.list",
  });

  assert.deepEqual(await parseArgs([
    "calendars", "create", "--summary", " Work ",
    "--description", "Team schedule", "--location", "Rome",
    "--time-zone", "Europe/Rome",
  ]), {
    kind: "calendars.create",
    calendar: {
      summary: "Work",
      description: "Team schedule",
      location: "Rome",
      timeZone: "Europe/Rome",
    },
  });

  assert.deepEqual(await parseArgs([
    "calendars", "update", "--description", "", "--location", "",
  ]), {
    kind: "calendars.update",
    calendarId: "primary",
    patch: { description: "", location: "" },
  });

  assert.deepEqual(await parseArgs([
    "calendars", "update", CALENDAR_ID, "--summary", "Updated",
  ]), {
    kind: "calendars.update",
    calendarId: CALENDAR_ID,
    patch: { summary: "Updated" },
  });
});

test("calendar deletion requires confirmation and rejects primary", async () => {
  assert.deepEqual(await parseArgs([
    "calendars", "delete", "--calendar", CALENDAR_ID, "--yes",
  ]), {
    kind: "calendars.delete",
    calendarId: CALENDAR_ID,
    yes: true,
  });

  await assert.rejects(
    parseArgs(["calendars", "delete", CALENDAR_ID]),
    /Deletion requires --yes/,
  );

  for (const target of [[], ["primary"], ["--calendar", "primary"]]) {
    await assert.rejects(
      parseArgs(["calendars", "delete", ...target, "--yes"]),
      /primary calendar cannot be deleted/,
    );
  }
});

test("calendar commands reject empty values and ambiguous targets", async () => {
  const invalidCommands = [
    ["get", "--calendar", " "],
    ["get", CALENDAR_ID, "--calendar", CALENDAR_ID],
    ["get", CALENDAR_ID, "extra"],
    ["list", "extra"],
    ["create", "--summary", " "],
    ["create", "--summary", "Work", "--time-zone", " "],
    ["update", "--calendar", CALENDAR_ID],
    ["update", "--summary", " "],
    ["update", "--time-zone", ""],
    ["delete", "--calendar", "", "--yes"],
  ];

  for (const command of invalidCommands) {
    await assert.rejects(parseArgs(["calendars", ...command]));
  }
});
