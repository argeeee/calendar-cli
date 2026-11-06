import type { RepoQuery, Result } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { ListCalendarsRequest } from "../models/ListCalendarsRequest";

export interface ListCalendarsQuery
  extends RepoQuery<ListCalendarsRequest, Result<Calendar[], EventFailure>> {}
