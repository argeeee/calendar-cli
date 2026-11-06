import type { RepoQuery, Result } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { DeleteCalendarRequest } from "../models/DeleteCalendarRequest";

export interface DeleteCalendarQuery
  extends RepoQuery<DeleteCalendarRequest, Result<Calendar, EventFailure>> {}
