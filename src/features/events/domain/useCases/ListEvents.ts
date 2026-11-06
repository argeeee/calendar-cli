import type { Result, UseCase } from "../../../../core";
import type { EventListResult } from "../models/EventListResult";
import type { EventError } from "../errors/EventError";
import type { ListEventsRequest } from "../models/ListEventsRequest";
import type { ListEventsQuery } from "../repoQueries/ListEventsQuery";

export class ListEvents implements UseCase<ListEventsRequest, EventListResult, EventError> {
  constructor(private readonly listEventsQuery: ListEventsQuery) {}

  execute(input: ListEventsRequest): Promise<Result<EventListResult, EventError>> {
    return this.listEventsQuery.query(input);
  }
}
