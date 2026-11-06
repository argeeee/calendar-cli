import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventError } from "../errors/EventError";
import type { GetEventRequest } from "../models/GetEventRequest";
import type { GetEventQuery } from "../repoQueries/GetEventQuery";

export class GetEvent implements UseCase<GetEventRequest, Event, EventError> {
  constructor(private readonly getEventQuery: GetEventQuery) {}

  execute(input: GetEventRequest): Promise<Result<Event, EventError>> {
    return this.getEventQuery.query(input);
  }
}
