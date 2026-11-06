import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventError } from "../errors/EventError";
import type { ListEventsRequest } from "../models/ListEventsRequest";
import type { EventListResult } from "../models/EventListResult";

export interface ListEventsQuery extends RepoQuery<ListEventsRequest, Result<EventListResult, EventError>> {}
