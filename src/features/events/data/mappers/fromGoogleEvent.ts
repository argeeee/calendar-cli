import type { Event } from "../../domain/entities/Event";
import type { GoogleEvent } from "../models/GoogleEvent";
import { addGoogleEventDays } from "../utils/googleEventDate";

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
      ...(event.description == null
        ? {}
        : { description: event.description }),
      ...(event.location == null ? {} : { location: event.location }),
      ...(event.colorId == null ? {} : { colorId: event.colorId }),
      ...(event.eventLabelId == null
        ? {}
        : { eventLabelId: event.eventLabelId }),
    };
  }

  if (!event.start.dateTime || !event.end.dateTime) {
    return undefined;
  }

  return {
    id: event.id,
    title: event.summary ?? "",
    start: event.start.dateTime,
    end: event.end.dateTime,
    ...(event.description == null
      ? {}
      : { description: event.description }),
    ...(event.location == null ? {} : { location: event.location }),
    ...(event.colorId == null ? {} : { colorId: event.colorId }),
    ...(event.eventLabelId == null
      ? {}
      : { eventLabelId: event.eventLabelId }),
  };
}
