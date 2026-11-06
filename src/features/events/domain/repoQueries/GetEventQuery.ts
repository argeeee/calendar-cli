import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventError } from "../errors/EventError";
import type { GetEventRequest } from "../models/GetEventRequest";
import type { Event } from "../entities/Event";

export interface GetEventQuery extends RepoQuery<GetEventRequest, Result<Event, EventError>> {}
