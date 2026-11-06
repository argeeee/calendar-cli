import type {
  GetEventQuery,
} from "../../domain/repoQueries/GetEventQuery";
import type { calendar_v3 } from "googleapis";
import { failure, type Result, success } from "../../../../core";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { toGoogleEventRangeDateTime } from "../utils/toGoogleEventRangeDateTime";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { fromGoogleEvent } from "../mappers/fromGoogleEvent";
import type { Event } from "../../domain/entities/Event";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type { GetEventRequest } from "../../domain/models/GetEventRequest";

export class GetEventQueryImpl implements GetEventQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: GetEventRequest,
  ): Promise<Result<Event, EventFailure>> {
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) return calendar;
    try {
      if (typeof request.target === "string") {
        const event = fromGoogleEvent(
          (await calendar.value.events.get({
            calendarId: "primary",
            eventId: request.target,
          })).data,
        );
        return event ? success(event) : failure({
          type: "NOT_FOUND",
          message: "The requested calendar event was not found.",
        });
      }
      const matches = await this.findByTitle(
        calendar.value,
        request.target.title,
        request.target.from,
        request.target.to,
      );
      if (matches.length === 0) {
        return failure({
          type: "NOT_FOUND",
          message: "No event matched that title in the requested range.",
        });
      }
      if (matches.length > 1) {
        return failure({
          type: "AMBIGUOUS",
          message:
            "More than one event matched that title. Narrow the range or use " +
              "--id.",
        });
      }
      return matches[0] ? success(matches[0]) : failure({
        type: "NOT_FOUND",
        message: "No event matched that title in the requested range.",
      });
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }

  private async findByTitle(
    calendar: calendar_v3.Calendar,
    title: string,
    from: string,
    to: string,
  ): Promise<Event[]> {
    const matches: Event[] = [];
    let pageToken: string | undefined;
    do {
      const page = await (calendar.events.list as (params: calendar_v3.Params$Resource$Events$List) => Promise<{ data: calendar_v3.Schema$Events }> )({
        calendarId: "primary",
        timeMin: toGoogleEventRangeDateTime(from, "start"),
        timeMax: toGoogleEventRangeDateTime(to, "end"),
        singleEvents: true,
        orderBy: "startTime",
        showDeleted: false,
        maxResults: 2500,
        ...(pageToken === undefined ? {} : { pageToken }),
      });
      for (const item of page.data.items ?? []) {
        const event = fromGoogleEvent(item);
        if (event?.title === title) matches.push(event);
      }
      pageToken = page.data.nextPageToken ?? undefined;
    } while (pageToken && matches.length < 2);
    return matches;
  }
}
