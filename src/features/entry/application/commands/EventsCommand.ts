import { Command } from "@argetim/arg-parser/command_runner";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class EventsCommand extends Command<ParsedEventsCommand> {
  readonly name = "events";
  readonly description = "Commands for calendar events.";

  override run(): null {
    return null;
  }
}
