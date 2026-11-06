# Calendar CLI command verification

Summary: labels, timed/all-day creation, ID/title lookups, date and date-time listing,
pagination, timed updates, all-day date updates, clearing optional fields, and guarded
deletion passed. **Timed-to-all-day conversion initially failed and is now fixed.**
Both conversion directions passed live verification; see Conversion fix verification below.

The initial checks used three temporary events. Each was deleted, each deleted
ID became unavailable, and each final range matched its own pre-test baseline exactly.
Preexisting events were never modified. The first run also exposed an incorrect harness
expectation for the deletion guard's exit status; the corrected guard check passed.

Run date: 2026-11-06T15:37:46.469Z. One subagent performed these checks against Google Calendar.

Only a uniquely named temporary event was created and modified. No preexisting events were modified.
Temporary title: `Calendar CLI temporary test 6573a6a3-a6f9-40f4-9ff3-bc308d955861`. Temporary ID: `iqsskdn202lhc2porqrt7b171s`.
Cleanup: verified; temporary event deleted and the tested range exactly matches the pre-test data.
Existing event contents, credentials, and tokens are omitted.

## Live commands

Commands use npm's --silent option so the harness can parse the CLI's JSON output.

### 1. PASS — Capture pre-test events for restoration comparison (details withheld).

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

### 2. PASS — List event labels; valid JSON array returned.

```sh
npm run --silent dev -- events labels
```

Exit status: 0.

### 3. PASS — Create a unique timed test event with description and location.

```sh
npm run --silent dev -- events create --title 'Calendar CLI temporary test 6573a6a3-a6f9-40f4-9ff3-bc308d955861' --start 2026-11-29T04:11:00+01:00 --end 2026-11-29T04:26:00+01:00 --description 'Temporary CLI verification; safe to delete.' --location 'CLI test location'
```

Exit status: 0.

### 4. PASS — Get test event by positional ID.

```sh
npm run --silent dev -- events get iqsskdn202lhc2porqrt7b171s
```

Exit status: 0.

### 5. PASS — Get test event with --id.

```sh
npm run --silent dev -- events get --id iqsskdn202lhc2porqrt7b171s
```

Exit status: 0.

### 6. PASS — Find test event by exact title and date range.

```sh
npm run --silent dev -- events get --title 'Calendar CLI temporary test 6573a6a3-a6f9-40f4-9ff3-bc308d955861' --from 2026-11-29 --to 2026-11-30
```

Exit status: 0.

### 7. PASS — List a date-time range; test event is present.

```sh
npm run --silent dev -- events list --from 2026-11-29T04:10:00+01:00 --to 2026-11-29T04:30:00+01:00 --limit 1000
```

Exit status: 0.

### 8. PASS — List date-only range including test event.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

### 9. PASS — Pagination matches the second event of the full result.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1 --offset 1
```

Exit status: 0.

### 10. PASS — Zero limit returns an empty event list.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 0
```

Exit status: 0.

### 11. HARNESS ASSERTION FAILED — CLI correctly rejected deletion

```sh
npm run --silent dev -- events delete iqsskdn202lhc2porqrt7b171s
```

Exit status: 1.

### 12. PASS — Delete only the temporary event in cleanup.

```sh
npm run --silent dev -- events delete --id iqsskdn202lhc2porqrt7b171s --yes
```

Exit status: 0.

### 13. PASS — Deleted test event is no longer retrievable.

```sh
npm run --silent dev -- events get --id iqsskdn202lhc2porqrt7b171s
```

Exit status: 1.

### 14. PASS — Verify calendar range exactly matches its pre-test event data.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

## Run limitation

A harness assertion failed because it expected exit status 64 for the deletion guard.
The CLI correctly rejected deletion with exit status 1 and `Deletion requires --yes.`.
Cleanup succeeded. The expectation was corrected to exit status 1 for the follow-up run.

## Follow-up lifecycle verification

Run date: 2026-11-06T15:38:47.633Z. One subagent performed these checks against Google Calendar.

Only a uniquely named temporary event was created and modified. No preexisting events were modified.
Temporary title: `Calendar CLI temporary test 8bc24ecf-2d42-45a4-900c-6c0fe45a5553`. Temporary ID: `lh5l9md225p8at23fqupo7416c`.
Cleanup: verified; temporary event deleted and the tested range exactly matches the pre-test data.
Existing event contents, credentials, and tokens are omitted.

