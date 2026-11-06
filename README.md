# Calendar CLI

Manage calendar events with the `events` command:

```sh
npm run dev -- events <command> [options]
```

## Event commands

### List events

List events in an inclusive date range. Dates can be `YYYY-MM-DD` or ISO date-times
such as `2026-11-06T09:00:00+01:00` (fractions may contain 1–3 digits).

```sh
npm run dev -- events list --from 2026-11-01 --to 2026-11-30
npm run dev -- events list --from 2026-11-01 --to 2026-11-30 --limit 20 --offset 10
```

Options: `--from` and `--to` are required; `--limit` defaults to `50` and `--offset`
defaults to `0`.

### Get an event

Get by event ID, either positionally or with `--id`, or look up by title and date range:

```sh
npm run dev -- events get evt_123
npm run dev -- events get --id evt_123
npm run dev -- events get --title "Planning" --from 2026-11-01 --to 2026-11-30
```

The lookup form requires all of `--title`, `--from`, and `--to`.

### Create an event

```sh
npm run dev -- events create --title "Planning" --start 2026-11-06T09:00:00+01:00 --end 2026-11-06T10:00:00+01:00
npm run dev -- events create --title "Day off" --start 2026-11-06 --end 2026-11-07 --description "Out of office" --location "Rome" --color "Personal"
```

Required options: `--title`, `--start`, and `--end`. Optional options: `--description`,
`--location`, and `--color` (event label name or ID). Start and end must both be dates or
both be date-times. Short aliases are `-t`, `-s`, `-e`, `-d`, and `-l` for title, start,
end, description, and location.

### Update an event

Supply an ID as a positional argument or with `--id`, and at least one field to update:

```sh
npm run dev -- events update evt_123 --title "Updated title"
npm run dev -- events update --id evt_123 --start 2026-11-06T10:00:00+01:00 --end 2026-11-06T11:00:00+01:00
npm run dev -- events update evt_123 --description "" --location "Rome" --color "Work"
```

Available fields: `--title`, `--start`, `--end`, `--description`, `--location`, and
`--color`. Empty description, location, or color values clear those fields. Short aliases
are `-t`, `-s`, `-e`, `-d`, and `-l` for title, start, end, description, and location.

### Delete an event

Deletion requires an explicit `--yes` flag:

```sh
npm run dev -- events delete evt_123 --yes
npm run dev -- events delete --id evt_123 --yes
```

### List event labels

Show event label names and IDs for use with `--color`:

```sh
npm run dev -- events labels
```

