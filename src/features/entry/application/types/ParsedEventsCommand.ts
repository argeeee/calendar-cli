import type { EventLookup } from "../../../events/domain/models/EventLookup";

export type ParsedEventsCommand =
  | {
      kind: "events.list";
      from: string;
      to: string;
      limit: number;
      offset: number;
    }
  | { kind: "events.labels.list" }
  | { kind: "events.get"; target: string | EventLookup };
