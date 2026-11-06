import type {
  UpdateEventQuery,
} from "../../domain/repoQueries/UpdateEventQuery";
import { failure, type Result, success } from "../../../../core";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { isGoogleEventDateOnly } from "../utils/isGoogleEventDateOnly";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { fromGoogleEvent } from "../mappers/fromGoogleEvent";
import { toGoogleEvent } from "../mappers/toGoogleEvent";
import { resolveGoogleEventLabel } from "../utils/resolveGoogleEventLabel";
import { withoutGoogleEventLabel } from "../utils/withoutGoogleEventLabel";
import type { Event } from "../../domain/entities/Event";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type {
  UpdateEventRequest,
} from "../../domain/models/UpdateEventRequest";

export class UpdateEventQueryImpl implements UpdateEventQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: UpdateEventRequest,
  ): Promise<Result<Event, EventFailure>> {
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) return calendar;
    try {
      const current = fromGoogleEvent(
        (await calendar.value.events.get({
          calendarId: "primary",
          eventId: request.id,
        })).data,
      );
      if (!current) {
        return failure({
          type: "NOT_FOUND",
          message: "The requested calendar event was not found.",
        });
      }
      const start = request.patch.start ?? current.start;
      const end = request.patch.end ?? current.end;
      if (isGoogleEventDateOnly(start) !== isGoogleEventDateOnly(end)) {
        return failure({
          type: "VALIDATION",
          message:
            "Changing between all-day and timed events requires both --start " +
              "and --end.",
        });
      }
      const replacesCustomLabel = request.patch.colorId !== undefined &&
        current.eventLabelId !== undefined;
      if (replacesCustomLabel) {
        await calendar.value.events.patch({
          calendarId: "primary",
          eventId: request.id,
          eventLabelVersion: 1,
          requestBody: { eventLabelId: "" },
        });
      }
      const merged = { ...current, ...request.patch, start, end };
      const event = request.patch.colorId === undefined
        ? await resolveGoogleEventLabel(calendar.value, merged)
        : withoutGoogleEventLabel(merged);
      const response = await calendar.value.events.patch({
        calendarId: "primary",
        eventId: request.id,
        requestBody: toGoogleEvent(event),
        ...(event.eventLabelId === undefined ? {} : { eventLabelVersion: 1 }),
      });
      const updated = fromGoogleEvent(response.data);
      return updated ? success(updated) : failure({
        type: "UNEXPECTED",
        message: "Google Calendar returned an incomplete event.",
      });
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
