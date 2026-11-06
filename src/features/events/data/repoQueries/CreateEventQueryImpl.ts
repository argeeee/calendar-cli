import { failure, type Result, success } from "../../../../core";
import type { Event } from "../../domain/entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { CreateEventRequest } from "../../domain/models/CreateEventRequest";
import type { CreateEventQuery } from "../../domain/repoQueries/CreateEventQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleEvent } from "../mappers/fromGoogleEvent";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { toGoogleEvent } from "../mappers/toGoogleEvent";
import { isGoogleEventDateOnly } from "../utils/isGoogleEventDateOnly";
import { resolveGoogleEventLabel } from "../utils/resolveGoogleEventLabel";

export class CreateEventQueryImpl implements CreateEventQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: CreateEventRequest,
  ): Promise<Result<Event, EventFailure>> {
    if (
      isGoogleEventDateOnly(request.event.start) !==
        isGoogleEventDateOnly(request.event.end)
    ) {
      return failure({
        type: "VALIDATION",
        message: "--start and --end must both be dates or both be date-times.",
      });
    }
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) {
      return calendar;
    }
    try {
      const event = await resolveGoogleEventLabel(
        calendar.value,
        request.event,
      );
      const response = await calendar.value.events.insert({
        calendarId: "primary",
        requestBody: toGoogleEvent(event),
        ...(event.eventLabelId === undefined ? {} : { eventLabelVersion: 1 }),
      });
      const created = fromGoogleEvent(response.data);
      if (!created) {
        return failure({
          type: "UNEXPECTED",
          message: "Google Calendar returned an incomplete event.",
        });
      }

      return success(created);
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
