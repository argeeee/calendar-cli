import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";

export class EventsCommand extends Command<ParsedCommand> {
  readonly name = "events";
  readonly description = "Commands for calendar events.";

  override run(): null {
    return null;
  }
}
