import { failure, type Result, type UseCase } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { DeleteCalendarRequest } from "../models/DeleteCalendarRequest";
import type { DeleteCalendarQuery } from "../repoQueries/DeleteCalendarQuery";

export class DeleteCalendar
  implements UseCase<DeleteCalendarRequest, Calendar, EventFailure>
{
  constructor(private readonly query: DeleteCalendarQuery) {}

  async execute(
    input: DeleteCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    if ((input.calendarId ?? "primary").trim().toLowerCase() === "primary") {
      return failure({
        type: "VALIDATION",
        message: "The primary calendar cannot be deleted.",
      });
    }

    if (input.calendarId !== undefined && !input.calendarId.trim()) {
      return failure({ type: "VALIDATION", message: "Calendar ID cannot be empty." });
    }

    return this.query.query(input);
  }
}
