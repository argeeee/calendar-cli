import type { RepoQuery, Result } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { CreateEventRequest } from "../models/CreateEventRequest";

export interface CreateEventQuery
  extends RepoQuery<CreateEventRequest, Result<Event, EventFailure>> {}
