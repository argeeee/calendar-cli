import type { CreateEventRequest } from "../../domain/models/CreateEventRequest";
import type { GoogleEvent } from "../models/GoogleEvent";
import {
  addGoogleEventDays,
  isGoogleEventDateOnly,
} from "../utils/googleEventDate";

export function toGoogleEvent(event: CreateEventRequest["event"]): GoogleEvent {
  const allDay = isGoogleEventDateOnly(event.start);

  return {
    summary: event.title,
    start: allDay ? { date: event.start } : { dateTime: event.start },
    end: allDay
      ? { date: addGoogleEventDays(event.end, 1) }
      : { dateTime: event.end },
    ...(event.description === undefined
      ? {}
      : { description: event.description }),
    ...(event.location === undefined
      ? {}
      : { location: event.location }),
    ...(event.colorId === undefined
      ? {}
      : { colorId: event.colorId || null }),
    ...(event.eventLabelId === undefined
      ? {}
      : { eventLabelId: event.eventLabelId || null }),
  };
}
