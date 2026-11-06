import { Command } from "@argetim/arg-parser/command_runner";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedCommand } from "../types/ParsedCommand";

export class ListEventLabelsCommand extends Command<ParsedCommand> {
  readonly name = "list";
  readonly description = "List event labels and their IDs.";

  override run(): ParsedCommand {
    const args = requireArgResults(this);
    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }
    return { kind: "labels.list" };
  }
}
