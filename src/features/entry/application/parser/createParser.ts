import { CommandRunner } from "@argetim/arg-parser/command_runner";
import { EventsCommand } from "../commands/EventsCommand";
import { GetEventCommand } from "../commands/GetEventCommand";
import { ListEventsCommand } from "../commands/ListEventsCommand";
import { ListEventLabelsCommand } from "../commands/ListEventLabelsCommand";
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
  events.addSubcommand(new ListEventLabelsCommand());
  runner.addCommand(events);
  return runner;
}

export async function parseArgs(
  tokens: Iterable<string>,
): Promise<ParsedEventsCommand | null> {
  return createParser().run(tokens);
}
