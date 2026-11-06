import { CommandRunner } from "@argetim/arg-parser/command_runner";
import { EventsCommand } from "../commands/EventsCommand";
import { GetEventCommand } from "../commands/GetEventCommand";
import { CreateEventCommand } from "../commands/CreateEventCommand";
import { ListEventsCommand } from "../commands/ListEventsCommand";
import { UpdateEventCommand } from "../commands/UpdateEventCommand";
import { ListEventLabelsCommand } from "../commands/ListEventLabelsCommand";
import { DeleteEventCommand } from "../commands/DeleteEventCommand";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export function createParser(): CommandRunner<ParsedEventsCommand> {
  const runner = new CommandRunner<ParsedEventsCommand>(
    "calendar",
    "Manage calendar events.",
  );
  const events = new EventsCommand();
  events.addSubcommand(new ListEventsCommand());
  events.addSubcommand(new GetEventCommand());
  events.addSubcommand(new CreateEventCommand());
  events.addSubcommand(new ListEventLabelsCommand());
  events.addSubcommand(new UpdateEventCommand());
  events.addSubcommand(new DeleteEventCommand());
  runner.addCommand(events);
  return runner;
}

export async function parseArgs(
  tokens: Iterable<string>,
): Promise<ParsedEventsCommand | null> {
  return createParser().run(tokens);
}
