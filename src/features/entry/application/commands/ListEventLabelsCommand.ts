import { Command } from "@argetim/arg-parser/command_runner";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedCommand } from "../types/ParsedCommand";

export class ListEventLabelsCommand extends Command<ParsedCommand> {
  readonly name = "list";
  readonly description = "List event labels and their IDs.";

  constructor() {
    super();
    this.argParser.addOption("calendar", {
      help: "Calendar ID (default: primary)",
      valueHelp: "id",
      defaultsTo: "primary",
    });
  }

  override run(): ParsedCommand {
    const args = requireArgResults(this);
    const calendarId = args.option("calendar")?.trim();
    if (!calendarId) {
      this.usageException("--calendar must be a nonempty calendar ID.");
    }
    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }
    return { kind: "labels.list", calendarId };
  }
}
