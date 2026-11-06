import { failure, type Result, success } from "../../../../core";
import type { Calendar } from "../../domain/entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { ListCalendarsRequest } from "../../domain/models/ListCalendarsRequest";
import type { ListCalendarsQuery } from "../../domain/repoQueries/ListCalendarsQuery";
import type { GoogleCalendarClient } from "../../../shared/data/clients/GoogleCalendarClient";
import { fromGoogleCalendar } from "../mappers/fromGoogleCalendar";
import { createGoogleCalendarError } from "../mappers/googleCalendarErrorMapper";

export class ListCalendarsQueryImpl implements ListCalendarsQuery {
  constructor(private readonly calendarClient: GoogleCalendarClient) {}

  async query(
    input: ListCalendarsRequest,
  ): Promise<Result<Calendar[], EventFailure>> {
    const calendar = await this.calendarClient.get();

    if (!calendar.hasValue) {
      return calendar;
    }

    try {
      const calendars: Calendar[] = [];
      let pageToken: string | undefined;

      do {
        const response = await calendar.value.calendarList.list({
          showHidden: true,
          ...(pageToken === undefined ? {} : { pageToken }),
        });

        calendars.push(...(response.data.items ?? []).map(fromGoogleCalendar));
        pageToken = response.data.nextPageToken ?? undefined;
      } while (pageToken);

      return success(calendars);
    } catch (error) {
      return failure(createGoogleCalendarError(error));
    }
  }
}
