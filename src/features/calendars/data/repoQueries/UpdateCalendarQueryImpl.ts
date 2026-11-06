import { failure, type Result, success } from "../../../../core";
import type { Calendar } from "../../domain/entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { UpdateCalendarRequest } from "../../domain/models/UpdateCalendarRequest";
import type { UpdateCalendarQuery } from "../../domain/repoQueries/UpdateCalendarQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleCalendar } from "../mappers/fromGoogleCalendar";
import { createGoogleCalendarError } from "../mappers/googleCalendarErrorMapper";

export class UpdateCalendarQueryImpl implements UpdateCalendarQuery {
  constructor(private readonly calendarClient: GoogleCalendarClient) {}

  async query(
    input: UpdateCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    const calendar = await this.calendarClient.get();

    if (!calendar.hasValue) {
      return calendar;
    }

    try {
      const response = await calendar.value.calendars.patch({
        calendarId: input.calendarId ?? "primary",
        requestBody: input.patch,
      });

      return success(fromGoogleCalendar(response.data));
    } catch (error) {
      return failure(createGoogleCalendarError(error));
    }
  }
}
