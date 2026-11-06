import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventError } from "../errors/EventError";
import type { UpdateEventRequest } from "../models/UpdateEventRequest";
import type { Event } from "../entities/Event";

export interface UpdateEventQuery extends RepoQuery<UpdateEventRequest, Result<Event, EventError>> {}
