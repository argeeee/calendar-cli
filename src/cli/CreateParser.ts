import { Command, CommandRunner } from "@argetim/arg-parser/command_runner";
import type { ArgResults } from "@argetim/arg-parser";

export type ParsedEventsCommand =
  | {
      kind: "events.list";
      from: string;
      to: string;
      limit: number;
      offset: number;
    }
  | { kind: "events.labels.list" };

function requireArgResults(command: {
  argResults: ArgResults | undefined;
  name: string;
}): ArgResults {
  if (!command.argResults) {
    throw new Error(`Arguments for "${command.name}" were not parsed.`);
  }

  return command.argResults;
}

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

  constructor() {
    super();
    this.argParser.addOption("from", {
      help:
        "Inclusive range start (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss[.fraction] with Z or ±HH:mm; fraction is 1–3 digits)",
      valueHelp: "date",
      mandatory: true,
    });
    this.argParser.addOption("to", {
      help:
        "Inclusive range end (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss[.fraction] with Z or ±HH:mm; fraction is 1–3 digits)",
      valueHelp: "date",
      mandatory: true,
    });
    this.argParser.addOption("limit", {
      help: "Maximum results (default: 50)",
      valueHelp: "n",
      defaultsTo: "50",
    });
    this.argParser.addOption("offset", {
      help: "Results to skip (default: 0)",
      valueHelp: "n",
      defaultsTo: "0",
    });
  }

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    const from = normalizeDate(args.option("from"));
    const to = normalizeDate(args.option("to"));
    if (from === undefined || to === undefined) {
      this.usageException(
        "--from and --to must be YYYY-MM-DD dates or date-times in YYYY-MM-DDTHH:mm:ss[.fraction]Z or YYYY-MM-DDTHH:mm:ss[.fraction]±HH:mm form (fraction: 1–3 digits).",
      );
    }
    const limit = parseNonnegativeInteger(args.option("limit"));
    const offset = parseNonnegativeInteger(args.option("offset"));
    if (limit === undefined || offset === undefined) {
      this.usageException("--limit and --offset must be nonnegative integers.");
    }

    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }

    return { kind: "events.list", from, to, limit, offset };
  }
}

class ListEventLabelsCommand extends Command<ParsedEventsCommand> {
  readonly name = "labels";
  readonly description = "List event labels and their IDs.";

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }
    return { kind: "events.labels.list" };
  }
}

function normalizeDate(value: string | null): string | undefined {
  if (value === null) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return isValidCalendarDate(value) ? value : undefined;
  } else {
    const match =
      /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-](\d{2}):(\d{2}))$/
        .exec(value);
    if (
      !match || !match[1] || !match[2] || !match[3] || !match[4] ||
      !isValidCalendarDate(match[1])
    ) {
      return undefined;
    }

    const hour = Number(match[2]);
    const minute = Number(match[3]);
    const second = Number(match[4]);
    const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
    const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
    if (
      hour > 23 || minute > 59 || second > 59 || offsetHour > 23 ||
      offsetMinute > 59
    ) {
      return undefined;
    }

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return undefined;
}

function isValidCalendarDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function parseNonnegativeInteger(value: string | null): number | undefined {
  if (value !== null && /^\d+$/.test(value)) {
    const parsed = Number(value);
    if (Number.isSafeInteger(parsed)) return parsed;
  }
  return undefined;
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
