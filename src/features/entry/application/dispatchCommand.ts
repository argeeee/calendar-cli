import {
  getCreateEvent,
  getDeleteEvent,
  getEvent,
  getListEvents,
  getUpdateEvent,
} from "../../events/injections";
import { getListEventLabels } from "../../eventLabels/injections";
import {
  getListCalendars,
  getCalendar,
  getCreateCalendar,
  getUpdateCalendar,
  getDeleteCalendar,
} from "../../calendars/injections";
import type { Result } from "../../../core";
import type { ParsedCommand } from "./types/ParsedCommand";

export async function dispatchCommand(
  command: ParsedCommand,
): Promise<void> {
  switch (command.kind) {
    case "events.list":
      await presentResult(
        await getListEvents().execute({
          calendarId: command.calendarId ?? "primary",
          from: command.from,
          to: command.to,
          limit: command.limit,
          offset: command.offset,
        }),
      );
      return;
    case "labels.list":
      await presentResult(await getListEventLabels().execute({
        calendarId: command.calendarId ?? "primary",
      }));
      return;
    case "events.get":
      await presentResult(await getEvent().execute({
        target: command.target,
        calendarId: command.calendarId ?? "primary",
      }));
      return;
    case "events.create":
      await presentResult(
        await getCreateEvent().execute({
          event: command.event,
          calendarId: command.calendarId ?? "primary",
        }),
      );
      return;
    case "events.update":
      await presentResult(
        await getUpdateEvent().execute({
          id: command.id,
          patch: command.patch,
          calendarId: command.calendarId ?? "primary",
        }),
      );
      return;
    case "events.delete":
      await presentResult(await getDeleteEvent().execute({
        id: command.id,
        calendarId: command.calendarId ?? "primary",
      }));
      return;
    case "calendars.list":
      await presentResult(await getListCalendars().execute({}));
      return;
    case "calendars.get":
      await presentResult(await getCalendar().execute({
        calendarId: command.calendarId,
      }));
      return;
    case "calendars.create":
      await presentResult(await getCreateCalendar().execute(command.calendar));
      return;
    case "calendars.update":
      await presentResult(await getUpdateCalendar().execute({
        calendarId: command.calendarId,
        patch: command.patch,
      }));
      return;
    case "calendars.delete":
      await presentResult(await getDeleteCalendar().execute({
        calendarId: command.calendarId,
      }));
      return;
    default:
      return assertNever(command);
  }
}

function presentResult<T, E extends { message: string }>(
  result: Result<T, E>,
): void {
  if (result.hasValue) {
    console.log(JSON.stringify(result.value, null, 2));
    return;
  }

  console.error(result.error.message);
  process.exitCode = 1;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported command: ${JSON.stringify(value)}`);
}
