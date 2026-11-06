import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { DeleteEventRequest } from "../models/DeleteEventRequest";
import type { Event } from "../entities/Event";

export interface DeleteEventQuery extends RepoQuery<DeleteEventRequest, Result<Event, EventFailure>> {}
