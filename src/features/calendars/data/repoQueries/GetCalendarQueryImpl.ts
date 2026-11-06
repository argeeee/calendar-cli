import { failure, type Result, success } from "../../../../core";
import type { Calendar } from "../../domain/entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { GetCalendarRequest } from "../../domain/models/GetCalendarRequest";
import type { GetCalendarQuery } from "../../domain/repoQueries/GetCalendarQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleCalendar } from "../mappers/fromGoogleCalendar";
import { createGoogleCalendarError } from "../mappers/googleCalendarErrorMapper";

export class GetCalendarQueryImpl implements GetCalendarQuery {
  constructor(private readonly calendarClient: GoogleCalendarClient) {}

  async query(
    input: GetCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    const calendar = await this.calendarClient.get();

    if (!calendar.hasValue) {
      return calendar;
    }

    try {
      const calendarId = input.calendarId ?? "primary";
      const response = await calendar.value.calendars.get({ calendarId });
      const entity = fromGoogleCalendar(response.data);

      if (calendarId === "primary") {
        entity.primary = true;
      }

      return success(entity);
    } catch (error) {
      return failure(createGoogleCalendarError(error));
    }
  }
}
