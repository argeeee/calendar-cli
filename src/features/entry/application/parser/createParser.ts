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
import { CalendarsCommand } from "../commands/CalendarsCommand";
import { ListCalendarsCommand } from "../commands/ListCalendarsCommand";
import { GetCalendarCommand } from "../commands/GetCalendarCommand";
import { CreateCalendarCommand } from "../commands/CreateCalendarCommand";
import { UpdateCalendarCommand } from "../commands/UpdateCalendarCommand";
import { DeleteCalendarCommand } from "../commands/DeleteCalendarCommand";

export type { ParsedCommand } from "../types/ParsedCommand";

export function createParser(): CommandRunner<ParsedCommand> {
  const runner = new CommandRunner<ParsedCommand>(
    "calendar",
    "Manage calendars and events.",
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
  const calendars = new CalendarsCommand();
  calendars.addSubcommand(new ListCalendarsCommand());
  calendars.addSubcommand(new GetCalendarCommand());
  calendars.addSubcommand(new CreateCalendarCommand());
  calendars.addSubcommand(new UpdateCalendarCommand());
  calendars.addSubcommand(new DeleteCalendarCommand());
  runner.addCommand(calendars);
  return runner;
}

export async function parseArgs(
  tokens: Iterable<string>,
): Promise<ParsedCommand | null> {
  return createParser().run(tokens);
}
