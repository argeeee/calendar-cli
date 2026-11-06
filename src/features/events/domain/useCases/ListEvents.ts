import type { Result, UseCase } from "../../../../core";
import type { EventListResult } from "../models/EventListResult";
import type { EventFailure } from "../failures/EventFailure";
import type { ListEventsRequest } from "../models/ListEventsRequest";
import type { ListEventsQuery } from "../repoQueries/ListEventsQuery";

export class ListEvents implements UseCase<ListEventsRequest, EventListResult, EventFailure> {
  constructor(private readonly listEventsQuery: ListEventsQuery) {}

  execute(input: ListEventsRequest): Promise<Result<EventListResult, EventFailure>> {
    return this.listEventsQuery.query(input);
  }
}
