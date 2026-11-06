import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { ListEventsRequest } from "../models/ListEventsRequest";
import type { EventListResult } from "../models/EventListResult";

export interface ListEventsQuery extends RepoQuery<ListEventsRequest, Result<EventListResult, EventFailure>> {}
