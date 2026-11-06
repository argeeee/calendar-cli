import type { Result, UseCase } from "../../../../core";
import type { EventLabel } from "../models/EventLabel";
import type { EventFailure } from "../failures/EventFailure";
import type { ListEventLabelsRequest } from "../models/ListEventLabelsRequest";
import type { ListEventLabelsQuery } from "../repoQueries/ListEventLabelsQuery";

export class ListEventLabels implements UseCase<ListEventLabelsRequest, EventLabel[], EventFailure> {
  constructor(private readonly listEventLabelsQuery: ListEventLabelsQuery) {}

  execute(input: ListEventLabelsRequest): Promise<Result<EventLabel[], EventFailure>> {
    return this.listEventLabelsQuery.query(input);
  }
}
