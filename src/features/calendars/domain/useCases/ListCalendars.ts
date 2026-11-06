import { type Result, type UseCase } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { ListCalendarsRequest } from "../models/ListCalendarsRequest";
import type { ListCalendarsQuery } from "../repoQueries/ListCalendarsQuery";

export class ListCalendars
  implements UseCase<ListCalendarsRequest, Calendar[], EventFailure>
{
  constructor(private readonly query: ListCalendarsQuery) {}

  async execute(
    input: ListCalendarsRequest,
  ): Promise<Result<Calendar[], EventFailure>> {
    return this.query.query(input);
  }
}
