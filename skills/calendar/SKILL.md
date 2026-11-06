---
name: calendar
description: Manage Google calendars and events with the bundled calendar CLI. Use for listing, finding, creating, updating, or deleting calendars and events; primary is the default calendar.
---

# Calendar CLI

Run commands from this skill directory so the bundled `calendar.js`, `.env`, and `.calendar/` state use this directory as their working directory:

```bash
node calendar.js events <action> [options]
```

The CLI manages Google calendars and events and requires the Google Calendar API. Commands select the authenticated account's primary calendar unless a calendar ID is supplied. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the environment or a `.env` file in this directory. On first use, the CLI opens a browser for OAuth consent and saves credentials under `.calendar/`. Keep credentials and token files out of commands, output, and version control.

## Input rules

- Dates may be `YYYY-MM-DD` or ISO 8601 date-times with a timezone, such as `2026-11-06T09:00:00+01:00` or `2026-11-06T08:00:00Z`. Date-time fractions may contain 1–3 digits.
- Date-only values create all-day events. For all-day events, Google Calendar treats the end date as exclusive; for example, `--start 2026-11-06 --end 2026-11-07` creates a one-day event on November 6.
- For create, start and end must both be dates or both be date-times. When both are supplied to update, they must use the same form.
- Quote titles, descriptions, and locations containing spaces or shell-special characters.
- All event commands and `labels list` accept `--calendar <calendar-id>` and default to `primary` when omitted.
- Event colors are event-label names or IDs configured on the selected calendar. Use `labels list [--calendar <calendar-id>]` to see available labels.

## Help

```bash
node calendar.js --help
node calendar.js events --help
node calendar.js events create --help
```

## Manage calendars

```bash
node calendar.js calendars list
node calendar.js calendars get [--calendar <calendar-id>]
node calendar.js calendars create --summary <name> [--description <text>] [--location <text>] [--time-zone <iana-zone>]
node calendar.js calendars update [--calendar <calendar-id>] [--summary <name>] [--description <text>] [--location <text>] [--time-zone <iana-zone>]
node calendar.js calendars delete --calendar <calendar-id> --yes
```

`list` returns the authenticated account's calendar list. Use its IDs with
`--calendar` on calendar, event, and label commands. `get`, `update`, and `delete`
also accept a positional calendar ID and default to `primary` when omitted.
`create` creates a secondary calendar. `update` requires at least one field;
empty descriptions and locations clear those fields. Time zones use IANA names
such as `Europe/Rome`.

The primary calendar cannot be deleted, including by its actual calendar ID.
Deleting a secondary calendar deletes its events and requires `--yes`. Obtain
fresh explicit confirmation naming the calendar or ID before running deletion.

```bash
node calendar.js calendars create --summary "Work" --time-zone Europe/Rome
node calendar.js events list --calendar calendar-id --from 2026-11-01 --to 2026-11-30
node calendar.js labels list --calendar calendar-id
```

## List events

```bash
node calendar.js events list --from <date-or-date-time> --to <date-or-date-time> [--limit <nonnegative-integer>] [--offset <nonnegative-integer>]
```

The range boundaries are inclusive. `--from` and `--to` are required; `--limit` defaults to `50` and `--offset` to `0`.

```bash
node calendar.js events list --from 2026-11-01 --to 2026-11-30 --limit 20 --offset 0
node calendar.js events list --from 2026-11-06T00:00:00+01:00 --to 2026-11-06T23:59:59+01:00
```

## List event labels

```bash
node calendar.js labels list [--calendar <calendar-id>]
```

Returns configured event-label IDs, optional names, and color values. Use a label name or ID with `--color` when creating or updating an event.

## Get one event

Get by ID, either positionally or with `--id`:

```bash
node calendar.js events get <event-id>
node calendar.js events get --id <event-id>
```

Or look up by exact title within a required range:

```bash
node calendar.js events get --title "Planning" --from 2026-11-06 --to 2026-11-07
```

Use either an ID or lookup options. A title lookup that matches multiple events fails; narrow the range or use an ID.

## Create an event

```bash
node calendar.js events create --title <title> --start <date-or-date-time> --end <date-or-date-time> [--description <text>] [--location <text>] [--color <name-or-id>]
```

Timed event:

```bash
node calendar.js events create --title "Planning" --start 2026-11-06T09:00:00+01:00 --end 2026-11-06T10:00:00+01:00
```

All-day event (end date is exclusive):

```bash
node calendar.js events create --title "Conference" --start 2026-11-06 --end 2026-11-09 --location "Rome"
```

Required options are `--title`, `--start`, and `--end`. Optional options are `--description`, `--location`, and `--color`. Short aliases are `-t`, `-s`, `-e`, `-d`, and `-l` for title, start, end, description, and location.

## Update an event

```bash
node calendar.js events update <event-id> [--title <title>] [--start <date-or-date-time>] [--end <date-or-date-time>] [--description <text>] [--location <text>] [--color <name-or-id>]
node calendar.js events update --id <event-id> [update-options]
```

Supply at least one update option. Empty values clear description, location, or color. If changing between all-day and timed events, provide both `--start` and `--end` in the same date form.

```bash
node calendar.js events update event-id --title "Updated event" --description ""
node calendar.js events update event-id --start 2026-11-06T10:00:00+01:00 --end 2026-11-06T11:00:00+01:00
```

## Delete an event

```bash
node calendar.js events delete <event-id> --yes
node calendar.js events delete --id <event-id> --yes
```

`--yes` is required. Deletion is irreversible; obtain fresh explicit confirmation naming the event or ID before running this command.

## Output and errors

- Successful commands print JSON to stdout and exit with status `0`.
- Runtime failures, such as missing credentials, authorization or permission failures, event lookup failures, Google validation errors, and network errors, print a message to stderr and exit with status `1`.
- Invalid command input prints an error and usage to stderr and exits with status `2`.
- Event IDs returned by successful create, get, update, and delete operations can be used for later updates or deletion.
