import { Command } from "@argetim/arg-parser/command_runner";
import { createEventInput } from "../../../events/domain/factories/createEventInput";
import { normalizeDate } from "../utils/normalizeDate";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class CreateEventCommand extends Command<ParsedEventsCommand> {
  readonly name = "create";
  readonly description = "Create an event.";

  constructor() {
    super();
    this.argParser.addOption("title", {
      abbr: "t",
      help: "Event title",
      valueHelp: "title",
    });
    this.argParser.addOption("start", {
      abbr: "s",
      help: "Event start",
      valueHelp: "date",
    });
    this.argParser.addOption("end", {
      abbr: "e",
      help: "Event end",
      valueHelp: "date",
    });
    this.argParser.addOption("description", {
      abbr: "d",
      help: "Event description",
      valueHelp: "text",
    });
    this.argParser.addOption("location", {
      abbr: "l",
      help: "Event location",
      valueHelp: "text",
    });
    this.argParser.addOption("color", {
      help: "Event label name or ID",
      valueHelp: "color",
    });
  }

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    const title = args.option("title");
    const startValue = args.option("start");
    const endValue = args.option("end");
    const description = args.option("description");
    const location = args.option("location");
    const color = args.option("color");

    if (title === null || startValue === null || endValue === null) {
      this.usageException("--title, --start, and --end are required.");
    }
    if (color === "") {
      this.usageException("--color must be a nonempty label name or ID.");
    }

    const start = normalizeDate(startValue);
    const end = normalizeDate(endValue);
    if (start === undefined || end === undefined) {
      this.usageException("--start and --end must be valid ISO dates or date-times.");
    }
    if (isDateOnly(start) !== isDateOnly(end)) {
      this.usageException("--start and --end must both be dates or both be date-times.");
    }
    if (args.rest.length > 0) {
      this.usageException("Unexpected positional argument.");
    }

    return {
      kind: "events.create",
      event: createEventInput(
        title,
        start,
        end,
        description ?? undefined,
        location ?? undefined,
        undefined,
        color ?? undefined,
      ),
    };
  }
}

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
