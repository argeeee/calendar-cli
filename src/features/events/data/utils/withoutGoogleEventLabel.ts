import type { CreateEventRequest } from "../../domain/models/CreateEventRequest";

export function withoutGoogleEventLabel(
  event: CreateEventRequest["event"],
): CreateEventRequest["event"] {
  const { eventLabelId: _eventLabelId, ...withoutLabel } = event;
  return withoutLabel;
}
