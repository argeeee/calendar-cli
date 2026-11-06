import { failure, type Result, type UseCase } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { CreateCalendarRequest } from "../models/CreateCalendarRequest";
import type { CreateCalendarQuery } from "../repoQueries/CreateCalendarQuery";

export class CreateCalendar
  implements UseCase<CreateCalendarRequest, Calendar, EventFailure>
{
  constructor(private readonly query: CreateCalendarQuery) {}

  async execute(
    input: CreateCalendarRequest,
  ): Promise<Result<Calendar, EventFailure>> {
    if (!input.summary.trim()) {
      return failure({ type: "VALIDATION", message: "Calendar summary is required." });
    }

    return this.query.query(input);
  }
}
