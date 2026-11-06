import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventError } from "../errors/EventError";
import type { DeleteEventRequest } from "../models/DeleteEventRequest";
import type { DeleteEventQuery } from "../repoQueries/DeleteEventQuery";

export class DeleteEvent implements UseCase<DeleteEventRequest, Event, EventError> {
  constructor(private readonly deleteEventQuery: DeleteEventQuery) {}

  execute(input: DeleteEventRequest): Promise<Result<Event, EventError>> {
    return this.deleteEventQuery.query(input);
  }
}
