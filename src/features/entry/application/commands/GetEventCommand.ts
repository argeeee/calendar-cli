import { Command } from "@argetim/arg-parser/command_runner";
import type { EventLookup } from "../../../events/domain/models/EventLookup";
import { normalizeDate } from "../utils/normalizeDate";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedCommand } from "../types/ParsedCommand";

export class GetEventCommand extends Command<ParsedCommand> {
  readonly name = "get";
  readonly description = "Get one event.";

  constructor() {
    super();
    this.argParser.addOption("calendar", {
      help: "Calendar ID (default: primary)",
      valueHelp: "id",
      defaultsTo: "primary",
    });
    this.argParser.addOption("id", {
      help: "Event ID",
      valueHelp: "id",
    });
    this.argParser.addOption("title", {
      abbr: "t",
      help: "Lookup title",
      valueHelp: "title",
    });
    this.argParser.addOption("from", {
      help: "Lookup range start",
      valueHelp: "date",
    });
    this.argParser.addOption("to", {
      help: "Lookup range end",
      valueHelp: "date",
    });
  }

  override run(): ParsedCommand {
    const args = requireArgResults(this);
    const calendarId = args.option("calendar")?.trim();
    if (!calendarId) {
      this.usageException("--calendar must be a nonempty calendar ID.");
    }
    const id = args.option("id");
    const title = args.option("title");
    const fromValue = args.option("from");
    const toValue = args.option("to");
    const hasLookup =
      title !== null || fromValue !== null || toValue !== null;

    if (id !== null || args.rest.length > 0) {
      if (args.rest.length > 1 || (id !== null && args.rest.length > 0)) {
        this.usageException("Provide one event ID using --id or a positional argument.");
      }
      if (hasLookup) {
        this.usageException("Use either an ID or lookup options, not both.");
      }
      const target = id ?? args.rest[0];
      if (target === undefined || target.length === 0) {
        this.usageException("An event ID is required.");
      }
      return { kind: "events.get", calendarId, target };
    }

    if (title === null || fromValue === null || toValue === null) {
      this.usageException("Provide --id or --title, --from, and --to.");
    }

    const from = normalizeDate(fromValue);
    const to = normalizeDate(toValue);
    if (from === undefined || to === undefined) {
      this.usageException("Lookup dates must be valid ISO dates or date-times.");
    }

    const lookup: EventLookup = { title, from, to };
    return { kind: "events.get", calendarId, target: lookup };
  }
}
