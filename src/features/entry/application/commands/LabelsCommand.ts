import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";

export class LabelsCommand extends Command<ParsedCommand> {
  readonly name = "labels";
  readonly description = "Commands for event labels.";

  override run(): null {
    return null;
  }
}
