import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../failures/EventFailure";
import type { GetEventRequest } from "../models/GetEventRequest";
import type { GetEventQuery } from "../repoQueries/GetEventQuery";

export class GetEvent
  implements UseCase<GetEventRequest, Event, EventFailure>
{
  constructor(private readonly getEventQuery: GetEventQuery) {}

  execute(input: GetEventRequest): Promise<Result<Event, EventFailure>> {
    return this.getEventQuery.query(input);
  }
}
