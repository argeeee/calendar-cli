import type { RepoQuery, Result } from "../../../../core";
import type { Event } from "../entities/Event";
import type { EventFailure } from "../failures/EventFailure";
import type { GetEventRequest } from "../models/GetEventRequest";

export interface GetEventQuery
  extends RepoQuery<GetEventRequest, Result<Event, EventFailure>> {}
