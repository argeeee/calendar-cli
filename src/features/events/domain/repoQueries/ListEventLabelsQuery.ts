import type { RepoQuery, Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { EventLabel } from "../models/EventLabel";
import type { ListEventLabelsRequest } from "../models/ListEventLabelsRequest";

export interface ListEventLabelsQuery
  extends RepoQuery<
    ListEventLabelsRequest,
    Result<EventLabel[], EventFailure>
  > {}
