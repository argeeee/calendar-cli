import { Command, CommandRunner } from "@argetim/arg-parser/command_runner";
import type { ArgResults } from "@argetim/arg-parser";

export type ParsedEventsCommand =
  | { kind: "events.list"; arguments: ArgResults }
  | { kind: "events.labels.list"; arguments: ArgResults };

class EventsCommand extends Command<ParsedEventsCommand> {
  readonly name = "events";
  readonly description = "Commands for calendar events.";

  override run(): null {
    return null;
  }
}

class ListEventsCommand extends Command<ParsedEventsCommand> {
  readonly name = "list";
  readonly description = "List events.";

  override run(): ParsedEventsCommand {
    return { kind: "events.list", arguments: this.argResults! };
  }
}

class ListEventLabelsCommand extends Command<ParsedEventsCommand> {
  readonly name = "labels";
  readonly description = "List event labels and their IDs.";

  override run(): ParsedEventsCommand {
    return { kind: "events.labels.list", arguments: this.argResults! };
  }
}

export function createParser(): CommandRunner<ParsedEventsCommand> {
  const runner = new CommandRunner<ParsedEventsCommand>(
    "calendar",
    "Manage calendar events.",
  );
  const events = new EventsCommand();

  events.addSubcommand(new ListEventsCommand());
  events.addSubcommand(new ListEventLabelsCommand());
  runner.addCommand(events);

  return runner;
}

export async function parseArgs(
  tokens: Iterable<string>,
): Promise<ParsedEventsCommand | null> {
  return createParser().run(tokens);
}
