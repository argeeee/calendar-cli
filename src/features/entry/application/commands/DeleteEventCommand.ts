import { Command } from "@argetim/arg-parser/command_runner";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class DeleteEventCommand extends Command<ParsedEventsCommand> {
  readonly name = "delete";
  readonly description = "Delete an event by ID.";

  constructor() {
    super();
    this.argParser.addOption("id", {
      help: "Event ID",
      valueHelp: "id",
    });
    this.argParser.addFlag("yes", {
      help: "Confirm deletion",
    });
  }

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    const optionId = args.option("id");
    const [positionalId, ...unexpected] = args.rest;
    const id = optionId ?? positionalId;

    if (id === undefined || id === "") {
      this.usageException("An event ID is required with --id or as a positional argument.");
    }
    if (optionId !== null && positionalId !== undefined) {
      this.usageException("Specify the event ID either with --id or as a positional argument.");
    }
    if (unexpected.length > 0) {
      this.usageException("Unexpected positional argument.");
    }
    if (!args.flag("yes")) {
      this.usageException("Deletion requires --yes.");
    }

    return {
      kind: "events.delete",
      id,
      yes: true,
    };
  }
}
