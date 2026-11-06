import type { RepoQuery, Result } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { DeleteEventRequest } from "../models/DeleteEventRequest";

export interface DeleteEventQuery
  extends RepoQuery<DeleteEventRequest, Result<Event, EventFailure>> {}
