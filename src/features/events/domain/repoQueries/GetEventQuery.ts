import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { GetEventRequest } from "../models/GetEventRequest";
import type { Event } from "../entities/Event";

export interface GetEventQuery extends RepoQuery<GetEventRequest, Result<Event, EventFailure>> {}
