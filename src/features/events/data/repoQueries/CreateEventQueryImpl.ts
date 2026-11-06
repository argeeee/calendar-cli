import type {
  CreateEventQuery,
} from "../../domain/repoQueries/CreateEventQuery";
import { failure, type Result, success } from "../../../../core";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { isGoogleEventDateOnly } from "../utils/googleEventDate";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import {
  fromGoogleEvent,
  toGoogleEvent,
} from "../mappers/googleEventMapper";
import { resolveGoogleEventLabel } from "../utils/resolveGoogleEventLabel";
import type { Event } from "../../domain/entities/Event";
import type { EventError } from "../../domain/errors/EventError";
import type {
  CreateEventRequest,
} from "../../domain/models/CreateEventRequest";

export class CreateEventQueryImpl implements CreateEventQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: CreateEventRequest,
  ): Promise<Result<Event, EventError>> {
    if (
      isGoogleEventDateOnly(request.event.start) !==
        isGoogleEventDateOnly(request.event.end)
    ) {
      return failure({
        kind: "validation",
        message: "--start and --end must both be dates or both be date-times.",
      });
    }
    const calendar = await this.calendarClient.get(
      request.event.eventLabelId !== undefined,
    );
    if (!calendar.hasValue) return calendar;
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
      return created ? success(created) : failure({
        kind: "unexpected",
        message: "Google Calendar returned an incomplete event.",
      });
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
