import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { UpdateEventRequest } from "../models/UpdateEventRequest";
import type { UpdateEventQuery } from "../repoQueries/UpdateEventQuery";

export class UpdateEvent
  implements UseCase<UpdateEventRequest, Event, EventFailure>
{
  constructor(private readonly updateEventQuery: UpdateEventQuery) {}

  execute(input: UpdateEventRequest): Promise<Result<Event, EventFailure>> {
    return this.updateEventQuery.query(input);
  }
}
