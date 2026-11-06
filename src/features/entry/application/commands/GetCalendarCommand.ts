import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";
import { readCalendarTarget } from "../utils/readCalendarTarget";

export class GetCalendarCommand extends Command<ParsedCommand> {
  readonly name = "get";
  readonly description = "Get a calendar (default: primary).";

  constructor() {
    super();

    this.argParser.addOption("calendar", {
      help: "Calendar ID (default: primary)",
      valueHelp: "id",
    });
  }

  override run(): ParsedCommand {
    return {
      kind: "calendars.get",
      calendarId: readCalendarTarget(this),
    };
  }
}
