import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";
import { requireArgResults } from "../utils/requireArgResults";

export class ListCalendarsCommand extends Command<ParsedCommand> {
  readonly name = "list";
  readonly description = "List calendars in the authenticated account's calendar list.";

  override run(): ParsedCommand {
    const args = requireArgResults(this);

    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }

    return { kind: "calendars.list" };
  }
}
