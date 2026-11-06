import type { EventLookup } from "../../../events/domain/models/EventLookup";
import type { CreateEventRequest } from "../../../events/domain/models/CreateEventRequest";

export type ParsedEventsCommand =
  | {
      kind: "events.list";
      from: string;
      to: string;
      limit: number;
      offset: number;
    }
  | { kind: "events.labels.list" }
  | { kind: "events.get"; target: string | EventLookup }
  | ({ kind: "events.create" } & CreateEventRequest);
