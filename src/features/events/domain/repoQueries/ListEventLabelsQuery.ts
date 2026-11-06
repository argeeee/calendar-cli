import type { RepoQuery } from "../../../../core";
import type { Result } from "../../../../core";
import type { EventFailure } from "../failures/EventFailure";
import type { ListEventLabelsRequest } from "../models/ListEventLabelsRequest";
import type { EventLabel } from "../models/EventLabel";

export interface ListEventLabelsQuery extends RepoQuery<ListEventLabelsRequest, Result<EventLabel[], EventFailure>> {}
