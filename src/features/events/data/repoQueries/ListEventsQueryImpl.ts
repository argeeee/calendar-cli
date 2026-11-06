import { failure, type Result, success } from "../../../../core";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type { EventListResult } from "../../domain/models/EventListResult";
import { createEventListResult } from "../../domain/factories/createEventListResult";
import type { ListEventsRequest } from "../../domain/models/ListEventsRequest";
import type { ListEventsQuery } from "../../domain/repoQueries/ListEventsQuery";
import type { GoogleEventListMethod } from "../models/GoogleEventListMethod";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { fromGoogleEvent } from "../mappers/fromGoogleEvent";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import { toGoogleEventRangeDateTime } from "../utils/toGoogleEventRangeDateTime";

export class ListEventsQueryImpl implements ListEventsQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(
    request: ListEventsRequest,
  ): Promise<Result<EventListResult, EventFailure>> {
    if (request.limit === 0) {
      return success(createEventListResult([], request.limit, request.offset));
    }
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) {
      return calendar;
    }
    try {
      const events = [] as EventListResult["events"];
      let skipped = 0;
      let pageToken: string | undefined;
      do {
        const listEvents = calendar.value.events.list as GoogleEventListMethod;
        const page = await listEvents({
          calendarId: "primary",
          timeMin: toGoogleEventRangeDateTime(request.from, "start"),
          timeMax: toGoogleEventRangeDateTime(request.to, "end"),
          singleEvents: true,
          orderBy: "startTime",
          showDeleted: false,
          maxResults: 2500,
          ...(pageToken === undefined ? {} : { pageToken }),
        });
        for (const item of page.data.items ?? []) {
          const event = fromGoogleEvent(item);
          if (!event) {
            continue;
          }
          if (skipped < request.offset) {
            skipped += 1;
            continue;
          }
          if (events.length < request.limit) {
            events.push(event);
          }
        }
        pageToken = page.data.nextPageToken ?? undefined;
      } while (pageToken && events.length < request.limit);
      return success(
        createEventListResult(events, request.limit, request.offset),
      );
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
