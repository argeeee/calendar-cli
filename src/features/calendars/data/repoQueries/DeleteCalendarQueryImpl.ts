import { failure, type Result, success } from "../../../../core";
import type { Calendar } from "../../domain/entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { DeleteCalendarRequest } from "../../domain/models/DeleteCalendarRequest";
import type { DeleteCalendarQuery } from "../../domain/repoQueries/DeleteCalendarQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleCalendar } from "../mappers/fromGoogleCalendar";
import { createGoogleCalendarError } from "../mappers/googleCalendarErrorMapper";

export class DeleteCalendarQueryImpl implements DeleteCalendarQuery {
  constructor(private readonly calendarClient: GoogleCalendarClient) {}

  async query(
    input: DeleteCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    const calendar = await this.calendarClient.get();

    if (!calendar.hasValue) {
      return calendar;
    }

    try {
      const calendarId = input.calendarId ?? "primary";

      if (calendarId.trim().toLowerCase() === "primary") {
        return failure({
          type: "VALIDATION",
          message: "The primary calendar cannot be deleted.",
        });
      }

      const primary = await calendar.value.calendars.get({
        calendarId: "primary",
      });
      if (!primary.data.id) {
        return failure({
          type: "UNEXPECTED",
          message: "Could not identify the primary calendar safely.",
        });
      }

      const target = await calendar.value.calendars.get({ calendarId });
      const existing = fromGoogleCalendar(target.data);

      if (calendarId === primary.data.id || existing.id === primary.data.id) {
        return failure({
          type: "VALIDATION",
          message: "The primary calendar cannot be deleted.",
        });
      }

      await calendar.value.calendars.delete({ calendarId: existing.id });

      return success(existing);
    } catch (error) {
      return failure(createGoogleCalendarError(error));
    }
  }
}
