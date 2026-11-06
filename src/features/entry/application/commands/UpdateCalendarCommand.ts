import { Command } from "@argetim/arg-parser/command_runner";
import type { CalendarPatch } from "../../../calendars/domain/models/CalendarPatch";
import type { ParsedCommand } from "../types/ParsedCommand";
import { readCalendarTarget } from "../utils/readCalendarTarget";
import { requireArgResults } from "../utils/requireArgResults";

export class UpdateCalendarCommand extends Command<ParsedCommand> {
  readonly name = "update";
  readonly description = "Update a calendar (default: primary).";

  constructor() {
    super();

    this.argParser.addOption("calendar", {
      help: "Calendar ID (default: primary)",
      valueHelp: "id",
    });
    this.argParser.addOption("summary", {
      help: "Replacement calendar name",
      valueHelp: "name",
    });
    this.argParser.addOption("description", {
      help: "Replacement description (empty clears it)",
      valueHelp: "text",
    });
    this.argParser.addOption("location", {
      help: "Replacement location (empty clears it)",
      valueHelp: "text",
    });
    this.argParser.addOption("time-zone", {
      help: "Replacement IANA time zone, such as Europe/Rome",
      valueHelp: "zone",
    });
  }

  override run(): ParsedCommand {
    const calendarId = readCalendarTarget(this);
    const args = requireArgResults(this);
    const patch: CalendarPatch = {};
    const summary = args.option("summary");
    const description = args.option("description");
    const location = args.option("location");
    const timeZone = args.option("time-zone");

    if (summary !== null) {
      if (summary.trim() === "") {
        this.usageException("--summary must be a nonempty calendar name.");
      }

      patch.summary = summary.trim();
    }

    if (description !== null) {
      patch.description = description;
    }

    if (location !== null) {
      patch.location = location;
    }

    if (timeZone !== null) {
      if (timeZone.trim() === "") {
        this.usageException("--time-zone must not be empty.");
      }

      patch.timeZone = timeZone.trim();
    }

    if (Object.keys(patch).length === 0) {
      this.usageException("At least one update option is required.");
    }

    return { kind: "calendars.update", calendarId, patch };
  }
}
