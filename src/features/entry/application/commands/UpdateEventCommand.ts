import { Command } from "@argetim/arg-parser/command_runner";
import { createEventPatch } from "../../../events/domain/factories/createEventPatch";
import type { EventPatch } from "../../../events/domain/models/EventPatch";
import { isDateOnly } from "../utils/isDateOnly";
import { normalizeDate } from "../utils/normalizeDate";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class UpdateEventCommand extends Command<ParsedEventsCommand> {
  readonly name = "update";
  readonly description = "Update an event by ID.";

  constructor() {
    super();
    this.argParser.addOption("id", { help: "Event ID", valueHelp: "id" });
    this.argParser.addOption("title", {
      abbr: "t",
      help: "Replacement title",
      valueHelp: "title",
    });
    this.argParser.addOption("start", {
      abbr: "s",
      help: "Replacement start",
      valueHelp: "date",
    });
    this.argParser.addOption("end", {
      abbr: "e",
      help: "Replacement end",
      valueHelp: "date",
    });
    this.argParser.addOption("description", {
      abbr: "d",
      help: "Replacement description (empty clears it)",
      valueHelp: "text",
    });
    this.argParser.addOption("location", {
      abbr: "l",
      help: "Replacement location (empty clears it)",
      valueHelp: "text",
    });
    this.argParser.addOption("color", {
      help: "Replacement event label name or ID (empty clears it)",
      valueHelp: "color",
    });
  }

  override run(): ParsedEventsCommand {
    const args = requireArgResults(this);
    const optionId = args.option("id");
    const [positionalId, ...unexpected] = args.rest;
    const id = optionId ?? positionalId;
    if (id === undefined || id === "") {
      this.usageException("An event ID is required with --id or as a positional argument.");
    }
    if (optionId !== null && positionalId !== undefined) {
      this.usageException("Specify the event ID either with --id or as a positional argument.");
    }
    if (unexpected.length > 0) {
      this.usageException("Unexpected positional argument.");
    }

    const patch: EventPatch = {};
    const title = args.option("title");
    const description = args.option("description");
    const location = args.option("location");
    const color = args.option("color");
    if (title !== null) {
      patch.title = title;
    }
    if (description !== null) {
      patch.description = description;
    }
    if (location !== null) {
      patch.location = location;
    }
    if (color !== null) {
      patch.eventLabelId = color;
    }

    const startValue = args.option("start");
    const endValue = args.option("end");
    const start = normalizeDate(startValue);
    const end = normalizeDate(endValue);
    if (startValue !== null && start === undefined) {
      this.usageException("--start must be a valid ISO date or date-time.");
    }
    if (endValue !== null && end === undefined) {
      this.usageException("--end must be a valid ISO date or date-time.");
    }
    if (start !== undefined) patch.start = start;
    if (end !== undefined) patch.end = end;
    if (
      start !== undefined && end !== undefined &&
      isDateOnly(start) !== isDateOnly(end)
    ) {
      this.usageException("--start and --end must both be dates or both be date-times.");
    }
    if (Object.keys(patch).length === 0) {
      this.usageException("At least one update option is required.");
    }

    return {
      kind: "events.update",
      id,
      patch: createEventPatch(patch),
    };
  }
}
