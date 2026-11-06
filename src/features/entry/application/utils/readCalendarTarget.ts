import type { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";
import { requireArgResults } from "./requireArgResults";

const PRIMARY_CALENDAR_ID = "primary";

export function readCalendarTarget(command: Command<ParsedCommand>): string {
  const args = requireArgResults(command);
  const optionId = args.option("calendar");
  const [positionalId, ...unexpected] = args.rest;

  if (optionId !== null && positionalId !== undefined) {
    command.usageException(
      "Specify the calendar ID either with --calendar or as a positional argument.",
    );
  }

  if (unexpected.length > 0) {
    command.usageException("Unexpected positional argument.");
  }

  const calendarId = (optionId ?? positionalId ?? PRIMARY_CALENDAR_ID).trim();

  if (calendarId === "") {
    command.usageException("The calendar ID must not be empty.");
  }

  return calendarId;
}
