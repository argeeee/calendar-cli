import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventError } from "../errors/EventError";
import type { UpdateEventRequest } from "../models/UpdateEventRequest";
import type { UpdateEventQuery } from "../repoQueries/UpdateEventQuery";

export class UpdateEvent implements UseCase<UpdateEventRequest, Event, EventError> {
  constructor(private readonly updateEventQuery: UpdateEventQuery) {}

  execute(input: UpdateEventRequest): Promise<Result<Event, EventError>> {
    return this.updateEventQuery.query(input);
  }
}
