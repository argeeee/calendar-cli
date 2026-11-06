import type { calendar_v3 } from "googleapis";
import type { Event } from "../../domain/entities/Event";

export async function resolveGoogleEventLabel(
  calendar: calendar_v3.Calendar,
  event: Omit<Event, "id">,
): Promise<Omit<Event, "id">> {
  if (event.eventLabelId === undefined || event.eventLabelId === "") {
    return event;
  }
  const response = await calendar.calendars.get({ calendarId: "primary" });
  const labels = response.data.labelProperties?.eventLabels ?? [];
  const normalized = event.eventLabelId.trim().toLocaleLowerCase();
  const label = labels.find((candidate) =>
    candidate.id === event.eventLabelId ||
    candidate.name?.trim().toLocaleLowerCase() === normalized
  );
  return label?.id == null ? event : { ...event, eventLabelId: label.id };
}
