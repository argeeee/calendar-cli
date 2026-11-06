import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";
import { readCalendarTarget } from "../utils/readCalendarTarget";
import { requireArgResults } from "../utils/requireArgResults";

const PRIMARY_CALENDAR_ID = "primary";

export class DeleteCalendarCommand extends Command<ParsedCommand> {
  readonly name = "delete";
  readonly description = "Delete a secondary calendar. Primary cannot be deleted.";

  constructor() {
    super();

    this.argParser.addOption("calendar", {
      help: "Calendar ID (default: primary, which cannot be deleted)",
      valueHelp: "id",
    });
    this.argParser.addFlag("yes", {
      help: "Confirm deletion of the calendar and its events",
    });
  }

  override run(): ParsedCommand {
    const calendarId = readCalendarTarget(this);
    const args = requireArgResults(this);

    if (calendarId === PRIMARY_CALENDAR_ID) {
      this.usageException("The primary calendar cannot be deleted.");
    }

    if (!args.flag("yes")) {
      this.usageException("Deletion requires --yes.");
    }

    return { kind: "calendars.delete", calendarId, yes: true };
  }
}
