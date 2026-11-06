import { Command } from "@argetim/arg-parser/command_runner";
import type { CreateCalendarRequest } from "../../../calendars/domain/models/CreateCalendarRequest";
import type { ParsedCommand } from "../types/ParsedCommand";
import { requireArgResults } from "../utils/requireArgResults";

export class CreateCalendarCommand extends Command<ParsedCommand> {
  readonly name = "create";
  readonly description = "Create a secondary calendar.";

  constructor() {
    super();

    this.argParser.addOption("summary", {
      help: "Calendar name",
      valueHelp: "name",
      mandatory: true,
    });
    this.argParser.addOption("description", {
      help: "Calendar description",
      valueHelp: "text",
    });
    this.argParser.addOption("location", {
      help: "Calendar location",
      valueHelp: "text",
    });
    this.argParser.addOption("time-zone", {
      help: "IANA time zone, such as Europe/Rome",
      valueHelp: "zone",
    });
  }

  override run(): ParsedCommand {
    const args = requireArgResults(this);
    const summary = args.option("summary")?.trim();

    if (!summary) {
      this.usageException("--summary must be a nonempty calendar name.");
    }

    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }

    const calendar: CreateCalendarRequest = { summary };
    const description = args.option("description");
    const location = args.option("location");
    const timeZone = args.option("time-zone");

    if (description !== null) {
      calendar.description = description;
    }

    if (location !== null) {
      calendar.location = location;
    }

    if (timeZone !== null) {
      if (timeZone.trim() === "") {
        this.usageException("--time-zone must not be empty.");
      }

      calendar.timeZone = timeZone.trim();
    }

    return { kind: "calendars.create", calendar };
  }
}
