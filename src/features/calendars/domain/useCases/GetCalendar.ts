import { failure, type Result, type UseCase } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { GetCalendarRequest } from "../models/GetCalendarRequest";
import type { GetCalendarQuery } from "../repoQueries/GetCalendarQuery";

export class GetCalendar
  implements UseCase<GetCalendarRequest, Calendar, EventFailure>
{
  constructor(private readonly query: GetCalendarQuery) {}

  async execute(
    input: GetCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    if (input.calendarId !== undefined && !input.calendarId.trim()) {
      return failure({ type: "VALIDATION", message: "Calendar ID cannot be empty." });
    }

    return this.query.query(input);
  }
}
