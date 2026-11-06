import { failure, type Result } from "../../../../core";
import type { Event } from "../../domain/entities/Event";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type { DeleteEventRequest } from "../../domain/models/DeleteEventRequest";
import type { DeleteEventQuery } from "../../domain/repoQueries/DeleteEventQuery";
import type { GetEventQuery } from "../../domain/repoQueries/GetEventQuery";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";

export class DeleteEventQueryImpl implements DeleteEventQuery {
  public constructor(
    private readonly calendarClient: GoogleCalendarClient,
    private readonly getEvent: GetEventQuery,
  ) {}

  public async query(
    request: DeleteEventRequest,
  ): Promise<Result<Event, EventFailure>> {
    const existing = await this.getEvent.query({ target: request.id });
    if (!existing.hasValue) {
      return existing;
    }
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) {
      return calendar;
    }
    try {
      await calendar.value.events.delete({
        calendarId: "primary",
        eventId: request.id,
      });
      return existing;
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
