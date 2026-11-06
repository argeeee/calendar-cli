import type { RepoQuery, Result } from "../../../../core";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { EventListResult } from "../models/EventListResult";
import type { ListEventsRequest } from "../models/ListEventsRequest";

export interface ListEventsQuery
  extends RepoQuery<
    ListEventsRequest,
    Result<EventListResult, EventFailure>
  > {}
