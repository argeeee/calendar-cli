import { failure, type Result, type UseCase } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { UpdateCalendarRequest } from "../models/UpdateCalendarRequest";
import type { UpdateCalendarQuery } from "../repoQueries/UpdateCalendarQuery";

export class UpdateCalendar
  implements UseCase<UpdateCalendarRequest, Calendar, EventFailure>
{
  constructor(private readonly query: UpdateCalendarQuery) {}

  async execute(
    input: UpdateCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    if (Object.keys(input.patch).length === 0) {
      return failure({ type: "VALIDATION", message: "Provide a calendar field to update." });
    }

    if (input.patch.summary !== undefined && !input.patch.summary.trim()) {
      return failure({ type: "VALIDATION", message: "Calendar summary is required." });
    }

    if (input.calendarId !== undefined && !input.calendarId.trim()) {
      return failure({ type: "VALIDATION", message: "Calendar ID cannot be empty." });
    }

    return this.query.query(input);
  }
}
