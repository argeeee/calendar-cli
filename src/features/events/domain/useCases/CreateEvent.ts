import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../failures/EventFailure";
import type { CreateEventRequest } from "../models/CreateEventRequest";
import type { CreateEventQuery } from "../repoQueries/CreateEventQuery";

export class CreateEvent
  implements UseCase<CreateEventRequest, Event, EventFailure>
{
  constructor(private readonly createEventQuery: CreateEventQuery) {}

  execute(input: CreateEventRequest): Promise<Result<Event, EventFailure>> {
    return this.createEventQuery.query(input);
  }
}
