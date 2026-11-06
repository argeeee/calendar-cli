import { CommandRunner } from "@argetim/arg-parser/command_runner";
import { EventsCommand } from "../commands/EventsCommand";
import { LabelsCommand } from "../commands/LabelsCommand";
import { GetEventCommand } from "../commands/GetEventCommand";
import { CreateEventCommand } from "../commands/CreateEventCommand";
import { ListEventsCommand } from "../commands/ListEventsCommand";
import { UpdateEventCommand } from "../commands/UpdateEventCommand";
import { ListEventLabelsCommand } from "../commands/ListEventLabelsCommand";
import { DeleteEventCommand } from "../commands/DeleteEventCommand";
import type { ParsedCommand } from "../types/ParsedCommand";

export type { ParsedCommand } from "../types/ParsedCommand";

export function createParser(): CommandRunner<ParsedCommand> {
  const runner = new CommandRunner<ParsedCommand>(
    "calendar",
    "Manage calendar events.",
  );
  const events = new EventsCommand();
  events.addSubcommand(new ListEventsCommand());
  events.addSubcommand(new GetEventCommand());
  events.addSubcommand(new CreateEventCommand());
  events.addSubcommand(new UpdateEventCommand());
  events.addSubcommand(new DeleteEventCommand());
  runner.addCommand(events);
  const labels = new LabelsCommand();
  labels.addSubcommand(new ListEventLabelsCommand());
  runner.addCommand(labels);
  return runner;
}

export async function parseArgs(
  tokens: Iterable<string>,
): Promise<ParsedCommand | null> {
  return createParser().run(tokens);
}
