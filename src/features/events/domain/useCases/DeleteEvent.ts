import type { Result, UseCase } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { DeleteEventRequest } from "../models/DeleteEventRequest";
import type { DeleteEventQuery } from "../repoQueries/DeleteEventQuery";

export class DeleteEvent
  implements UseCase<DeleteEventRequest, Event, EventFailure>
{
  constructor(private readonly deleteEventQuery: DeleteEventQuery) {}

  execute(input: DeleteEventRequest): Promise<Result<Event, EventFailure>> {
    return this.deleteEventQuery.query(input);
  }
}
