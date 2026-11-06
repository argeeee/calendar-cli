import type { Calendar } from "../../domain/entities/Calendar";
import type { GoogleCalendar } from "../models/GoogleCalendar";

export function fromGoogleCalendar(calendar: GoogleCalendar): Calendar {
  if (!calendar.id) {
    throw new Error("Google Calendar returned a calendar without an ID.");
  }

  return {
    id: calendar.id,
    summary: calendar.summary ?? "",
    ...(calendar.description == null ? {} : { description: calendar.description }),
    ...(calendar.location == null ? {} : { location: calendar.location }),
    ...(calendar.timeZone == null ? {} : { timeZone: calendar.timeZone }),
    ...(calendar.primary == null ? {} : { primary: calendar.primary }),
    ...(calendar.accessRole == null ? {} : { accessRole: calendar.accessRole }),
  };
}
