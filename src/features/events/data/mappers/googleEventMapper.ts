import type { calendar_v3 } from "googleapis";
import type { Event } from "../../domain/entities/Event";
import {
  addGoogleEventDays,
  isGoogleEventDateOnly,
} from "../utils/googleEventDate";

type GoogleEvent = calendar_v3.Schema$Event;

export function toGoogleEvent(event: Omit<Event, "id">): GoogleEvent {
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
    ...(event.location === undefined ? {} : { location: event.location }),
    ...(event.colorId === undefined ? {} : { colorId: event.colorId || null }),
    ...(event.eventLabelId === undefined
      ? {}
      : { eventLabelId: event.eventLabelId || null }),
  };
}

export function fromGoogleEvent(event: GoogleEvent): Event | undefined {
  if (!event.id || event.status === "cancelled" || !event.start || !event.end) {
    return undefined;
  }
  if (event.start.date && event.end.date) {
    return {
      id: event.id,
      title: event.summary ?? "",
      start: event.start.date,
      end: addGoogleEventDays(event.end.date, -1),
      ...(event.description == null ? {} : { description: event.description }),
      ...(event.location == null ? {} : { location: event.location }),
      ...(event.colorId == null ? {} : { colorId: event.colorId }),
      ...(event.eventLabelId == null
        ? {}
        : { eventLabelId: event.eventLabelId }),
    };
  }
  if (!event.start.dateTime || !event.end.dateTime) return undefined;
  return {
    id: event.id,
    title: event.summary ?? "",
    start: event.start.dateTime,
    end: event.end.dateTime,
    ...(event.description == null ? {} : { description: event.description }),
    ...(event.location == null ? {} : { location: event.location }),
    ...(event.colorId == null ? {} : { colorId: event.colorId }),
    ...(event.eventLabelId == null ? {} : { eventLabelId: event.eventLabelId }),
  };
}
