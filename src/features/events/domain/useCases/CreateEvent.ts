import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventError } from "../errors/EventError";
import type { CreateEventRequest } from "../models/CreateEventRequest";
import type { CreateEventQuery } from "../repoQueries/CreateEventQuery";

export class CreateEvent implements UseCase<CreateEventRequest, Event, EventError> {
  constructor(private readonly createEventQuery: CreateEventQuery) {}

  execute(input: CreateEventRequest): Promise<Result<Event, EventError>> {
    return this.createEventQuery.query(input);
  }
}
