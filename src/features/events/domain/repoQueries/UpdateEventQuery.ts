import type { RepoQuery, Result } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { UpdateEventRequest } from "../models/UpdateEventRequest";

export interface UpdateEventQuery
  extends RepoQuery<UpdateEventRequest, Result<Event, EventFailure>> {}
