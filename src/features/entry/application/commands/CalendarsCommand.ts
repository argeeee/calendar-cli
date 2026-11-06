import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedCommand } from "../types/ParsedCommand";

export class CalendarsCommand extends Command<ParsedCommand> {
  readonly name = "calendars";
  readonly description = "Commands for calendars.";

  override run(): null {
    return null;
  }
}
