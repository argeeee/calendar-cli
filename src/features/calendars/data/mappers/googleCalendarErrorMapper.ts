import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import { createGoogleEventError } from "../../../events/data/mappers/googleEventErrorMapper";

export function createGoogleCalendarError(error: unknown): EventFailure {
  const mapped = createGoogleEventError(error);

  if (mapped.type === "NOT_FOUND") {
    return { type: "NOT_FOUND", message: "The requested calendar was not found." };
  }

  if (mapped.type === "VALIDATION") {
    return {
      type: "VALIDATION",
      message: "Google Calendar rejected this calendar request. Check the calendar values.",
    };
  }

  return mapped;
}
