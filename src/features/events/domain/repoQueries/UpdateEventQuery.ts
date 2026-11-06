import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { UpdateEventRequest } from "../models/UpdateEventRequest";
import type { Event } from "../entities/Event";

export interface UpdateEventQuery extends RepoQuery<UpdateEventRequest, Result<Event, EventFailure>> {}
