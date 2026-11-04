import { Command } from "@argetim/arg-parser/command_runner";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class ListEventLabelsCommand extends Command<ParsedEventsCommand> {
  readonly name = "labels";
  readonly description = "List event labels and their IDs.";

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }
    return { kind: "events.labels.list" };
  }
}
