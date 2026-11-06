import type { calendar_v3 } from "googleapis";
import { failure, type Result, success } from "../../../../core";
import type { Event } from "../../domain/entities/Event";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type { GetEventRequest } from "../../domain/models/GetEventRequest";
import type { GetEventQuery } from "../../domain/repoQueries/GetEventQuery";
import type { GoogleEventListMethod } from "../models/GoogleEventListMethod";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { fromGoogleEvent } from "../mappers/fromGoogleEvent";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { toGoogleEventRangeDateTime } from "../utils/toGoogleEventRangeDateTime";

export class GetEventQueryImpl implements GetEventQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: GetEventRequest,
  ): Promise<Result<Event, EventFailure>> {
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) {
      return calendar;
    }
    try {
      if (typeof request.target === "string") {
        const response = await calendar.value.events.get({
          calendarId: "primary",
          eventId: request.target,
        });
        const event = fromGoogleEvent(response.data);
        if (!event) {
          return failure({
            type: "NOT_FOUND",
            message: "The requested calendar event was not found.",
          });
        }

        return success(event);
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
      const match = matches[0];
      if (!match) {
        return failure({
          type: "NOT_FOUND",
          message: "No event matched that title in the requested range.",
        });
      }

      return success(match);
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
      const listEvents = calendar.events.list as GoogleEventListMethod;
      const page = await listEvents({
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
        if (event?.title === title) {
          matches.push(event);
        }
      }
      pageToken = page.data.nextPageToken ?? undefined;
    } while (pageToken && matches.length < 2);
    return matches;
  }
}
