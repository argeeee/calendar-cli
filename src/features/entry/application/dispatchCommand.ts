import {
  getCreateEvent,
  getDeleteEvent,
  getEvent,
  getListEvents,
  getUpdateEvent,
} from "../../events/injections";
import { getListEventLabels } from "../../eventLabels/injections";
import type { Result } from "../../../core";
import type { ParsedEventsCommand } from "./types/ParsedEventsCommand";

export async function dispatchCommand(
  command: ParsedEventsCommand,
): Promise<void> {
  switch (command.kind) {
    case "events.list":
      await presentResult(
        await getListEvents().execute({
          from: command.from,
          to: command.to,
          limit: command.limit,
          offset: command.offset,
        }),
      );
      return;
    case "events.labels.list":
      await presentResult(await getListEventLabels().execute({}));
      return;
    case "events.get":
      await presentResult(await getEvent().execute({ target: command.target }));
      return;
    case "events.create":
      await presentResult(
        await getCreateEvent().execute({ event: command.event }),
      );
      return;
    case "events.update":
      await presentResult(
        await getUpdateEvent().execute({ id: command.id, patch: command.patch }),
      );
      return;
    case "events.delete":
      await presentResult(await getDeleteEvent().execute({ id: command.id }));
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
