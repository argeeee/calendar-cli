import type {
  DeleteEventQuery,
} from "../../domain/repoQueries/DeleteEventQuery";
import { failure, type Result } from "../../../../core";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { GetEventQueryImpl } from "./GetEventQueryImpl";
import type { Event } from "../../domain/entities/Event";
import type { EventError } from "../../domain/errors/EventError";
import type {
  DeleteEventRequest,
} from "../../domain/models/DeleteEventRequest";

export class DeleteEventQueryImpl implements DeleteEventQuery {
  public constructor(
    private readonly calendarClient: GoogleCalendarClient,
    private readonly getEvent: GetEventQueryImpl,
  ) {}

  public async query(
    request: DeleteEventRequest,
  ): Promise<Result<Event, EventError>> {
    const existing = await new GetEventQueryImpl(this.calendarClient).query({ target: request.id });
    if (!existing.hasValue) return existing;
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) return calendar;
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
