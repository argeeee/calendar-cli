import type { Event } from "../../domain/entities/Event";

export function withoutGoogleEventLabel(
  event: Omit<Event, "id">,
): Omit<Event, "id"> {
  const { eventLabelId: _eventLabelId, ...withoutLabel } = event;
  return withoutLabel;
}
