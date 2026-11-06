import type { EventLookup } from "../../../events/domain/models/EventLookup";
import type { CreateEventRequest } from "../../../events/domain/models/CreateEventRequest";
import type { EventPatch } from "../../../events/domain/models/EventPatch";
import type { CalendarPatch } from "../../../calendars/domain/models/CalendarPatch";
import type { CreateCalendarRequest } from "../../../calendars/domain/models/CreateCalendarRequest";

type EventCommand =
  | {
      kind: "events.list";
      from: string;
      to: string;
      limit: number;
      offset: number;
    }
  | { kind: "labels.list" }
  | { kind: "events.get"; target: string | EventLookup }
  | ({ kind: "events.create" } & CreateEventRequest)
  | { kind: "events.update"; id: string; patch: EventPatch }
  | { kind: "events.delete"; id: string; yes: true };

type CalendarSelection = {
  calendarId?: string;
};

type CalendarCommand =
  | { kind: "calendars.list" }
  | { kind: "calendars.get"; calendarId: string }
  | { kind: "calendars.create"; calendar: CreateCalendarRequest }
  | { kind: "calendars.update"; calendarId: string; patch: CalendarPatch }
  | { kind: "calendars.delete"; calendarId: string; yes: true };

export type ParsedCommand = (EventCommand & CalendarSelection) | CalendarCommand;
