import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { CreateEventRequest } from "../models/CreateEventRequest";
import type { Event } from "../entities/Event";

export interface CreateEventQuery extends RepoQuery<CreateEventRequest, Result<Event, EventFailure>> {}
