import type { calendar_v3 } from "googleapis";
import type { CreateEventRequest } from "../../domain/models/CreateEventRequest";

export async function resolveGoogleEventLabel(
  calendar: calendar_v3.Calendar,
  event: CreateEventRequest["event"],
  calendarId = "primary",
): Promise<CreateEventRequest["event"]> {
  if (event.eventLabelId === undefined || event.eventLabelId === "") {
    return event;
  }
  const response = await calendar.calendars.get({ calendarId });
  const labels = response.data.labelProperties?.eventLabels ?? [];
  const normalized = event.eventLabelId.trim().toLocaleLowerCase();
  const label = labels.find((candidate) => {
    return candidate.id === event.eventLabelId ||
      candidate.name?.trim().toLocaleLowerCase() === normalized;
  });
  return label?.id == null ? event : { ...event, eventLabelId: label.id };
}
