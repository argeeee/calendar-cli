import type { Result, UseCase } from "../../../../core";
import type { EventLabel } from "../models/EventLabel";
import type { EventError } from "../errors/EventError";
import type { ListEventLabelsRequest } from "../models/ListEventLabelsRequest";
import type { ListEventLabelsQuery } from "../repoQueries/ListEventLabelsQuery";

export class ListEventLabels implements UseCase<ListEventLabelsRequest, EventLabel[], EventError> {
  constructor(private readonly listEventLabelsQuery: ListEventLabelsQuery) {}

  execute(input: ListEventLabelsRequest): Promise<Result<EventLabel[], EventError>> {
    return this.listEventLabelsQuery.query(input);
  }
}