## Live commands

Commands use npm's --silent option so the harness can parse the CLI's JSON output.

### 1. PASS — Capture pre-test events for restoration comparison (details withheld).

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

### 2. PASS — List event labels; valid JSON array returned.

```sh
npm run --silent dev -- events labels
```

Exit status: 0.

### 3. PASS — Create a unique timed test event with description and location.

```sh
npm run --silent dev -- events create --title 'Calendar CLI temporary test 8bc24ecf-2d42-45a4-900c-6c0fe45a5553' --start 2026-11-29T04:11:00+01:00 --end 2026-11-29T04:26:00+01:00 --description 'Temporary CLI verification; safe to delete.' --location 'CLI test location'
```

Exit status: 0.

### 4. PASS — Get test event by positional ID.

```sh
npm run --silent dev -- events get lh5l9md225p8at23fqupo7416c
```

Exit status: 0.

### 5. PASS — Get test event with --id.

```sh
npm run --silent dev -- events get --id lh5l9md225p8at23fqupo7416c
```

Exit status: 0.

### 6. PASS — Find test event by exact title and date range.

```sh
npm run --silent dev -- events get --title 'Calendar CLI temporary test 8bc24ecf-2d42-45a4-900c-6c0fe45a5553' --from 2026-11-29 --to 2026-11-30
```

Exit status: 0.

### 7. PASS — List a date-time range; test event is present.

```sh
npm run --silent dev -- events list --from 2026-11-29T04:10:00+01:00 --to 2026-11-29T04:30:00+01:00 --limit 1000
```

Exit status: 0.

### 8. PASS — List date-only range including test event.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

### 9. PASS — Pagination matches the second event of the full result.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1 --offset 1
```

Exit status: 0.

### 10. PASS — Zero limit returns an empty event list.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 0
```

Exit status: 0.

### 11. PASS — Deletion without --yes is rejected.

```sh
npm run --silent dev -- events delete lh5l9md225p8at23fqupo7416c
```

Exit status: 1.

### 12. PASS — Confirm deletion guard leaves the event intact.

```sh
npm run --silent dev -- events get lh5l9md225p8at23fqupo7416c
```

Exit status: 0.

### 13. PASS — Update title, times, description, location, and label when available.

```sh
npm run --silent dev -- events update --id lh5l9md225p8at23fqupo7416c --title 'Calendar CLI temporary test 8bc24ecf-2d42-45a4-900c-6c0fe45a5553 updated' --start 2026-11-29T04:12:00+01:00 --end 2026-11-29T04:27:00+01:00 --description 'Updated temporary description' --location 'Updated test location' --color 1cec907f-43ca-4f0d-b742-eea6579b35a0
```

Exit status: 0.

### 14. PASS — Clear optional description, location, and color with empty values.

```sh
npm run --silent dev -- events update lh5l9md225p8at23fqupo7416c --description '' --location '' --color ''
```

Exit status: 0.

### 15. FAIL — Convert test event to a one-day all-day event.

Google returned: `Google Calendar rejected this event request. Check the event values and try again.`

```sh
npm run --silent dev -- events update lh5l9md225p8at23fqupo7416c --start 2026-11-29 --end 2026-11-29
```

Exit status: 1.

### 16. PASS — Delete only the temporary event in cleanup.

```sh
npm run --silent dev -- events delete --id lh5l9md225p8at23fqupo7416c --yes
```

Exit status: 0.

### 17. PASS — Deleted test event is no longer retrievable.

```sh
npm run --silent dev -- events get --id lh5l9md225p8at23fqupo7416c
```

Exit status: 1.

### 18. PASS — Verify calendar range exactly matches its pre-test event data.

