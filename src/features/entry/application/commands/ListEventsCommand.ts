import { Command } from "@argetim/arg-parser/command_runner";
import { normalizeDate } from "../utils/normalizeDate";
import { parseNonnegativeInteger } from "../utils/parseNonnegativeInteger";
import { requireArgResults } from "../utils/requireArgResults";
import type { ParsedEventsCommand } from "../types/ParsedEventsCommand";

export class ListEventsCommand extends Command<ParsedEventsCommand> {
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
