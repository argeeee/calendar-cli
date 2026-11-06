import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventError } from "../errors/EventError";
import type { CreateEventRequest } from "../models/CreateEventRequest";
import type { Event } from "../entities/Event";

export interface CreateEventQuery extends RepoQuery<CreateEventRequest, Result<Event, EventError>> {}