```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.

## Previous listing fix

These commands were run in the preceding diagnosis/fix, before this live verification:

| Command | Outcome |
| --- | --- |
| `npm run dev -- events list --from 2026-11-01 --to 2026-11-30` | Failed before the SDK context fix; succeeded after it. |
| `node --import tsx --test tests/googleEventListing.test.ts` | Both regression tests failed before the fix. The test file was later moved into src. |
| `npm test` | Both regression tests passed after the fix. |
| `npm run typecheck` | Passed after moving the tests beneath src. |
| `npm run build` | Passed. |

## Run limitation

The timed-to-all-day update failed with exit status 1 and this message:
`Google Calendar rejected this event request. Check the event values and try again.`
Both date fields were supplied. Nested PATCH field retention is a suspected cause,
not a confirmed diagnosis. No implementation changes were made during this test run.

## Additional all-day verification

Temporary title: `Calendar CLI all-day test a6992090-bd04-48f3-894d-be5bf77de431`; ID: `m88b9ekjlakm08smsku9n3bgv8`.

### Capture all-day test baseline (event details withheld)

```sh
"npm" "run" "--silent" "dev" "--" "events" "list" "--from" "2026-11-29" "--to" "2026-11-30" "--limit" "1000"
```

Exit status: 0.

### Create one-day all-day test event

```sh
"npm" "run" "--silent" "dev" "--" "events" "create" "--title" "Calendar CLI all-day test a6992090-bd04-48f3-894d-be5bf77de431" "--start" "2026-11-29" "--end" "2026-11-29"
```

Exit status: 0.

### Move all-day test event to another date

```sh
"npm" "run" "--silent" "dev" "--" "events" "update" "m88b9ekjlakm08smsku9n3bgv8" "--start" "2026-11-30" "--end" "2026-11-30"
```

Exit status: 0.

### Fetch updated all-day event

```sh
"npm" "run" "--silent" "dev" "--" "events" "get" "m88b9ekjlakm08smsku9n3bgv8"
```

Exit status: 0.

### Delete temporary all-day event using positional ID

```sh
"npm" "run" "--silent" "dev" "--" "events" "delete" "m88b9ekjlakm08smsku9n3bgv8" "--yes"
```

Exit status: 0.

### Verify all-day event is no longer retrievable

```sh
"npm" "run" "--silent" "dev" "--" "events" "get" "m88b9ekjlakm08smsku9n3bgv8"
```

Exit status: 1.

### Verify exact restoration against all-day baseline

```sh
"npm" "run" "--silent" "dev" "--" "events" "list" "--from" "2026-11-29" "--to" "2026-11-30" "--limit" "1000"
```

Exit status: 0.

Cleanup: verified; temporary event removed and baseline restored exactly.

## Local validation rerun

| Command | Outcome |
| --- | --- |
| `npm test` | PASS: 2 tests. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS. |

## Conversion fix verification

Run: 2026-11-06T15:42:47.273Z.

The previous timed-to-all-day failure is resolved by explicitly clearing the old
date/dateTime representation in PATCH requests. Both conversion directions were
checked through persisted get responses; description and location were preserved.


```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.


```sh
npm run --silent dev -- events create --title 'Calendar CLI conversion verification 1eb21c5b-3313-44d0-870d-366dfcfbf95e' --start 2026-11-29T09:00:00+01:00 --end 2026-11-29T10:00:00+01:00 --description 'Temporary conversion check' --location 'CLI verification'
```

Exit status: 0.


```sh
npm run --silent dev -- events update m2ac2l4oqikogdquplrnkmlo1k --start 2026-11-29 --end 2026-11-29
```

Exit status: 0.


```sh
npm run --silent dev -- events get --id m2ac2l4oqikogdquplrnkmlo1k
```

Exit status: 0.


```sh
npm run --silent dev -- events update --id m2ac2l4oqikogdquplrnkmlo1k --start 2026-11-29T11:00:00+01:00 --end 2026-11-29T12:00:00+01:00
```

Exit status: 0.


```sh
npm run --silent dev -- events get m2ac2l4oqikogdquplrnkmlo1k
```

Exit status: 0.


```sh
npm run --silent dev -- events delete --id m2ac2l4oqikogdquplrnkmlo1k --yes
```

Exit status: 0.


```sh
npm run --silent dev -- events get m2ac2l4oqikogdquplrnkmlo1k
```

Exit status: 1.


```sh
npm run --silent dev -- events list --from 2026-11-29 --to 2026-11-30 --limit 1000
```

Exit status: 0.


Cleanup and exact baseline restoration verified: true.


Local validation: `npm test` (4 passed), `npm run typecheck`, and `npm run build` passed.
The two conversion regression tests failed before the fix and passed afterward.

Regression reproduction command (2 failures before the fix):

```sh
node --import tsx --test src/features/events/data/repoQueries/googleEventConversion.test.ts
```

Google's [PATCH reference](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch)
documents that omitted fields remain unchanged. Conversion now explicitly clears the unused
date representation instead of omitting it.
