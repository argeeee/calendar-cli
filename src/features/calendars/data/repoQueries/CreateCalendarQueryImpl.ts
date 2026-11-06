import { failure, type Result, success } from "../../../../core";
import type { Calendar } from "../../domain/entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { CreateCalendarRequest } from "../../domain/models/CreateCalendarRequest";
import type { CreateCalendarQuery } from "../../domain/repoQueries/CreateCalendarQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleCalendar } from "../mappers/fromGoogleCalendar";
import { createGoogleCalendarError } from "../mappers/googleCalendarErrorMapper";

export class CreateCalendarQueryImpl implements CreateCalendarQuery {
  constructor(private readonly calendarClient: GoogleCalendarClient) {}

  async query(
    input: CreateCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    const calendar = await this.calendarClient.get();

    if (!calendar.hasValue) {
      return calendar;
    }

    try {
      const response = await calendar.value.calendars.insert({
        requestBody: input,
      });

      return success(fromGoogleCalendar(response.data));
    } catch (error) {
      return failure(createGoogleCalendarError(error));
    }
  }
}
