import type {
  ListEventLabelsQuery,
} from "../../domain/repoQueries/ListEventLabelsQuery";
import { failure, type Result, success } from "../../../../core";
import type { GoogleCalendarClient } from "../clients/GoogleCalendarClient";
import { createGoogleEventError } from "../mappers/googleEventErrorMapper";
import type { EventFailure } from "../../domain/failures/EventFailure";
import type { ListEventLabelsRequest } from "../../domain/models/ListEventLabelsRequest";
import type { EventLabel } from "../../domain/models/EventLabel";

export class ListEventLabelsQueryImpl implements ListEventLabelsQuery {
  public constructor(private readonly calendarClient: GoogleCalendarClient) {}

  public async query(_input: ListEventLabelsRequest): Promise<Result<EventLabel[], EventFailure>> {
    const calendar = await this.calendarClient.get();
    if (!calendar.hasValue) return calendar;
    try {
      const response = await calendar.value.calendars.get({
        calendarId: "primary",
      });
      const labels = (response.data.labelProperties?.eventLabels ?? []).flatMap(
        (label): EventLabel[] =>
          label.id == null || label.backgroundColor == null ? [] : [{
            id: label.id,
            ...(label.name == null ? {} : { name: label.name }),
            backgroundColor: label.backgroundColor,
          }],
      );
      return success(labels);
    } catch (error) {
      return failure(createGoogleEventError(error));
    }
  }
}
